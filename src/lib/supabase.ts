import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Public-facing Supabase client for customer accounts.
 *
 * Only the publishable/anon key is used. Customer tables are protected by RLS
 * (see supabase/migrations/0011_accounts_billing.sql). The service-role key is
 * never imported into browser code.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'typodocs-customer-auth',
      },
    })
  : null;

export class AuthNotConfiguredError extends Error {
  constructor() {
    super('Accounts are not configured yet.');
    this.name = 'AuthNotConfiguredError';
  }
}

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new AuthNotConfiguredError();
  return supabase;
}
