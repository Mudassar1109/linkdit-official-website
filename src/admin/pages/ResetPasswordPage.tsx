import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Alert, Button, Field, Input, Panel } from '../components/ui';

const ResetPasswordPage: React.FC = () => {
  const { updatePassword, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 12) {
      setError('Use at least 12 characters.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (result.error) setError(result.error);
    else setDone(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070c17] p-6">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-white">Set a new password</h1>
          <p className="mt-1 text-xs text-slate-500">Choose a strong password of at least 12 characters.</p>
        </div>

        <Panel className="p-6">
          {done ? (
            <div className="space-y-4">
              <Alert tone="success">Your password has been updated.</Alert>
              <Button variant="primary" className="w-full" onClick={() => signOut()}>
                Continue to sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <Field label="New password" htmlFor="new-password" required>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field label="Confirm password" htmlFor="confirm-password" required>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </Field>
              {error && <Alert tone="error">{error}</Alert>}
              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Update password
              </Button>
            </form>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
