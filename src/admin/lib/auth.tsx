import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import type { AdminUser } from '../types';
import type { Role } from './permissions';

interface AuthContextValue {
  configured: boolean;
  initializing: boolean;
  session: Session | null;
  user: User | null;
  profile: AdminUser | null;
  role: Role | null;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message: unknown }).message);
    // Never echo backend internals; surface a safe, generic message.
    if (/invalid login credentials/i.test(msg)) return 'Incorrect email or password.';
    if (/email not confirmed/i.test(msg)) return 'This account has not been confirmed.';
    if (/rate limit|too many/i.test(msg)) return 'Too many attempts. Please wait and try again.';
    return fallback;
  }
  return fallback;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const configured = isSupabaseConfigured;
  const [initializing, setInitializing] = useState(configured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (user: User | null) => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }
    const { data, error: err } = await supabase
      .from('admin_users')
      .select('user_id,email,role,display_name,is_active,created_at,updated_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (err) {
      // A permission error here means the signed-in account is not an
      // administrator (no readable row under RLS).
      setProfile(null);
      setError('This account does not have administrator access.');
      return;
    }
    setError(null);
    setProfile((data as AdminUser | null) ?? null);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      loadProfile(data.session?.user ?? null).finally(() => {
        if (alive) setInitializing(false);
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!alive) return;
      setSession(newSession);
      if (event === 'SIGNED_OUT' || !newSession) {
        setProfile(null);
      } else {
        loadProfile(newSession.user);
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Authentication backend is not configured.' };
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err) {
      const msg = normalizeError(err, 'Sign-in failed. Please try again.');
      setError(msg);
      return { error: msg };
    }
    return {};
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, []);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      if (!supabase) return { error: 'Authentication backend is not configured.' };
      const redirectTo = `${window.location.origin}/admin/reset-password`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (err) return { error: normalizeError(err, 'Could not send the reset email.') };
      return {};
    },
    [],
  );

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) return { error: 'Authentication backend is not configured.' };
    if (password.length < 12) return { error: 'Use at least 12 characters.' };
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) return { error: normalizeError(err, 'Could not update the password.') };
    return {};
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured,
      initializing,
      session,
      user: session?.user ?? null,
      profile: profile && profile.is_active ? profile : null,
      role: profile && profile.is_active ? profile.role : null,
      error,
      signIn,
      signOut,
      requestPasswordReset,
      updatePassword,
      refreshProfile: () => loadProfile(session?.user ?? null),
    }),
    [configured, initializing, session, profile, error, signIn, signOut, requestPasswordReset, updatePassword, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
