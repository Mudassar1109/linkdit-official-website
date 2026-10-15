import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client.
 *
 * SECURITY:
 * - Only the PUBLIC / publishable (anon) key is ever read here. It is safe to
 *   ship to the browser *only because* every exposed table has Row Level
 *   Security enabled with explicit role policies (see /supabase/migrations).
 * - The service_role key must NEVER appear in frontend code, logs, or env
 *   files consumed by Vite (anything prefixed with VITE_ is bundled).
 *
 * If the project is not configured the client is `null`; the admin UI then
 * renders an explicit "awaiting configuration" state instead of pretending to
 * be authenticated. The public website never depends on Supabase.
 */
const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Admin sessions are same-tab; avoids cross-tab token leakage surprises.
        storageKey: 'linkdit-admin-auth',
      },
    })
  : null;

/** Thrown by data-access helpers when the backend is not configured. */
export class BackendNotConfiguredError extends Error {
  constructor() {
    super(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    );
    this.name = 'BackendNotConfiguredError';
  }
}

/** Return the client or throw a typed, non-secret error. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new BackendNotConfiguredError();
  return supabase;
}
