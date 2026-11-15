import { ApiError, handleError, json, requireMethod } from '../_lib/http';
import { applyNormalizedEvent } from '../_lib/billing';
import { getPaymentProvider } from '../_lib/payments';
import { checkRateLimit } from '../_lib/rate-limit';
import { createServiceClient, createUserClient, requireUser } from '../_lib/supabase';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  try {
    requireMethod(request, 'POST');
    const { user, token } = await requireUser(request);
    checkRateLimit(`reconcile:${user.id}`, 5, 60_000);

    const service = createServiceClient();
    const { data: subscription, error } = await service
      .from('subscriptions')
      .select('id,provider,provider_subscription_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      throw new ApiError(503, 'BILLING_UNAVAILABLE', 'Billing is temporarily unavailable.');
    }
    if (!subscription) {
      throw new ApiError(404, 'NO_SUBSCRIPTION', 'No subscription was found.');
    }

    const provider = getPaymentProvider();
    if (!provider.isConfigured()) {
      throw new ApiError(503, 'PAYMENTS_NOT_CONFIGURED', 'The billing provider is not configured.');
    }
    if (typeof provider.retrieveSubscription !== 'function' || !subscription.provider_subscription_id) {
      throw new ApiError(
        501,
        'RECONCILIATION_UNSUPPORTED',
        'This payment provider does not expose server-side reconciliation yet.',
      );
    }

    const remote = await provider.retrieveSubscription(subscription.provider_subscription_id);
    if (!remote) {
      throw new ApiError(
        501,
        'RECONCILIATION_UNSUPPORTED',
        'No authoritative remote subscription could be fetched.',
      );
    }

    await applyNormalizedEvent(service, {
      eventType: 'subscription.reconciled',
      subscription: {
        ...remote,
        provider: provider.key,
        provider_subscription_id: subscription.provider_subscription_id,
        user_id: remote.user_id ?? user.id,
        event_type: 'subscription.reconciled',
        source: 'reconcile',
        occurred_at: new Date().toISOString(),
      },
    });

    await service.rpc('billing_expire_stale_subscriptions');

    const userClient = createUserClient(token);
    const { data: snapshot, error: snapshotError } = await userClient.rpc('entitlement_snapshot');
    if (snapshotError) {
      throw new ApiError(502, 'SNAPSHOT_FAILED', 'Could not load the refreshed entitlement snapshot.');
    }
    return json({ reconciled: true, snapshot });
  } catch (error) {
    return handleError(error);
  }
}
