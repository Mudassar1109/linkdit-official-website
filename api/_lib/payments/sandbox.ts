import { env, isProduction } from '../env';
import { ApiError } from '../http';
import { PaymentNotConfiguredError } from './disabled';
import type {
  CancelSubscriptionInput,
  CheckoutRequest,
  CheckoutResult,
  NormalizedEvent,
  PaymentProvider,
  SubscriptionState,
  SubscriptionStatus,
  TransactionState,
  VerifiedWebhook,
} from './types';

const MAX_SKEW_SECONDS = 300;
const VALID_STATUSES: SubscriptionStatus[] = [
  'pending',
  'trialing',
  'active',
  'past_due',
  'cancelled',
  'expired',
  'refunded',
];

function appendQuery(url: string, params: Record<string, string>): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${new URLSearchParams(params).toString()}`;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export interface SandboxWebhookPayload {
  id?: unknown;
  type?: unknown;
  created?: unknown;
  data?: unknown;
}

/**
 * Test-only payment provider. It never contacts a payment network and never
 * charges money. It exists so the checkout, webhook, idempotency, lifecycle and
 * entitlement paths can be exercised locally and in automated tests.
 *
 * It is refused in production unless ALLOW_SANDBOX_PAYMENTS=true is explicitly
 * set. A real merchant/provider adapter must replace it before launch.
 */
export class SandboxPaymentProvider implements PaymentProvider {
  key = 'sandbox';
  testMode = true;

  private secret(): string | undefined {
    return env('PAYMENT_SANDBOX_SECRET');
  }

  isConfigured(): boolean {
    if (!this.secret()) return false;
    if (isProduction() && env('ALLOW_SANDBOX_PAYMENTS') !== 'true') return false;
    return true;
  }

  private requireConfigured(): string {
    const secret = this.secret();
    if (!secret) {
      throw new PaymentNotConfiguredError(
        'Sandbox payments need PAYMENT_SANDBOX_SECRET. No charge can be made.',
      );
    }
    if (isProduction() && env('ALLOW_SANDBOX_PAYMENTS') !== 'true') {
      throw new PaymentNotConfiguredError(
        'Sandbox payments are disabled in production. Configure a real payment provider.',
      );
    }
    return secret;
  }

  async createCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
    this.requireConfigured();
    if (!request.providerPriceId) {
      throw new ApiError(503, 'PRICE_NOT_CONFIGURED', 'No sandbox price is configured.');
    }
    const sessionId = `sbx_cs_${crypto.randomUUID()}`;
    return {
      provider: this.key,
      url: appendQuery(request.successUrl, {
        checkout: 'success',
        session_id: sessionId,
        provider: this.key,
        test_mode: '1',
      }),
      providerCheckoutSessionId: sessionId,
      testMode: true,
    };
  }

  async verifyWebhook(input: { rawBody: string; headers: Headers }): Promise<VerifiedWebhook> {
    const secret = this.requireConfigured();
    const signature = input.headers.get('x-typodocs-signature');
    if (!signature) {
      throw new ApiError(401, 'INVALID_SIGNATURE', 'Missing webhook signature.');
    }

    const parts = signature.split(',').reduce<Record<string, string>>((acc, part) => {
      const [key, value] = part.split('=');
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});

    const timestamp = Number(parts.t);
    const received = parts.v1;
    if (!Number.isFinite(timestamp) || !received) {
      throw new ApiError(401, 'INVALID_SIGNATURE', 'Malformed webhook signature.');
    }
    if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > MAX_SKEW_SECONDS) {
      throw new ApiError(401, 'STALE_WEBHOOK', 'Webhook timestamp is outside the allowed window.');
    }

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const digest = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`${parts.t}.${input.rawBody}`),
    );
    if (!timingSafeEqualHex(toHex(digest), received.toLowerCase())) {
      throw new ApiError(401, 'INVALID_SIGNATURE', 'Webhook signature does not match.');
    }

    let payload: SandboxWebhookPayload;
    try {
      payload = JSON.parse(input.rawBody) as SandboxWebhookPayload;
    } catch {
      throw new ApiError(400, 'INVALID_JSON', 'Webhook body must be valid JSON.');
    }

    const eventId = typeof payload.id === 'string' ? payload.id : '';
    const eventType = typeof payload.type === 'string' ? payload.type : '';
    if (!eventId || !eventType) {
      throw new ApiError(400, 'INVALID_EVENT', 'Webhook event needs id and type.');
    }

    return {
      provider: this.key,
      eventId,
      eventType,
      payload,
      occurredAt:
        typeof payload.created === 'number'
          ? new Date(payload.created * 1000).toISOString()
          : typeof payload.created === 'string'
            ? payload.created
            : undefined,
    };
  }

  normalizeEvent(event: VerifiedWebhook): NormalizedEvent {
    if (event.provider !== this.key) {
      throw new ApiError(400, 'INVALID_PROVIDER', 'Unexpected webhook provider.');
    }
    const payload = event.payload as SandboxWebhookPayload;
    const data = (payload.data ?? {}) as Record<string, unknown>;
    const subscriptionId = typeof data.subscription_id === 'string' ? data.subscription_id : '';
    const status = typeof data.status === 'string' ? data.status : '';

    if (!subscriptionId || !VALID_STATUSES.includes(status as SubscriptionStatus)) {
      throw new ApiError(400, 'INVALID_EVENT', 'Webhook subscription data is incomplete.');
    }

    const subscription: SubscriptionState = {
      provider: this.key,
      provider_event_id: event.eventId,
      event_type: event.eventType,
      source: 'webhook',
      user_id: typeof data.user_id === 'string' ? data.user_id : undefined,
      provider_customer_id:
        typeof data.customer_id === 'string' ? data.customer_id : undefined,
      provider_subscription_id: subscriptionId,
      provider_checkout_session_id:
        typeof data.checkout_session_id === 'string' ? data.checkout_session_id : undefined,
      provider_status:
        typeof data.provider_status === 'string' ? data.provider_status : undefined,
      plan_key: 'pro',
      status: status as SubscriptionStatus,
      current_period_start:
        typeof data.current_period_start === 'string' ? data.current_period_start : undefined,
      current_period_end:
        typeof data.current_period_end === 'string' ? data.current_period_end : undefined,
      trial_end: typeof data.trial_end === 'string' ? data.trial_end : undefined,
      cancel_at_period_end: Boolean(data.cancel_at_period_end),
      occurred_at: event.occurredAt,
      metadata: { sandbox: true, event_type: event.eventType },
    };

    let transaction: TransactionState | undefined;
    const txn = data.transaction as Record<string, unknown> | undefined;
    if (txn && typeof txn.id === 'string' && typeof txn.kind === 'string') {
      const txnStatus = typeof txn.status === 'string' ? txn.status : 'succeeded';
      if (!['pending', 'succeeded', 'failed', 'refunded'].includes(txnStatus)) {
        throw new ApiError(400, 'INVALID_EVENT', 'Invalid transaction status.');
      }
      transaction = {
        provider: this.key,
        provider_event_id: event.eventId,
        provider_transaction_id: txn.id,
        provider_subscription_id: subscriptionId,
        user_id: subscription.user_id,
        kind: txn.kind as TransactionState['kind'],
        status: txnStatus as TransactionState['status'],
        amount_cents: Number(txn.amount_cents ?? 0),
        currency: String(txn.currency ?? 'usd').toLowerCase(),
        description: typeof txn.description === 'string' ? txn.description : undefined,
        occurred_at: event.occurredAt,
      };
    }

    return { eventType: event.eventType, subscription, transaction };
  }

  async cancelSubscription(_input: CancelSubscriptionInput): Promise<void> {
    this.requireConfigured();
    // Sandbox has no external recurring charge. The database records the
    // cancellation; no external state exists to change.
  }

  async retrieveSubscription(_providerSubscriptionId: string): Promise<SubscriptionState | null> {
    this.requireConfigured();
    // Sandbox is stateless: reconciliation requires a real provider adapter.
    return null;
  }
}
