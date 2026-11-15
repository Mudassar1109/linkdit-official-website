import { env } from '../_lib/env';
import { ApiError, handleError, json, readJsonObject, requireMethod } from '../_lib/http';
import { getPaymentProvider } from '../_lib/payments';
import { checkRateLimit } from '../_lib/rate-limit';
import { createServiceClient, requireUser } from '../_lib/supabase';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  try {
    requireMethod(request, 'POST');
    const { user } = await requireUser(request);
    checkRateLimit(`cancel:${user.id}`, 5, 60_000);

    const body = await readJsonObject(request);
    const immediate = body.immediate === true;
    if (immediate && env('BILLING_ALLOW_IMMEDIATE_CANCELLATION') !== 'true') {
      throw new ApiError(
        400,
        'IMMEDIATE_CANCELLATION_DISABLED',
        'Immediate cancellation is not enabled by policy. Cancel at the end of the billing period.',
      );
    }

    const service = createServiceClient();
    const { data: subscription, error } = await service
      .from('subscriptions')
      .select('id,status,provider,provider_subscription_id,cancel_at_period_end,current_period_end')
      .eq('user_id', user.id)
      .in('status', ['trialing', 'active', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      throw new ApiError(503, 'BILLING_UNAVAILABLE', 'Billing is temporarily unavailable.');
    }
    if (!subscription) {
      throw new ApiError(404, 'NO_SUBSCRIPTION', 'No active subscription was found.');
    }
    if (subscription.cancel_at_period_end && !immediate) {
      return json({
        status: subscription.status,
        cancel_at_period_end: true,
        current_period_end: subscription.current_period_end,
      });
    }

    const provider = getPaymentProvider();
    if (!provider.isConfigured()) {
      throw new ApiError(503, 'PAYMENTS_NOT_CONFIGURED', 'The billing provider is not configured.');
    }
    if (typeof provider.cancelSubscription !== 'function' || !subscription.provider_subscription_id) {
      throw new ApiError(501, 'CANCELLATION_UNSUPPORTED', 'This provider cannot cancel from the website.');
    }

    await provider.cancelSubscription({
      userId: user.id,
      providerSubscriptionId: subscription.provider_subscription_id,
      atPeriodEnd: !immediate,
    });

    const { data, error: cancelError } = await service.rpc('billing_set_cancellation', {
      p_subscription_id: subscription.id,
      p_at_period_end: !immediate,
      p_source: 'api',
      p_provider_event_id: null,
    });
    if (cancelError) {
      console.error('[billing] cancellation record failed', cancelError.message);
      throw new ApiError(502, 'CANCELLATION_NOT_RECORDED', 'The provider accepted cancellation, but the status could not be saved. Contact support.');
    }

    return json(data ?? { status: immediate ? 'cancelled' : subscription.status, cancel_at_period_end: !immediate });
  } catch (error) {
    return handleError(error);
  }
}
