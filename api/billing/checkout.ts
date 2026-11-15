import { ApiError, clientIp, handleError, json, readJsonObject, requireMethod } from '../_lib/http';
import { siteUrl } from '../_lib/env';
import { isBillingInterval } from '../_lib/billing';
import { getPaymentProvider } from '../_lib/payments';
import { checkRateLimit } from '../_lib/rate-limit';
import { createServiceClient, requireUser } from '../_lib/supabase';

export const config = { runtime: 'edge' };

interface PriceRow {
  id: string;
  plan_key: string;
  billing_interval: 'month' | 'year';
  amount_cents: number;
  currency: string;
  provider: string;
  provider_price_id: string | null;
}

export default async function handler(request: Request): Promise<Response> {
  try {
    requireMethod(request, 'POST');
    const { user } = await requireUser(request);
    checkRateLimit(`checkout:${user.id}`, 8, 60_000);
    checkRateLimit(`checkout-ip:${clientIp(request)}`, 20, 60_000);

    const body = await readJsonObject(request);
    if (!isBillingInterval(body.interval)) {
      throw new ApiError(400, 'INVALID_INTERVAL', 'Choose the monthly or yearly plan.');
    }
    if (body.plan_key !== undefined && body.plan_key !== 'pro') {
      throw new ApiError(400, 'INVALID_PLAN', 'Only the Pro plan can be purchased.');
    }

    const provider = getPaymentProvider();
    if (!provider.isConfigured()) {
      throw new ApiError(
        503,
        'PAYMENTS_NOT_CONFIGURED',
        'Checkout is not available yet. No payment has been taken.',
      );
    }

    const service = createServiceClient();

    const { data: existing, error: existingError } = await service
      .from('subscriptions')
      .select('id,status')
      .eq('user_id', user.id)
      .in('status', ['trialing', 'active', 'past_due'])
      .limit(1);
    if (existingError) {
      throw new ApiError(503, 'BILLING_UNAVAILABLE', 'Billing is temporarily unavailable.');
    }
    if (existing && existing.length > 0) {
      throw new ApiError(409, 'ALREADY_SUBSCRIBED', 'You already have a live subscription.');
    }

    const { data: price, error: priceError } = await service
      .from('prices')
      .select('id,plan_key,billing_interval,amount_cents,currency,provider,provider_price_id')
      .eq('plan_key', 'pro')
      .eq('billing_interval', body.interval)
      .eq('provider', provider.key)
      .eq('is_active', true)
      .maybeSingle<PriceRow>();
    if (priceError) {
      throw new ApiError(503, 'BILLING_UNAVAILABLE', 'Billing is temporarily unavailable.');
    }
    if (!price || !price.provider_price_id) {
      throw new ApiError(
        503,
        'PRICE_NOT_CONFIGURED',
        'This plan is not configured with the payment provider. No payment has been taken.',
      );
    }

    const base = siteUrl();
    const checkout = await provider.createCheckout({
      userId: user.id,
      userEmail: user.email ?? '',
      planKey: 'pro',
      interval: body.interval,
      priceId: price.id,
      providerPriceId: price.provider_price_id,
      successUrl: `${base}/billing?checkout=success`,
      cancelUrl: `${base}/billing?checkout=cancelled`,
    });

    const { error: pendingError } = await service.rpc('billing_create_pending_subscription', {
      p_provider: provider.key,
      p_user_id: user.id,
      p_plan_key: 'pro',
      p_price_id: price.id,
      p_checkout_session_id: checkout.providerCheckoutSessionId,
    });
    if (pendingError) {
      console.error('[billing] could not create pending subscription', pendingError.message);
      throw new ApiError(503, 'BILLING_UNAVAILABLE', 'Could not start checkout. No payment has been taken.');
    }

    return json({
      url: checkout.url,
      provider: provider.key,
      testMode: checkout.testMode,
      amount_cents: price.amount_cents,
      currency: price.currency,
    });
  } catch (error) {
    return handleError(error);
  }
}
