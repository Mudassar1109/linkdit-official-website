export type BillingInterval = 'month' | 'year';
export type SubscriptionStatus =
  | 'pending'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'refunded';

export interface CheckoutRequest {
  userId: string;
  userEmail: string;
  planKey: 'pro';
  interval: BillingInterval;
  priceId: string;
  providerPriceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  url: string;
  provider: string;
  providerCheckoutSessionId: string;
  testMode: boolean;
}

export interface VerifiedWebhook {
  provider: string;
  eventId: string;
  eventType: string;
  payload: unknown;
  occurredAt?: string;
}

export interface SubscriptionState {
  provider: string;
  provider_event_id?: string;
  event_type: string;
  source?: 'webhook' | 'reconcile' | 'api';
  user_id?: string;
  provider_customer_id?: string;
  provider_subscription_id: string;
  provider_checkout_session_id?: string;
  provider_status?: string;
  plan_key: 'pro';
  status: SubscriptionStatus;
  current_period_start?: string;
  current_period_end?: string;
  trial_end?: string;
  cancel_at_period_end?: boolean;
  occurred_at?: string;
  metadata?: Record<string, unknown>;
}

export interface TransactionState {
  provider: string;
  provider_event_id?: string;
  provider_transaction_id: string;
  provider_subscription_id?: string;
  subscription_id?: string;
  user_id?: string;
  kind: 'payment' | 'refund' | 'adjustment';
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  amount_cents: number;
  currency: string;
  description?: string;
  occurred_at?: string;
}

export interface NormalizedEvent {
  eventType: string;
  subscription?: SubscriptionState;
  transaction?: TransactionState;
}

export interface CancelSubscriptionInput {
  userId: string;
  providerSubscriptionId: string;
  atPeriodEnd: boolean;
}

export interface PaymentProvider {
  key: string;
  testMode: boolean;
  isConfigured(): boolean;
  createCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
  verifyWebhook(input: { rawBody: string; headers: Headers }): Promise<VerifiedWebhook>;
  normalizeEvent(event: VerifiedWebhook): NormalizedEvent;
  cancelSubscription?(input: CancelSubscriptionInput): Promise<void>;
  retrieveSubscription?(providerSubscriptionId: string): Promise<SubscriptionState | null>;
}
