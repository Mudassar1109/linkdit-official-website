import type { Session } from '@supabase/supabase-js';
import { requireSupabase } from '../supabase';

export type BillingInterval = 'month' | 'year';

export interface BillingStatus {
  provider: string;
  configured: boolean;
  checkoutAvailable: boolean;
  testMode: boolean;
  currency: string;
  plans?: {
    monthly: { amount_cents: number; display: string };
    yearly: { amount_cents: number; display: string; savings_cents: number };
  };
}

export interface EntitlementSnapshot {
  plan_key: 'free' | 'pro';
  evaluated_at: string;
  entitlements: string[];
  subscription: {
    status: string;
    plan_key: string;
    provider: string;
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    trial_end: string | null;
  } | null;
}

export interface SubscriptionRow {
  id: string;
  plan_key: string;
  status: string;
  provider: string;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  ended_at: string | null;
  last_verified_at: string | null;
  created_at: string;
}

export interface PaymentRow {
  id: string;
  kind: string;
  status: string;
  amount_cents: number;
  currency: string;
  description: string;
  occurred_at: string;
  subscription_id: string | null;
}

const OFFLINE_STATUS: BillingStatus = {
  provider: 'disabled',
  configured: false,
  checkoutAvailable: false,
  testMode: false,
  currency: 'usd',
};

function authHeaders(session: Session): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { error?: { message?: string } };
    return body?.error?.message || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchBillingStatus(): Promise<BillingStatus> {
  try {
    const response = await fetch('/api/billing/status', {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return OFFLINE_STATUS;
    const body = (await response.json()) as BillingStatus;
    return { ...OFFLINE_STATUS, ...body };
  } catch {
    return OFFLINE_STATUS;
  }
}

export async function createCheckout(
  session: Session,
  interval: BillingInterval,
): Promise<{ url?: string; error?: string; testMode?: boolean }> {
  try {
    const response = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({ plan: 'pro', interval }),
    });
    if (!response.ok) {
      return { error: await readError(response, 'Could not start checkout.') };
    }
    const body = (await response.json()) as { url: string; testMode?: boolean };
    return { url: body.url, testMode: body.testMode };
  } catch {
    return { error: 'Billing is not reachable. No payment has been taken.' };
  }
}

export async function cancelSubscription(
  session: Session,
  immediate = false,
): Promise<{ error?: string; status?: string }> {
  try {
    const response = await fetch('/api/billing/cancel', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({ immediate }),
    });
    if (!response.ok) {
      return { error: await readError(response, 'Could not cancel the subscription.') };
    }
    const body = (await response.json()) as { status?: string };
    return { status: body.status };
  } catch {
    return { error: 'Billing is not reachable. Try again later.' };
  }
}

export async function reconcileSubscription(
  session: Session,
): Promise<{ snapshot?: EntitlementSnapshot; error?: string }> {
  try {
    const response = await fetch('/api/billing/reconcile', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      return { error: await readError(response, 'Could not refresh the subscription.') };
    }
    const body = (await response.json()) as { snapshot?: EntitlementSnapshot };
    return { snapshot: body.snapshot };
  } catch {
    return { error: 'Billing is not reachable. Try again later.' };
  }
}

export async function loadEntitlementSnapshot(): Promise<EntitlementSnapshot | null> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('entitlement_snapshot');
  if (error) return null;
  return (data as EntitlementSnapshot | null) ?? null;
}

export async function loadSubscription(userId: string): Promise<SubscriptionRow | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('subscriptions')
    .select(
      'id,plan_key,status,provider,current_period_start,current_period_end,trial_end,cancel_at_period_end,cancelled_at,ended_at,last_verified_at,created_at',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return (data as SubscriptionRow | null) ?? null;
}

export async function loadPaymentHistory(userId: string): Promise<PaymentRow[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('payment_transactions')
    .select('id,kind,status,amount_cents,currency,description,occurred_at,subscription_id')
    .eq('user_id', userId)
    .order('occurred_at', { ascending: false })
    .limit(50);
  if (error) return [];
  return (data as PaymentRow[] | null) ?? [];
}

export function formatMoney(amountCents: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  } catch {
    return `$${(amountCents / 100).toFixed(2)}`;
  }
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
