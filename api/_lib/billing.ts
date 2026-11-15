import type { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from './http';
import type { NormalizedEvent } from './payments/types';

export async function applyNormalizedEvent(
  service: SupabaseClient,
  event: NormalizedEvent,
): Promise<void> {
  if (event.subscription) {
    const { error } = await service.rpc('billing_apply_subscription_state', {
      p_payload: event.subscription,
    });
    if (error) {
      console.error('[billing] subscription apply failed', error.message);
      throw new ApiError(502, 'BILLING_APPLY_FAILED', 'Could not apply subscription state.');
    }
  }

  if (event.transaction) {
    const { error } = await service.rpc('billing_record_transaction', {
      p_payload: event.transaction,
    });
    if (error) {
      console.error('[billing] transaction apply failed', error.message);
      throw new ApiError(502, 'BILLING_APPLY_FAILED', 'Could not record payment transaction.');
    }
  }
}

export function isBillingInterval(value: unknown): value is 'month' | 'year' {
  return value === 'month' || value === 'year';
}

export function assertUuid(value: unknown, label: string): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new ApiError(400, 'INVALID_INPUT', `${label} is invalid.`);
  }
  return value;
}
