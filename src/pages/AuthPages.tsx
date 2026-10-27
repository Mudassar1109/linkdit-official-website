import React, { useState } from 'react';
import { PageId } from '../types';
import { PRODUCT_NAME } from '../data/websiteData';
import { useAuth } from '../lib/auth/AuthProvider';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Github,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react';

interface AuthPageProps {
  navigate: (page: PageId) => void;
}

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mute/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-line-dark dark:bg-ink-900 dark:text-paper dark:placeholder:text-paper/35';

const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-ink-mute dark:text-paper/55';
const primaryButton =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-paper dark:text-ink dark:hover:bg-paper/90';
const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink dark:border-line-dark dark:text-paper dark:hover:border-paper';
const oauthButton =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-paper-2/70 disabled:cursor-not-allowed disabled:opacity-60 dark:border-line-dark dark:text-paper dark:hover:border-paper dark:hover:bg-ink-900/70';

const AuthShell: React.FC<{
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ eyebrow, title, subtitle, children, footer }) => (
  <div className="font-sans">
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:py-20">
      <div className="rounded-card border border-line bg-surface p-6 shadow-card dark:border-line-dark dark:bg-ink-850 sm:p-8">
        <div className="mb-6 space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            {eyebrow}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-paper">{title}</h1>
          <p className="text-sm leading-relaxed text-ink-soft dark:text-paper/65">{subtitle}</p>
        </div>
        {children}
      </div>
      {footer && <div className="mt-5 text-center text-xs text-ink-soft dark:text-paper/60">{footer}</div>}
      <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-mute dark:text-paper/45">
        Free plan needs no account. Signing in is only required for Pro subscription and billing
        management. {PRODUCT_NAME} never stores your documents in the cloud.
      </p>
    </div>
  </div>
);

const NotConfiguredNotice: React.FC = () => (
  <div className="rounded-lg border border-amber-500/30 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
    Accounts are not configured on this deployment yet. Set the Supabase public environment
    variables. No sign-in, payment, or subscription can occur until then.
  </div>
);

const FormMessage: React.FC<{ tone: 'error' | 'success' | 'info'; children: React.ReactNode }> = ({
  tone,
  children,
}) => {
  const styles =
    tone === 'error'
      ? 'border-danger/30 bg-danger/5 text-danger'
      : tone === 'success'
        ? 'border-emerald-600/30 bg-emerald-600/5 text-emerald-800 dark:text-emerald-300'
        : 'border-line bg-paper-2/60 text-ink-soft dark:border-line-dark dark:bg-ink-900 dark:text-paper/65';
  const Icon = tone === 'error' ? AlertCircle : CheckCircle2;
  return (
    <div className={`flex items-start gap-2 rounded-lg border p-3 text-xs leading-relaxed ${styles}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
};

const Spinner: React.FC = () => <Loader2 className="h-4 w-4 animate-spin" />;

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export const SignInPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { configured, user, signIn, signInWithGoogle, signInWithGithub } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [oauthSubmitting, setOauthSubmitting] = useState<'google' | 'github' | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!isEmail(email)) return setError('Enter a valid email address.');
    if (!password) return setError('Enter your password.');
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) return setError(result.error);
    navigate('account');
  };

  const handleGoogle = async () => {
    setError(null);
    setOauthSubmitting('google');
    const result = await signInWithGoogle();
    setOauthSubmitting(null);
    if (result.error) setError(result.error);
  };

  const handleGithub = async () => {
    setError(null);
    setOauthSubmitting('github');
    const result = await signInWithGithub();
    setOauthSubmitting(null);
    if (result.error) setError(result.error);
  };

  if (!configured) {
    return (
      <AuthShell eyebrow="Account" title="Sign in" subtitle="Access your TypoDocs subscription and billing.">
        <NotConfiguredNotice />
      </AuthShell>
    );
  }

  if (user) {
    return (
      <AuthShell eyebrow="Account" title="You are signed in" subtitle="Manage your profile, plan and billing.">
        <div className="space-y-3">
          <button type="button" onClick={() => navigate('account')} className={primaryButton}>
            Open account <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => navigate('billing')} className={secondaryButton + ' w-full'}>
            Billing & subscription
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Sign in"
      subtitle="Access your TypoDocs subscription and billing."
      footer={
        <>
          New here?{' '}
          <button type="button" onClick={() => navigate('sign-up')} className="font-semibold text-accent-deep hover:underline dark:text-blue-300">
            Create an account
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" disabled={oauthSubmitting !== null} onClick={handleGoogle} className={oauthButton}>
            {oauthSubmitting === 'google' ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>
          <button type="button" disabled={oauthSubmitting !== null} onClick={handleGithub} className={oauthButton}>
            {oauthSubmitting === 'github' ? <Spinner /> : <Github className="h-4 w-4" />}
            Continue with GitHub
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line dark:border-line-dark" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-2 text-ink-mute dark:bg-ink-850 dark:text-paper/50">or</span>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="signin-email" className={labelClass}>Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-paper/40" />
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass + ' pl-9'}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="signin-password" className={labelClass}>Password</label>
              <button
                type="button"
                onClick={() => navigate('forgot-password')}
                className="text-[11px] font-semibold text-accent-deep hover:underline dark:text-blue-300"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-paper/40" />
              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass + ' pl-9'}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={submitting || oauthSubmitting !== null} className={primaryButton}>
            {submitting ? <Spinner /> : null}
            {submitting ? 'Signing in…' : 'Sign in with email'}
          </button>
        </form>
      </div>
    </AuthShell>
  );
};

export const SignUpPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { configured, signUp, signInWithGoogle, signInWithGithub } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [oauthSubmitting, setOauthSubmitting] = useState<'google' | 'github' | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!isEmail(email)) return setError('Enter a valid email address.');
    if (password.length < 12) return setError('Use at least 12 characters for your password.');
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return setError('Use upper-case and lower-case letters and at least one number.');
    }
    if (password !== confirm) return setError('The passwords do not match.');
    setSubmitting(true);
    const result = await signUp(email, password, displayName);
    setSubmitting(false);
    if (result.error) return setError(result.error);
    if (result.needsEmailConfirmation) {
      setSent(true);
    } else {
      navigate('account');
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setOauthSubmitting('google');
    const result = await signInWithGoogle();
    setOauthSubmitting(null);
    if (result.error) setError(result.error);
  };

  const handleGithub = async () => {
    setError(null);
    setOauthSubmitting('github');
    const result = await signInWithGithub();
    setOauthSubmitting(null);
    if (result.error) setError(result.error);
  };

  if (!configured) {
    return (
      <AuthShell eyebrow="Account" title="Create an account" subtitle="An account is required for Pro.">
        <NotConfiguredNotice />
      </AuthShell>
    );
  }

  if (sent) {
    return (
      <AuthShell
        eyebrow="Check your email"
        title="Verify your email"
        subtitle={`We sent a verification link to ${email}. Open it to finish creating your account.`}
      >
        <div className="space-y-3">
          <FormMessage tone="info">
            The link expires. If it does not arrive, check spam or resend it from the verification
            page.
          </FormMessage>
          <button type="button" onClick={() => navigate('verify-email')} className={primaryButton}>
            Verification help <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => navigate('sign-in')} className={secondaryButton + ' w-full'}>
            Back to sign in
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Create an account"
      subtitle="An account is only needed for Pro subscription and billing."
      footer={
        <>
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('sign-in')} className="font-semibold text-accent-deep hover:underline dark:text-blue-300">
            Sign in
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" disabled={oauthSubmitting !== null} onClick={handleGoogle} className={oauthButton}>
            {oauthSubmitting === 'google' ? <Spinner /> : <GoogleIcon />}
            Sign up with Google
          </button>
          <button type="button" disabled={oauthSubmitting !== null} onClick={handleGithub} className={oauthButton}>
            {oauthSubmitting === 'github' ? <Spinner /> : <Github className="h-4 w-4" />}
            Sign up with GitHub
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line dark:border-line-dark" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-2 text-ink-mute dark:bg-ink-850 dark:text-paper/50">or</span>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="signup-name" className={labelClass}>Display name (optional)</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-paper/40" />
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                maxLength={80}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass + ' pl-9'}
                placeholder="Your name"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="signup-email" className={labelClass}>Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-paper/40" />
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass + ' pl-9'}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="signup-password" className={labelClass}>Password</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
            <p className="text-[11px] text-ink-mute dark:text-paper/45">
              At least 12 characters with upper-case, lower-case letters and a number.
            </p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="signup-confirm" className={labelClass}>Confirm password</label>
            <input
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <button type="submit" disabled={submitting || oauthSubmitting !== null} className={primaryButton}>
            {submitting ? <Spinner /> : null}
            {submitting ? 'Creating account…' : 'Create account with email'}
          </button>
        </form>
      </div>
    </AuthShell>
  );
};

export const ForgotPasswordPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { configured, requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!isEmail(email)) return setError('Enter a valid email address.');
    setSubmitting(true);
    const result = await requestPasswordReset(email);
    setSubmitting(false);
    if (result.error) return setError(result.error);
    setSent(true);
  };

  if (!configured) {
    return (
      <AuthShell eyebrow="Account" title="Reset password" subtitle="Request a secure reset link.">
        <NotConfiguredNotice />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Reset password"
      subtitle="If an account exists for that address, we will send a secure reset link."
      footer={
        <button type="button" onClick={() => navigate('sign-in')} className="font-semibold text-accent-deep hover:underline dark:text-blue-300">
          Back to sign in
        </button>
      }
    >
      {sent ? (
        <FormMessage tone="success">
          If an account exists for {email}, a reset link is on its way. Check your inbox and spam
          folder. For privacy, we do not reveal whether an address is registered.
        </FormMessage>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          {error && <FormMessage tone="error">{error}</FormMessage>}
          <div className="space-y-1.5">
            <label htmlFor="forgot-email" className={labelClass}>Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-paper/40" />
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass + ' pl-9'}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={submitting} className={primaryButton}>
            {submitting ? <Spinner /> : null}
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
};

export const ResetPasswordPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { configured, initializing, user, updatePassword, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password.length < 12) return setError('Use at least 12 characters.');
    if (password !== confirm) return setError('The passwords do not match.');
    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);
    if (result.error) return setError(result.error);
    setDone(true);
  };

  if (!configured) {
    return (
      <AuthShell eyebrow="Account" title="Set a new password" subtitle="Complete your password reset.">
        <NotConfiguredNotice />
      </AuthShell>
    );
  }

  if (initializing) {
    return (
      <AuthShell eyebrow="Account" title="Set a new password" subtitle="Checking your reset link…">
        <div className="flex items-center gap-2 text-sm text-ink-soft dark:text-paper/65">
          <Spinner /> Verifying link…
        </div>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell eyebrow="Account" title="Password updated" subtitle="Sign in again with your new password.">
        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate('sign-in');
          }}
          className={primaryButton}
        >
          Continue to sign in <ArrowRight className="h-4 w-4" />
        </button>
      </AuthShell>
    );
  }

  if (!user) {
    return (
      <AuthShell eyebrow="Account" title="Reset link expired" subtitle="This link is invalid or has expired.">
        <div className="space-y-3">
          <FormMessage tone="error">
            Request a new reset link. For your security, reset links can only be used once.
          </FormMessage>
          <button type="button" onClick={() => navigate('forgot-password')} className={primaryButton}>
            Request a new link
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Account" title="Set a new password" subtitle="Choose a strong password for your account.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <div className="space-y-1.5">
          <label htmlFor="reset-password" className={labelClass}>New password</label>
          <input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
          <p className="text-[11px] text-ink-mute dark:text-paper/45">At least 12 characters.</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="reset-confirm" className={labelClass}>Confirm new password</label>
          <input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <button type="submit" disabled={submitting} className={primaryButton}>
          {submitting ? <Spinner /> : null}
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  );
};

export const VerifyEmailPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { configured, initializing, user, resendVerification } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const verified = Boolean(user?.email_confirmed_at);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!isEmail(email)) return setError('Enter the email address you signed up with.');
    setSubmitting(true);
    const result = await resendVerification(email);
    setSubmitting(false);
    if (result.error) return setError(result.error);
    setMessage('If the account is pending verification, a new email has been sent.');
  };

  return (
    <AuthShell
      eyebrow="Account"
      title={verified ? 'Email verified' : 'Verify your email'}
      subtitle={
        verified
          ? 'Your email address is confirmed. You can now sign in and manage billing.'
          : 'Email verification is required before you can sign in.'
      }
      footer={
        <button type="button" onClick={() => navigate('sign-in')} className="font-semibold text-accent-deep hover:underline dark:text-blue-300">
          Back to sign in
        </button>
      }
    >
      {!configured ? (
        <NotConfiguredNotice />
      ) : initializing ? (
        <div className="flex items-center gap-2 text-sm text-ink-soft dark:text-paper/65">
          <Spinner /> Checking verification status…
        </div>
      ) : verified ? (
        <div className="space-y-3">
          <FormMessage tone="success">Verification complete.</FormMessage>
          <button type="button" onClick={() => navigate('account')} className={primaryButton}>
            Open account <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <FormMessage tone="info">
            Open the verification link in your email. If it expired, request another one below.
          </FormMessage>
          {error && <FormMessage tone="error">{error}</FormMessage>}
          {message && <FormMessage tone="success">{message}</FormMessage>}
          <div className="space-y-1.5">
            <label htmlFor="verify-email" className={labelClass}>Email</label>
            <input
              id="verify-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
              required
            />
          </div>
          <button type="submit" disabled={submitting} className={primaryButton}>
            {submitting ? <Spinner /> : null}
            {submitting ? 'Sending…' : 'Resend verification email'}
          </button>
        </form>
      )}
    </AuthShell>
  );
};
