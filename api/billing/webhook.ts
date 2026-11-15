import { ApiError, handleError, json, requireMethod } from '../_lib/http';
import { applyNormalizedEvent } from '../_lib/billing';
import { getPaymentProvider } from '../_lib/payments';
import { createServiceClient } from '../_lib/supabase';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  try {
    requireMethod(request, 'POST');

    const provider = getPaymentProvider();
    if (!provider.isConfigured()) {
      throw new ApiError(503, 'PAYMENTS_NOT_CONFIGURED', 'Webhook provider is not configured.');
    }

    // The raw body must be used for signature verification. Never verify a
    // re-serialized object: that would allow signature confusion.
    const rawBody = await request.text();
    if (!rawBody) {
      throw new ApiError(400, 'EMPTY_BODY', 'Webhook body is empty.');
    }

    let verified;
    try {
      verified = await provider.verifyWebhook({ rawBody, headers: request.headers });
    } catch (error) {
      if (error instanceof ApiError) return handleError(error);
      throw new ApiError(401, 'INVALID_SIGNATURE', 'Webhook verification failed.');
    }

    const service = createServiceClient();
    const { data: registration, error: registerError } = await service.rpc(
      'billing_register_event',
      {
        p_provider: verified.provider,
        p_event_id: verified.eventId,
        p_event_type: verified.eventType,
        p_payload: verified.payload,
        p_signature_verified: true,
      },
    );
    if (registerError) {
      console.error('[webhook] event registration failed', registerError.message);
      throw new ApiError(503, 'WEBHOOK_STORE_FAILED', 'Could not record webhook event.');
    }

    if (registration && registration.status === 'duplicate') {
      return json({ received: true, duplicate: true });
    }

    try {
      const normalized = provider.normalizeEvent(verified);
      const subscription = normalized.subscription;

      if (subscription && !subscription.user_id && subscription.provider_customer_id) {
        const { data: customer } = await service
          .from('billing_customers')
          .select('user_id')
          .eq('provider', subscription.provider)
          .eq('provider_customer_id', subscription.provider_customer_id)
          .maybeSingle();
        if (customer?.user_id) subscription.user_id = customer.user_id;
      }
      if (subscription && !subscription.user_id) {
        const { data: existing } = await service
          .from('subscriptions')
          .select('user_id')
          .eq('provider', subscription.provider)
          .eq('provider_subscription_id', subscription.provider_subscription_id)
          .maybeSingle();
        if (existing?.user_id) subscription.user_id = existing.user_id;
      }

      await applyNormalizedEvent(service, normalized);
      await service.rpc('billing_finish_event', {
        p_provider: verified.provider,
        p_event_id: verified.eventId,
        p_status: 'processed',
        p_error: null,
      });

      return json({ received: true, duplicate: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Processing failed';
      console.error('[webhook] processing failed', verified.provider, verified.eventType, message);
      await service.rpc('billing_finish_event', {
        p_provider: verified.provider,
        p_event_id: verified.eventId,
        p_status: 'error',
        p_error: message,
      });
      throw error;
    }
  } catch (error) {
    return handleError(error);
  }
}
