import React, { useState } from 'react';
import { PageId } from '../types';
import { CONTACT_EMAIL, PRODUCT_NAME } from '../data/websiteData';
import { useAuth } from '../lib/auth/AuthProvider';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  LogOut,
  Mail,
  ShieldAlert,
  User,
} from 'lucide-react';

interface AccountPageProps {
  navigate: (page: PageId) => void;
}

const inputClass = 'input-base input-focus input-with-icon';
const labelClass = 'label-base';

const primaryButton = 'btn-primary';
const secondaryButton = 'btn-secondary';

type Feedback = { tone: 'success' | 'error'; message: string } | null;

const FeedbackMessage: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
  if (!feedback) return null;
  if (feedback.tone === 'error') return <div className="form-message-error" role="alert">{feedback.message}</div>;
  return <div className="form-message-success" role="status">{feedback.message}</div>;
};

const Section: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="card-base p-5 sm:p-6">
    <div className="mb-4 space-y-1 border-b border-line pb-4 dark:border-line-dark">
      <h2 className="font-display text-base font-bold tracking-tight text-ink dark:text-paper">{title}</h2>
      <p className="text-xs leading-relaxed text-ink-soft dark:text-paper/60">{description}</p>
    </div>
    {children}
  </section>
);

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const {
    configured,
    initializing,
    user,
    profile,
    signOut,
    changeEmail,
    changePassword,
    updateProfile,
    deleteAccount,
  } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [profileFeedback, setProfileFeedback] = useState<Feedback>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailFeedback, setEmailFeedback] = useState<Feedback>(null);
  const [emailSaving, setEmailSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteFeedback, setDeleteFeedback] = useState<Feedback>(null);
  const [deleting, setDeleting] = useState(false);

  React.useEffect(() => {
    setDisplayName(profile?.display_name ?? '');
  }, [profile?.display_name]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileFeedback(null);
    setProfileSaving(true);
    const result = await updateProfile(displayName);
    setProfileSaving(false);
    setProfileFeedback(
      result.error
        ? { tone: 'error', message: result.error }
        : { tone: 'success', message: 'Profile saved.' },
    );
  };

  const saveEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailFeedback(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      return setEmailFeedback({ tone: 'error', message: 'Enter a valid email address.' });
    }
    setEmailSaving(true);
    const result = await changeEmail(newEmail);
    setEmailSaving(false);
    if (result.error) return setEmailFeedback({ tone: 'error', message: result.error });
    setNewEmail('');
    setEmailFeedback({
      tone: 'success',
      message:
        'Confirmation sent. Check both your old and new inbox to approve the change. The address is not changed until confirmed.',
    });
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordFeedback(null);
    if (newPassword !== confirmPassword) {
      return setPasswordFeedback({ tone: 'error', message: 'The new passwords do not match.' });
    }
    setPasswordSaving(true);
    const result = await changePassword(currentPassword, newPassword);
    setPasswordSaving(false);
    if (result.error) return setPasswordFeedback({ tone: 'error', message: result.error });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordFeedback({ tone: 'success', message: 'Password updated. Keep it private.' });
  };

  const confirmDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    setDeleteFeedback(null);
    if (deleteConfirm !== 'DELETE') {
      return setDeleteFeedback({ tone: 'error', message: 'Type DELETE exactly to confirm.' });
    }
    if (!deletePassword) {
      return setDeleteFeedback({ tone: 'error', message: 'Enter your current password.' });
    }
    setDeleting(true);
    const result = await deleteAccount(deletePassword);
    setDeleting(false);
    if (result.error) return setDeleteFeedback({ tone: 'error', message: result.error });
    navigate('home');
  };

  if (initializing) {
    return (
      <div className="container-narrow flex items-center gap-2 py-24 text-sm text-ink-soft dark:text-paper/65">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading account…
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="container-narrow py-20">
        <div className="callout-warning p-6">
          Accounts are not configured on this deployment. Set the public Supabase environment
          variables to enable sign-in and account management.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink dark:text-paper">Sign in required</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-paper/65">
          The Free plan does not need an account. Sign in to manage a Pro subscription, billing or
          your account settings.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => navigate('sign-in')} className={primaryButton}>
            Sign in <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => navigate('sign-up')} className={secondaryButton}>
            Create an account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <header className="border-b border-line dark:border-line-dark">
        <div className="container-narrow pb-8 pt-14">
          <span className="eyebrow text-fg-accent">
            Account
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.02em] text-ink dark:text-paper">
            {profile?.display_name || 'Your account'}
          </h1>
          <p className="mt-2 text-sm text-ink-soft dark:text-paper/65">{user.email}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate('billing')} className={primaryButton}>
              Billing & subscription
            </button>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate('home');
              }}
              className={secondaryButton}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-narrow space-y-5 py-10">
        <Section title="Profile" description="Your display name is shown only inside your account.">
          <form onSubmit={saveProfile} className="space-y-3">
            <FeedbackMessage feedback={profileFeedback} />
            <div className="space-y-1.5">
              <label htmlFor="display-name" className={labelClass}>Display name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-paper/40" />
                <input
                  id="display-name"
                  type="text"
                  maxLength={80}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
            </div>
            <button type="submit" disabled={profileSaving} className={primaryButton}>
              {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save profile
            </button>
          </form>
        </Section>

        <Section
          title="Email address"
          description={`Current email: ${user.email}. Changing your email requires confirmation from both addresses.`}
        >
          <form onSubmit={saveEmail} className="space-y-3">
            <FeedbackMessage feedback={emailFeedback} />
            <div className="space-y-1.5">
              <label htmlFor="new-email" className={labelClass}>New email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-paper/40" />
                <input
                  id="new-email"
                  type="email"
                  autoComplete="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={inputClass}
                  placeholder="new@example.com"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={emailSaving} className={primaryButton}>
              {emailSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send confirmation
            </button>
          </form>
        </Section>

        <Section
          title="Password"
          description="Changing your password signs out other sessions. Use at least 12 characters with upper-case, lower-case letters and a number."
        >
          <form onSubmit={savePassword} className="space-y-3">
            <FeedbackMessage feedback={passwordFeedback} />
            <div className="space-y-1.5">
              <label htmlFor="current-password" className={labelClass}>Current password</label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass.replace('input-with-icon', '')}
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="new-password" className={labelClass}>New password</label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass.replace('input-with-icon', '')}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirm-new-password" className={labelClass}>Confirm new password</label>
                <input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass.replace('input-with-icon', '')}
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={passwordSaving} className={primaryButton}>
              {passwordSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Update password
            </button>
          </form>
        </Section>

        <Section
          title="Delete account"
          description="Deletes your profile and account access. An active paid subscription must be cancelled first. Payment and tax records are retained in anonymized form where required by law."
        >
          {!deleteOpen ? (
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="btn-danger"
            >
              <ShieldAlert className="h-4 w-4" /> Delete my account
            </button>
          ) : (
            <form onSubmit={confirmDelete} className="space-y-3">
              <FeedbackMessage feedback={deleteFeedback} />
              <p className="form-message-error">
                This cannot be undone. Type DELETE and enter your password. If a subscription is
                still active, cancellation is attempted first; deletion is refused if it cannot be
                verified.
              </p>
              <div className="space-y-1.5">
                <label htmlFor="delete-confirm" className={labelClass}>Type DELETE</label>
                <input
                  id="delete-confirm"
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className={inputClass.replace('input-with-icon', '')}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="delete-password" className={labelClass}>Current password</label>
                <input
                  id="delete-password"
                  type="password"
                  autoComplete="current-password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className={inputClass.replace('input-with-icon', '')}
                  required
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={deleting}
                  className="btn-danger"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Permanently delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteOpen(false);
                    setDeleteConfirm('');
                    setDeletePassword('');
                    setDeleteFeedback(null);
                  }}
                  className={secondaryButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Section>

        <p className="text-center text-[11px] leading-relaxed text-ink-mute dark:text-paper/45">
          Need help with billing or data deletion? Contact{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-ink dark:hover:text-paper">
            {CONTACT_EMAIL}
          </a>
          . {PRODUCT_NAME} does not store document contents on the server.
        </p>
      </div>
    </div>
  );
};