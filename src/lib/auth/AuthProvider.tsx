import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../supabase';

export interface CustomerProfile {
  user_id: string;
  email: string;
  display_name: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

  interface AuthContextValue {
    configured: boolean;
    initializing: boolean;
    session: Session | null;
    user: User | null;
    profile: CustomerProfile | null;
    error: string | null;
    signUp: (
      email: string,
      password: string,
      displayName: string,
    ) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
    signIn: (email: string, password: string) => Promise<{ error?: string }>;
    signInWithGoogle: () => Promise<{ error?: string }>;
    signInWithGithub: () => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error?: string }>;
  changeEmail: (newEmail: string) => Promise<{ error?: string }>;
  updateProfile: (displayName: string) => Promise<{ error?: string }>;
  resendVerification: (email: string) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
  deleteAccount: (password: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message: unknown }).message);
    if (/invalid login credentials/i.test(msg)) return 'Incorrect email or password.';
    if (/email not confirmed/i.test(msg)) return 'This email has not been verified yet.';
    if (/rate limit|too many/i.test(msg)) return 'Too many attempts. Please wait and try again.';
    if (/password/i.test(msg) && /weak|short|characters/i.test(msg)) {
      return 'Choose a stronger password (at least 12 characters, letters and numbers).';
    }
    if (/already registered|already exists/i.test(msg)) return 'That email cannot be used. Try signing in instead.';
    if (/same.*password/i.test(msg)) return 'The new password must be different from the current one.';
    return fallback;
  }
  return fallback;
}

async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { error?: { message?: string } };
    return body?.error?.message || fallback;
  } catch {
    return fallback;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const configured = isSupabaseConfigured;
  const [initializing, setInitializing] = useState(configured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (user: User | null) => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('user_id,email,display_name,locale,created_at,updated_at')
      .eq('user_id', user.id)
      .maybeSingle();
    if (profileError) {
      setProfile(null);
      return;
    }
    setProfile((data as CustomerProfile | null) ?? null);
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

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!alive) return;
      setSession(newSession);
      if (!newSession) {
        setProfile(null);
      } else {
        void loadProfile(newSession.user);
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    if (!supabase) return { error: 'Accounts are not configured yet.' };
    setError(null);
    const redirectTo = `${window.location.origin}/verify-email`;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { display_name: displayName.trim() || null },
      },
    });
    if (signUpError) {
      const msg = normalizeError(signUpError, 'Could not create the account.');
      setError(msg);
      return { error: msg };
    }
    return { needsEmailConfirmation: !data.session };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Accounts are not configured yet.' };
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      const msg = normalizeError(signInError, 'Sign-in failed. Please try again.');
      setError(msg);
      return { error: msg };
    }
    return {};
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return { error: 'Accounts are not configured yet.' };
    setError(null);
    const redirectTo = `${window.location.origin}/account`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (oauthError) {
      const msg = normalizeError(oauthError, 'Could not sign in with Google.');
      setError(msg);
      return { error: msg };
    }
    return {};
  }, []);

  const signInWithGithub = useCallback(async () => {
    if (!supabase) return { error: 'Accounts are not configured yet.' };
    setError(null);
    const redirectTo = `${window.location.origin}/account`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo,
      },
    });
    if (oauthError) {
      const msg = normalizeError(oauthError, 'Could not sign in with GitHub.');
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

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!supabase) return { error: 'Accounts are not configured yet.' };
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });
    if (resetError && /rate limit|too many/i.test(resetError.message)) {
      return { error: 'Too many reset emails. Please wait and try again.' };
    }
    // Do not reveal whether the address exists.
    return {};
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) return { error: 'Accounts are not configured yet.' };
    if (password.length < 12) return { error: 'Use at least 12 characters.' };
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) return { error: normalizeError(passwordError, 'Could not update the password.') };
    return {};
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!supabase || !session?.user.email) return { error: 'Sign in is required.' };
      if (newPassword.length < 12) return { error: 'Use at least 12 characters.' };
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword,
      });
      if (verifyError) return { error: 'The current password is incorrect.' };
      const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
      if (passwordError) return { error: normalizeError(passwordError, 'Could not update the password.') };
      return {};
    },
    [session?.user.email],
  );

  const changeEmail = useCallback(async (newEmail: string) => {
    if (!supabase) return { error: 'Accounts are not configured yet.' };
    const { error: emailError } = await supabase.auth.updateUser(
      { email: newEmail.trim() },
      { emailRedirectTo: `${window.location.origin}/account` },
    );
    if (emailError) return { error: normalizeError(emailError, 'Could not change the email address.') };
    return {};
  }, []);

  const updateProfile = useCallback(async (displayName: string) => {
    if (!supabase) return { error: 'Accounts are not configured yet.' };
    const { error: profileError } = await supabase.rpc('account_update_profile', {
      p_display_name: displayName.trim(),
    });
    if (profileError) return { error: 'Could not save the profile.' };
    await loadProfile(session?.user ?? null);
    return {};
  }, [loadProfile, session?.user]);

  const resendVerification = useCallback(async (email: string) => {
    if (!supabase) return { error: 'Accounts are not configured yet.' };
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/verify-email` },
    });
    if (resendError && /rate limit|too many/i.test(resendError.message)) {
      return { error: 'Too many emails. Please wait and try again.' };
    }
    return {};
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(session?.user ?? null);
  }, [loadProfile, session?.user]);

  const deleteAccount = useCallback(
    async (password: string) => {
      if (!supabase || !session?.access_token) return { error: 'Sign in is required.' };
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ confirm: 'DELETE', password }),
      });
      if (!response.ok) {
        return { error: await readApiError(response, 'Could not delete the account.') };
      }
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      return {};
    },
    [session?.access_token],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      configured,
      initializing,
      session,
      user: session?.user ?? null,
      profile,
      error,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithGithub,
      signOut,
      requestPasswordReset,
      updatePassword,
      changePassword,
      changeEmail,
      updateProfile,
      resendVerification,
      refreshProfile,
      deleteAccount,
    }),
    [
      configured,
      initializing,
      session,
      profile,
      error,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithGithub,
      signOut,
      requestPasswordReset,
      updatePassword,
      changePassword,
      changeEmail,
      updateProfile,
      resendVerification,
      refreshProfile,
      deleteAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
