import React, { useEffect, useState } from 'react';
import { PageId } from '../types';
import { CONTACT_EMAIL } from '../data/websiteData';
import { useAuth } from '../lib/auth/AuthProvider';
import {
  BillingInterval,
  BillingStatus,
  EntitlementSnapshot,
  PaymentRow,
  SubscriptionRow,
  cancelSubscription,
  createCheckout,
  fetchBillingStatus,
  formatDate,
  formatMoney,
  loadEntitlementSnapshot,
  loadPaymentHistory,
  loadSubscription,
  reconcileSubscription,
} from '../lib/billing/api';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

interface BillingPageProps {
  navigate: (page: PageId) => void;
}

const primaryButton =
  'btn-primary';
const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-60 dark:border-line-dark dark:text-paper dark:hover:border-paper';

const ENTITLEMENT_LABELS: Record<string, string> = {
  'editor.core': 'Core document editing',
  'files.local': 'Local files, autosave and recovery',
  'print.pdf.basic': 'Basic Windows print and PDF',
  'print.pdf.advanced': 'Advanced Print & PDF pack',
  'fonts.import': 'Imported font library (TTF/OTF)',
  'images.advanced': 'Advanced image tools',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending verification',
  trialing: 'Trial',
  active: 'Active',
  past_due: 'Payment due',
  cancelled: 'Cancelled',
  expired: 'Expired',
  refunded: 'Refunded',
};

function subscriptionDetail(subscription: SubscriptionRow | null): string {
  if (!subscription) return 'No subscription on this account.';
  const status = STATUS_LABELS[subscription.status] ?? subscription.status;
  if (subscription.cancel_at_period_end && subscription.current_period_end) {
    return `${status} · access ends ${formatDate(subscription.current_period_end)}`;
  }
  if (subscription.status === 'active' && subscription.current_period_end) {
    return `${status} · renews ${formatDate(subscription.current_period_end)}`;
  }
  if (subscription.status === 'trialing' && subscription.trial_end) {
    return `${status} · trial ends ${formatDate(subscription.trial_end)}`;
  }
  if (subscription.status === 'past_due') {
    return 'Payment is due. Pro access is paused until billing is resolved.';
  }
  return status;
}

const Notice: React.FC<{ tone: 'error' | 'success' | 'info'; children: React.ReactNode }> = ({
  tone,
  children,
}) => {
  const styles =
    tone === 'error'
      ? 'border-danger/30 bg-danger/5 text-danger'
      : tone === 'success'
        ? 'border-success/30 bg-success/5 text-fg-positive'
        : 'border-line bg-paper-2/60 text-ink-soft dark:border-line-dark dark:bg-ink-900 dark:text-paper/65';
  const Icon = tone === 'error' ? AlertCircle : tone === 'success' ? CheckCircle2 : ShieldCheck;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-lg border p-3 text-xs leading-relaxed ${styles}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
};

export const BillingPage: React.FC<BillingPageProps> = ({ navigate }) => {
  const { configured, initializing, user, session } = useAuth();
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [snapshot, setSnapshot] = useState<EntitlementSnapshot | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingOut, setCheckingOut] = useState<BillingInterval | null>(null);
  const [feedback, setFeedback] = useState<{ tone: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let alive = true;
    void fetchBillingStatus().then((next) => {
      if (alive) setStatus(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setSubscription(null);
      setSnapshot(null);
      setPayments([]);
      return;
    }
    let alive = true;
    setLoading(true);
    Promise.all([
      loadSubscription(user.id),
      loadEntitlementSnapshot(),
      loadPaymentHistory(user.id),
    ])
      .then(([sub, ent, history]) => {
        if (!alive) return;
        setSubscription(sub);
        setSnapshot(ent);
        setPayments(history);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user, reloadToken]);

  const beginCheckout = async (interval: BillingInterval) => {
    if (!session || !status?.checkoutAvailable) return;
    setFeedback(null);
    setCheckingOut(interval);
    const result = await createCheckout(session, interval);
    if (result.error || !result.url) {
      setCheckingOut(null);
      setFeedback({ tone: 'error', message: result.error || 'Checkout is unavailable.' });
      return;
    }
    window.location.assign(result.url);
  };

  const confirmCancel = async () => {
    if (!session) return;
    setCancelling(true);
    setFeedback(null);
    const result = await cancelSubscription(session, false);
    setCancelling(false);
    if (result.error) {
      setFeedback({ tone: 'error', message: result.error });
      return;
    }
    setCancelOpen(false);
    setFeedback({
      tone: 'success',
      message:
        'Cancellation scheduled. Pro stays active until the end of the paid period, and no further renewals will be charged.',
    });
    setReloadToken((value) => value + 1);
  };

  const refresh = async () => {
    if (!session) return;
    setRefreshing(true);
    setFeedback(null);
    const result = await reconcileSubscription(session).catch(() => ({
      error: 'Could not refresh the subscription.',
    }));
    if ('error' in result && result.error) {
      setRefreshing(false);
      setFeedback({ tone: 'error', message: result.error });
      return;
    }
    setReloadToken((value) => value + 1);
    setRefreshing(false);
    setFeedback({ tone: 'success', message: 'Subscription details refreshed.' });
  };

  if (initializing) {
    return (
      <div className="container-narrow flex items-center gap-2 py-24 text-sm text-ink-soft dark:text-paper/65">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading billing…
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="container-narrow py-20">
        <div className="callout-warning p-6">
          Billing is not configured on this deployment. No checkout or payment is available.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink dark:text-paper">Sign in required</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-paper/65">
          Sign in to view your plan, subscription, payment history and entitlements.
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

  const planKey = snapshot?.plan_key ?? 'free';
  const proActive = planKey === 'pro';
  const entitlements = snapshot?.entitlements ?? [
    'editor.core',
    'files.local',
    'print.pdf.basic',
  ];
  const checkoutAvailable = status?.checkoutAvailable === true;
  const monthlyDisplay = status?.plans?.monthly.display ?? '$5.99';
  const yearlyDisplay = status?.plans?.yearly.display ?? '$47.99';
  const isCancelling = subscription?.cancel_at_period_end === true;

  return (
    <div className="font-sans">
      <header className="border-b border-line dark:border-line-dark">
        <div className="container-narrow pb-8 pt-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Billing
          </span>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink dark:text-paper">
                Plan & subscription
              </h1>
              <p className="mt-2 text-sm text-ink-soft dark:text-paper/65">{user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate('account')} className={secondaryButton}>
                Account settings
              </button>
              <button type="button" onClick={() => navigate('pricing')} className={secondaryButton}>
                Compare plans
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-narrow space-y-5 py-10">
        {status?.testMode && (
          <Notice tone="info">
            Test mode is active. Checkout uses the sandbox provider and no real payment method is
            charged. Do not use this mode for public sales.
          </Notice>
        )}
        {!status?.configured && (
          <Notice tone="info">
            Checkout is not open on this deployment. You can still view your account and existing
            entitlements. No payment can be taken.
          </Notice>
        )}
        {feedback && <Notice tone={feedback.tone}>{feedback.message}</Notice>}

        <section className="rounded-card border border-line bg-surface p-5 dark:border-line-dark dark:bg-ink-850 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-ink-mute dark:text-paper/50">
                Current plan
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-ink dark:text-paper">
                TypoDocs {proActive ? 'Pro' : 'Free'}
              </h2>
              <p className="text-sm text-ink-soft dark:text-paper/65">
                {loading ? 'Checking subscription…' : subscriptionDetail(subscription)}
              </p>
              {isCancelling && subscription?.current_period_end && (
                <p className="text-xs text-fg-warning">
                  Auto-renew is off. Pro access ends {formatDate(subscription.current_period_end)}.
                </p>
              )}
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider ${
                proActive
                  ? 'border-accent/40 bg-accent-soft text-fg-accent dark:border-accent/30 dark:bg-accent/10'
                  : 'border-line text-ink-mute dark:border-line-dark dark:text-paper/50'
              }`}
            >
              {proActive ? 'Pro active' : 'Free'}
            </span>
          </div>

          <div className="mt-5 border-t border-line pt-5 dark:border-line-dark">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-mute dark:text-paper/55">
              Included features
            </h3>
            <ul className="mt-3 grid gap-2 text-sm text-ink-soft dark:text-paper/70 sm:grid-cols-2">
              {entitlements.map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fg-accent" />
                  <span>{ENTITLEMENT_LABELS[key] ?? key}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-5 dark:border-line-dark">
            {!proActive && checkoutAvailable && (
              <>
                <button
                  type="button"
                  disabled={checkingOut !== null}
                  onClick={() => beginCheckout('month')}
                  className={primaryButton}
                >
                  {checkingOut === 'month' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  Upgrade monthly · {monthlyDisplay}
                </button>
                <button
                  type="button"
                  disabled={checkingOut !== null}
                  onClick={() => beginCheckout('year')}
                  className={secondaryButton}
                >
                  {checkingOut === 'year' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  Upgrade yearly · {yearlyDisplay}
                </button>
              </>
            )}
            {!proActive && !checkoutAvailable && (
              <p className="text-xs leading-relaxed text-ink-soft dark:text-paper/60">
                Pro checkout is not open yet. No payment can be taken. Contact{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                  {CONTACT_EMAIL}
                </a>{' '}
                if you need help with an existing subscription.
              </p>
            )}
            {proActive && !isCancelling && (
              <>
                {!cancelOpen ? (
                  <button type="button" onClick={() => setCancelOpen(true)} className={secondaryButton}>
                    Cancel at period end
                  </button>
                ) : (
                  <div className="callout-warning w-full p-4">
                    <p className="text-xs leading-relaxed">
                      Pro remains available until{' '}
                      {formatDate(subscription?.current_period_end)}. Auto-renew will be turned off
                      and no further charges will be made. Access after that date requires a new
                      subscription.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={cancelling}
                        onClick={confirmCancel}
                        className="inline-flex items-center gap-2 rounded-lg bg-warning px-4 py-2 text-xs font-semibold text-white hover:bg-warning/85 disabled:opacity-60"
                      >
                        {cancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        Confirm cancellation
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelOpen(false)}
                        className="rounded-lg border border-warning/40 px-4 py-2 text-xs font-semibold text-fg-warning hover:bg-warning-soft dark:border-warning/30 dark:hover:bg-warning/10"
                      >
                        Keep Pro
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            {subscription && (
              <button type="button" onClick={refresh} disabled={refreshing} className={secondaryButton}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh status
              </button>
            )}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-mute dark:text-paper/45">
            Immediate cancellation and refunds are not self-service. Contact support. Cancelling
            stops future renewals; it does not automatically refund the current period.
          </p>
        </section>

        <section className="rounded-card border border-line bg-surface dark:border-line-dark dark:bg-ink-850">
          <div className="flex items-center justify-between gap-3 border-b border-line p-5 dark:border-line-dark sm:p-6">
            <div>
              <h2 className="text-base font-semibold text-ink dark:text-paper">Payment history</h2>
              <p className="mt-1 text-xs text-ink-soft dark:text-paper/60">
                Payments and refunds recorded for this account. Tax documents are not invoices.
              </p>
            </div>
            <CreditCard className="h-5 w-5 text-ink-mute dark:text-paper/45" />
          </div>

          {loading ? (
            <div className="flex items-center gap-2 p-6 text-sm text-ink-soft dark:text-paper/65">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading payments…
            </div>
          ) : payments.length === 0 ? (
            <p className="p-6 text-sm text-ink-soft dark:text-paper/65">
              No payments recorded. The Free plan does not require payment.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs font-mono uppercase tracking-wider text-ink-mute dark:border-line-dark dark:text-paper/50">
                    <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Description</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line dark:divide-line-dark">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="text-ink-soft dark:text-paper/70">
                      <td className="whitespace-nowrap px-5 py-3.5">{formatDate(payment.occurred_at)}</td>
                      <td className="px-5 py-3.5">{payment.description || payment.kind}</td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-ink-mute dark:border-line-dark dark:text-paper/50">
                          {payment.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium text-ink dark:text-paper">
                        {formatMoney(payment.amount_cents, payment.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-card border border-line bg-paper-2/50 p-5 dark:border-line-dark dark:bg-ink-900/40">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ink-mute dark:text-paper/45" />
            <div className="space-y-2 text-xs leading-relaxed text-ink-soft dark:text-paper/65">
              <p>
                Prices are in USD. Pro Monthly is {monthlyDisplay}; Pro Yearly is {yearlyDisplay}
                and saves $23.89 compared with 12 monthly payments. There is no Lifetime plan.
              </p>
              <p>
                Access is controlled by a verified subscription, not by a browser redirect. A
                payment is not treated as complete until the provider confirms it. Failed or
                disputed payments pause Pro access.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
