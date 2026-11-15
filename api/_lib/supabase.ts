import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl, serviceRoleKey } from './env';
import { ApiError, bearerToken } from './http';

export function isServerSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey() && serviceRoleKey());
}

export function createServiceClient(): SupabaseClient {
  const url = supabaseUrl();
  const key = serviceRoleKey();
  if (!url || !key) {
    throw new ApiError(
      503,
      'SUPABASE_NOT_CONFIGURED',
      'Server database credentials are not configured.',
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function createAnonClient(): SupabaseClient {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url || !key) {
    throw new ApiError(
      503,
      'SUPABASE_NOT_CONFIGURED',
      'Supabase public credentials are not configured.',
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/** A client that forwards the caller's JWT so RLS and auth.uid() apply. */
export function createUserClient(token: string): SupabaseClient {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url || !key) {
    throw new ApiError(503, 'SUPABASE_NOT_CONFIGURED', 'Supabase public credentials are not configured.');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export interface AuthenticatedUser {
  user: User;
  token: string;
}

/**
 * Verifies the caller's Supabase access token server-side. The client-supplied
 * user ID is never trusted; it always comes from the verified token.
 */
export async function requireUser(request: Request): Promise<AuthenticatedUser> {
  const token = bearerToken(request);
  if (!token) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Sign in is required.');
  }

  const client = createAnonClient();
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Your session is invalid or has expired.');
  }
  return { user: data.user, token };
}

/** Verify a password by attempting a server-side password sign-in. */
export async function verifyPassword(email: string, password: string): Promise<boolean> {
  if (!email || !password) return false;
  const client = createAnonClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  return !error;
}
