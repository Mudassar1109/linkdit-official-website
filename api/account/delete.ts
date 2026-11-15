import { ApiError, handleError, json, readJsonObject, requireMethod } from '../_lib/http';
import { getPaymentProvider } from '../_lib/payments';
import { checkRateLimit } from '../_lib/rate-limit';
import { createServiceClient, requireUser, verifyPassword } from '../_lib/supabase';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  try {
    requireMethod(request, 'POST');
    const { user } = await requireUser(request);
    checkRateLimit(`delete-account:${user.id}`, 5, 60 * 60_000);

    const body = await readJsonObject(request);
    if (body.confirm !== 'DELETE') {
      throw new ApiError(400, 'CONFIRMATION_REQUIRED', 'Type DELETE to confirm account deletion.');
    }
    const password = typeof body.password === 'string' ? body.password : '';
    if (!password) {
      throw new ApiError(400, 'PASSWORD_REQUIRED', 'Enter your current password to delete the account.');
    }
    if (!user.email) {
      throw new ApiError(400, 'EMAIL_REQUIRED', 'This account has no email address on file.');
    }

    const valid = await verifyPassword(user.email, password);
    if (!valid) {
      throw new ApiError(401, 'INVALID_PASSWORD', 'The password is incorrect.');
    }

    const service = createServiceClient();
    const { data: subscription, error } = await service
      .from('subscriptions')
      .select('id,status,provider,provider_subscription_id,cancel_at_period_end')
      .eq('user_id', user.id)
      .in('status', ['trialing', 'active', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      throw new ApiError(503, 'BILLING_UNAVAILABLE', 'Billing is temporarily unavailable.');
    }

    if (subscription) {
      const provider = getPaymentProvider();
      if (!provider.isConfigured()) {
        throw new ApiError(
          409,
          'BILLING_PROVIDER_REQUIRED',
          'An active subscription exists. Billing must be configured so the subscription can be cancelled before deletion.',
        );
      }
      if (typeof provider.cancelSubscription !== 'function' || !subscription.provider_subscription_id) {
        throw new ApiError(
          409,
          'CANCELLATION_UNSUPPORTED',
          'An active subscription exists and cannot be cancelled automatically. Contact support.',
        );
      }
      await provider.cancelSubscription({
        userId: user.id,
        providerSubscriptionId: subscription.provider_subscription_id,
        atPeriodEnd: false,
      });
      const { error: cancelError } = await service.rpc('billing_set_cancellation', {
        p_subscription_id: subscription.id,
        p_at_period_end: false,
        p_source: 'account_deletion',
        p_provider_event_id: null,
      });
      if (cancelError) {
        console.error('[account] cancellation before deletion failed', cancelError.message);
        throw new ApiError(502, 'CANCELLATION_NOT_RECORDED', 'Could not cancel the subscription. Account was not deleted.');
      }
    }

    const { error: deleteError } = await service.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error('[account] auth user deletion failed', deleteError.message);
      throw new ApiError(502, 'DELETION_FAILED', 'The account could not be deleted. Contact support.');
    }

    return json({
      deleted: true,
      retention:
        'Profile, session and entitlement data are deleted. Payment/subscription records are retained without a user link for accounting, tax, fraud-prevention and dispute-resolution obligations.',
    });
  } catch (error) {
    return handleError(error);
  }
}
