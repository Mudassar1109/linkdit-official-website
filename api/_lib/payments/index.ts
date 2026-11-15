import { env } from '../env';
import { DisabledPaymentProvider } from './disabled';
import { SandboxPaymentProvider } from './sandbox';
import type { PaymentProvider } from './types';

export function paymentProviderKey(): string {
  return (env('PAYMENT_PROVIDER') ?? 'disabled').toLowerCase();
}

/**
 * Provider factory. Only providers that have a real, reviewed adapter may be
 * added here. Unknown values fail closed to the disabled provider instead of
 * pretending checkout works.
 */
export function getPaymentProvider(): PaymentProvider {
  const key = paymentProviderKey();
  if (key === 'sandbox') return new SandboxPaymentProvider();
  if (key === 'disabled' || key === 'none' || key === '') {
    return new DisabledPaymentProvider();
  }
  return new DisabledPaymentProvider(
    `Payment provider "${key}" has no enabled adapter. Configure a supported provider.`,
  );
}

export type { PaymentProvider } from './types';
