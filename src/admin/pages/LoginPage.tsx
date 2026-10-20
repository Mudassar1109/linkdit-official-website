import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Alert, Button, Field, Input, Panel } from '../components/ui';

const LoginPage: React.FC = () => {
  const { signIn, requestPasswordReset } = useAuth();
  const [mode, setMode] = useState<'signin' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) setError(result.error);
  };

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email.trim()) {
      setError('Enter the account email.');
      return;
    }
    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);
    if (result.error) setError(result.error);
    else setMessage('If that account exists, a password-reset link has been sent to its email address.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070c17] p-6">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <img src="/icon-128.png?v=20260918" alt="" className="mx-auto h-12 w-12 rounded-xl object-contain" />
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <span className="text-lg font-bold text-white">Typodocs</span>
            <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-amber-300">
              ADMIN
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Authorized administrators only</p>
        </div>

        <Panel className="p-6">
          {mode === 'signin' ? (
            <form onSubmit={onSignIn} className="space-y-4" noValidate>
              <Field label="Email" htmlFor="admin-email" required>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </Field>
              <Field label="Password" htmlFor="admin-password" required>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </Field>

              {error && <Alert tone="error">{error}</Alert>}

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Sign in
              </Button>

              <button
                type="button"
                onClick={() => {
                  setMode('reset');
                  setError(null);
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-cyan-300"
              >
                Forgot password?
              </button>
            </form>
          ) : (
            <form onSubmit={onReset} className="space-y-4" noValidate>
              <p className="text-sm text-slate-400">Enter your account email to receive a reset link.</p>
              <Field label="Email" htmlFor="reset-email" required>
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </Field>

              {error && <Alert tone="error">{error}</Alert>}
              {message && <Alert tone="success">{message}</Alert>}

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Send reset link
              </Button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setMessage(null);
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-cyan-300"
              >
                Back to sign in
              </button>
            </form>
          )}
        </Panel>

        <p className="text-center text-[11px] text-slate-600">
          There is no public registration. Accounts are created by an Owner in the Supabase dashboard.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
