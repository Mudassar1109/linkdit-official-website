import { ApiError } from '../http';
import type {
  CancelSubscriptionInput,
  CheckoutRequest,
  CheckoutResult,
  NormalizedEvent,
  PaymentProvider,
  SubscriptionState,
  VerifiedWebhook,
} from './types';

export class PaymentNotConfiguredError extends ApiError {
  constructor(message = 'Payments are not configured. No charge can be made.') {
    super(503, 'PAYMENTS_NOT_CONFIGURED', message);
  }
}

/**
 * Fail-closed provider. This is the default. It deliberately cannot create a
 * checkout, verify a webhook, or expose a success state.
 */
export class DisabledPaymentProvider implements PaymentProvider {
  key = 'disabled';
  testMode = false;

  constructor(private readonly reason?: string) {}

  isConfigured(): boolean {
    return false;
  }

  async createCheckout(_request: CheckoutRequest): Promise<CheckoutResult> {
    throw new PaymentNotConfiguredError(this.reason);
  }

  async verifyWebhook(_input: { rawBody: string; headers: Headers }): Promise<VerifiedWebhook> {
    throw new PaymentNotConfiguredError(this.reason);
  }

  normalizeEvent(_event: VerifiedWebhook): NormalizedEvent {
    throw new PaymentNotConfiguredError(this.reason);
  }

  async cancelSubscription(_input: CancelSubscriptionInput): Promise<void> {
    throw new PaymentNotConfiguredError(this.reason);
  }

  async retrieveSubscription(_providerSubscriptionId: string): Promise<SubscriptionState | null> {
    throw new PaymentNotConfiguredError(this.reason);
  }
}
