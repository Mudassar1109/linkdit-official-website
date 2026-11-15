import React, { useEffect, useState } from 'react';
import { PageId } from '../types';
import {
  CURRENT_VERSION_LABEL,
  DOWNLOAD_FILE_SIZE,
  DOWNLOAD_PATH,
  PRODUCT_NAME,
} from '../data/websiteData';
import { trackCta } from '../lib/analytics';
import { useAuth } from '../lib/auth/AuthProvider';
import {
  BillingInterval,
  BillingStatus,
  createCheckout,
  fetchBillingStatus,
} from '../lib/billing/api';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  Download,
  Loader2,
  Monitor,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface PricingPageProps {
  navigate: (page: PageId) => void;
}

const FREE_FEATURES = [
  'Rich-text, plain-text and Markdown document editing',
  'Tabs and split view',
  'Local open and save, autosave and crash recovery',
  'Find and replace, bookmarks and document outline',
  'RTL and Urdu/Arabic support with Nastaliq typography',
  'Six themes and six accent colors',
  'Essential keyboard shortcuts and command palette',
  'Import and basic local export',
  'Basic Windows print and PDF workflow',
  '17 interface languages',
  'No account required for the Free plan',
];

const PRO_FEATURES = [
  'Everything in the Free plan',
  'Advanced Print & PDF pack: presets, page ranges, N-up layouts, scaling, grayscale and page numbers',
  'Imported font library with TTF/OTF support',
  'Advanced image tools: resize, crop and alignment',
  'Pro feature updates released while your subscription is active',
];

type MatrixValue = 'yes' | 'no' | 'basic';

const MATRIX: { feature: string; free: MatrixValue; pro: MatrixValue }[] = [
  { feature: 'Core editing: rich text, plain text and Markdown documents', free: 'yes', pro: 'yes' },
  { feature: 'Tabs and split view', free: 'yes', pro: 'yes' },
  { feature: 'Local open/save, autosave and crash recovery', free: 'yes', pro: 'yes' },
  { feature: 'Find and replace, bookmarks and outline', free: 'yes', pro: 'yes' },
  { feature: 'RTL and Nastaliq typography', free: 'yes', pro: 'yes' },
  { feature: 'Six themes and six accent colors', free: 'yes', pro: 'yes' },
  { feature: 'Essential keyboard shortcuts and command palette', free: 'yes', pro: 'yes' },
  { feature: 'Import and basic local export', free: 'yes', pro: 'yes' },
  { feature: 'Windows print and PDF workflow', free: 'basic', pro: 'yes' },
  { feature: '17 interface languages', free: 'yes', pro: 'yes' },
  { feature: 'Advanced Print & PDF pack', free: 'no', pro: 'yes' },
  { feature: 'Imported font library (TTF/OTF)', free: 'no', pro: 'yes' },
  { feature: 'Advanced image tools: resize, crop and alignment', free: 'no', pro: 'yes' },
  { feature: 'Pro feature updates while subscribed', free: 'no', pro: 'yes' },
  { feature: 'Cloud sync, AI, collaboration or storage', free: 'no', pro: 'no' },
];

const PLANNED_PRO = [
  'Reliable, path-based version history',
  'Custom keyboard shortcuts and quick actions',
  'Advanced search and saved searches',
  'Additional export formats',
];

const PRICING_FAQS = [
  {
    question: 'Is the Free plan really free?',
    answer:
      'Yes. The Free plan downloads and runs without payment or an account. It includes the core local writing workspace.',
  },
  {
    question: 'Can I buy Pro now?',
    answer:
      'No. Pro checkout is not open on this deployment, so no payment can be taken. The Free plan is available now.',
  },
  {
    question: 'What does Pro include?',
    answer:
      'Pro adds the advanced Print & PDF pack, an imported font library, advanced image tools, and Pro feature updates while the subscription is active. The Free plan remains available.',
  },
  {
    question: 'Does Pro require an account?',
    answer:
      'Yes. Pro requires an account so the subscription and its features can be verified. The Free plan does not require an account.',
  },
  {
    question: 'Does Pro upload my documents?',
    answer:
      'No. Pro is a local-first upgrade. Cloud sync, AI features, collaboration and storage are not part of the offer. Accounts are used only for entitlement and billing verification.',
  },
  {
    question: 'How does yearly billing compare with monthly?',
    answer:
      'Pro Monthly is $5.99 USD per month. Pro Yearly is $47.99 USD per year, which saves $23.89 compared with 12 monthly payments — about 33%. There is no Lifetime plan.',
  },
];

const MatrixCell: React.FC<{ value: MatrixValue }> = ({ value }) => {
  if (value === 'yes') {
    return (
      <span className="inline-flex items-center gap-1.5 text-fg-accent">
        <Check className="w-4 h-4 shrink-0" />
        Included
      </span>
    );
  }

  if (value === 'basic') {
    return <span className="text-ink-soft dark:text-paper/65">Basic only</span>;
  }

  return <span className="text-ink-mute dark:text-paper/40">Not included</span>;
};

export const PricingPage: React.FC<PricingPageProps> = ({ navigate }) => {
  const { configured, session } = useAuth();
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [checkingOut, setCheckingOut] = useState<BillingInterval | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void fetchBillingStatus().then((next) => {
      if (alive) setStatus(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  const checkoutAvailable = status?.checkoutAvailable === true;
  const testMode = status?.testMode === true;

  const startCheckout = async (interval: BillingInterval) => {
    setCheckoutError(null);
    if (!configured) {
      setCheckoutError('Accounts are not configured on this deployment. No payment can be taken.');
      return;
    }
    if (!session) {
      sessionStorage.setItem('typodocs-auth-return', 'pricing');
      navigate('sign-in');
      return;
    }
    setCheckingOut(interval);
    const result = await createCheckout(session, interval);
    if (result.error || !result.url) {
      setCheckingOut(null);
      setCheckoutError(result.error || 'Checkout is unavailable. No payment has been taken.');
      return;
    }
    window.location.assign(result.url);
  };

  const faqs = PRICING_FAQS.map((faq) =>
    faq.question === 'Can I buy Pro now?'
      ? {
          ...faq,
          answer: checkoutAvailable
            ? testMode
              ? 'Checkout is available in test mode on this deployment. No real card is charged. Use an account you control to verify the flow.'
              : 'Yes. Pro Monthly and Pro Yearly are available at checkout. You need an account so the subscription can be verified. The Free plan remains available and needs no account.'
            : 'No. Pro checkout is not open on this deployment, so no payment can be taken. The Free plan is available now.',
        }
      : faq,
  );

  return (
    <div className="font-sans">
      <header className="relative overflow-hidden border-b border-line dark:border-line-dark">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(56rem_24rem_at_50%_-30%,rgba(124,58,237,0.1),transparent_70%)] dark:bg-[radial-gradient(56rem_24rem_at_50%_-30%,rgba(124,58,237,0.16),transparent_70%)]"
        />
        <div className="container-site relative pt-16 sm:pt-20 pb-14 text-center space-y-5">
          <span className="inline-flex items-center justify-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-accent">
            <span aria-hidden="true" className="h-px w-6 gradient-violet" />
            Pricing
            <span aria-hidden="true" className="h-px w-6 gradient-violet" />
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl dark:text-paper">
            Start free.{' '}
            <span className="text-gradient-accent">
              {checkoutAvailable ? 'Upgrade to Pro anytime.' : 'Upgrade when Pro arrives.'}
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-ink-soft dark:text-zinc-400 leading-relaxed">
            Download {PRODUCT_NAME} today with the Free plan. Pro adds advanced print, typography and
            image tools.
          </p>
          <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-card border border-accent/30 bg-accent-soft/70 p-4 text-left dark:bg-accent/10">
            <Clock className="w-5 h-5 shrink-0 text-fg-accent mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-ink dark:text-paper">
                {checkoutAvailable
                  ? testMode
                    ? 'Pro checkout is in test mode — no real payment is taken.'
                    : 'Pro checkout is available.'
                  : 'Pro is coming soon — no payment is available today.'}
              </p>
              <p className="text-xs text-ink-soft dark:text-paper/65 leading-relaxed">
                {checkoutAvailable
                  ? testMode
                    ? 'This deployment uses a sandbox payment provider. Use only accounts you control. Do not use real payment details.'
                    : 'Pro subscriptions require an account so entitlements can be verified. The Free plan needs no account.'
                  : `Prices are shown for the planned launch. Checkout, accounts and subscription verification are not live yet. The Free plan is available now. The current ${CURRENT_VERSION_LABEL} build includes early versions of some Pro-planned tools; plan entitlements take effect when Pro launches.`}
              </p>
            </div>
          </div>
          {checkoutError && (
            <div className="mx-auto flex max-w-2xl items-start gap-2 callout-danger p-3 text-left text-xs">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{checkoutError}</span>
            </div>
          )}
        </div>
      </header>

      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-14 sm:py-16">
          <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
            <article className="flex flex-col card-base card-hover p-7">
              <div className="space-y-2">
                <span className="badge-neutral">Free</span>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-paper">TypoDocs Free</h2>
                <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
                  A complete local writing workspace for Windows.
                </p>
              </div>

              <div className="py-6">
                <div className="flex items-end gap-2">
                  <span className="font-display text-5xl font-bold tracking-tight text-ink dark:text-paper">$0</span>
                  <span className="pb-1.5 text-xs text-ink-mute dark:text-zinc-500">Free plan</span>
                </div>
                <p className="mt-2 text-xs text-ink-mute dark:text-zinc-500">
                  No payment required. No account required.
                </p>
              </div>

              <ul className="space-y-2.5 border-t border-line pt-5 text-sm dark:border-line-dark">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-ink-soft dark:text-zinc-300">
                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-fg-accent dark:bg-accent/20">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <a
                  href={DOWNLOAD_PATH}
                  download
                  onClick={() => trackCta('pricing_free_download', 'pricing', 'Download Free for Windows')}
                  className="btn-primary btn-lg w-full"
                >
                  <Download className="w-4 h-4" />
                  Download Free for Windows
                </a>
                <p className="mt-2 text-center text-[11px] font-mono text-ink-mute dark:text-zinc-500">
                  {DOWNLOAD_FILE_SIZE} installer · Windows 10/11 (64-bit)
                </p>
              </div>
            </article>

            <article className="flex flex-col card-base card-hover p-7">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="badge-neutral">Pro</span>
                  <span className="badge-neutral">
                    {checkoutAvailable ? 'Available' : 'Coming soon'}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-paper">Pro Monthly</h2>
                <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
                  Advanced document tools for professional writing.
                </p>
              </div>

              <div className="py-6">
                <div className="flex items-end gap-1">
                  <span className="font-display text-5xl font-bold tracking-tight text-ink dark:text-paper">$5.99</span>
                  <span className="pb-1.5 text-xs text-ink-mute dark:text-zinc-500">USD / month</span>
                </div>
                <p className="mt-2 text-xs text-ink-mute dark:text-zinc-500">Billed monthly.</p>
              </div>

              <ul className="space-y-2.5 border-t border-line pt-5 text-sm dark:border-line-dark">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-ink-soft dark:text-zinc-300">
                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-fg-accent dark:bg-accent/20">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="btn-secondary w-full"
                >
                  <Clock className="w-4 h-4" />
                  Get Pro Monthly — Coming Soon
                </button>
                <p className="mt-2 text-center text-[11px] font-mono text-ink-mute dark:text-paper/45">
                  No checkout is available yet.
                </p>
              </div>
            </article>

            <article className="relative flex flex-col rounded-card p-[1.5px] gradient-violet shadow-card-elevated lg:scale-[1.03]">
              <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full gradient-violet px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-glow">
                  <Sparkles className="h-3 w-3" />
                  Best Value
                </span>
              </div>
              <article className="flex h-full flex-col rounded-[calc(var(--radius-card)-1.5px)] bg-surface p-7 dark:bg-ink-850">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="badge-accent">Pro</span>
                  <span className="badge-neutral">
                    Coming soon
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-paper">Pro Yearly</h2>
                <p className="text-sm text-ink-soft dark:text-zinc-400 leading-relaxed">
                  The same Pro tools, billed once a year for the best value.
                </p>
              </div>

              <div className="py-6">
                <div className="flex items-end gap-1">
                  <span className="font-display text-5xl font-bold tracking-tight text-ink dark:text-paper">$47.99</span>
                  <span className="pb-1.5 text-xs text-ink-mute dark:text-zinc-500">USD / year</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-fg-accent">
                  Save $23.89/year — about 33% compared with monthly.
                </p>
                <p className="mt-1 text-xs text-ink-mute dark:text-zinc-500">
                  Approximately $4.00/month equivalent. Billed annually.
                </p>
              </div>

              <ul className="space-y-2.5 border-t border-line pt-5 text-sm dark:border-line-dark">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-ink-soft dark:text-zinc-300">
                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-fg-accent dark:bg-accent/20">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="btn-accent w-full"
                >
                  <Clock className="w-4 h-4" />
                  Get Pro Yearly — Coming Soon
                </button>
                <p className="mt-2 text-center text-[11px] font-mono text-ink-mute dark:text-zinc-500">
                  No checkout is available yet.
                </p>
              </div>
              </article>
            </article>
          </div>

          <p className="mt-6 text-center text-xs text-ink-mute dark:text-paper/50">
            All prices are in USD. Pro Monthly and Pro Yearly include the same Pro features. No Lifetime plan.
          </p>
        </div>
      </section>

      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-14 sm:py-16 space-y-8">
          <div className="max-w-2xl space-y-2">
            <p className="eyebrow text-fg-accent">Compare plans</p>
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl dark:text-paper">
              What is included today
            </h2>
            <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
              The matrix lists features in the current build and the planned Pro upgrade. Planned additions
              are not available yet.
            </p>
          </div>

          <div className="overflow-x-auto card-base">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-line dark:border-line-dark">
                  <th scope="col" className="table-header">Feature</th>
                  <th scope="col" className="table-header">Free</th>
                  <th scope="col" className="table-header text-accent">Pro (planned)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                {MATRIX.map((row) => (
                  <tr key={row.feature} className="table-row-hover text-ink-soft dark:text-paper/70">
                    <th scope="row" className="px-5 py-3.5 font-medium text-ink dark:text-paper">
                      {row.feature}
                    </th>
                    <td className="px-5 py-3.5">
                      <MatrixCell value={row.free} />
                    </td>
                    <td className="px-5 py-3.5">
                      <MatrixCell value={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 rounded-card border border-line bg-paper-2/50 p-5 dark:border-line-dark dark:bg-ink-900/40 sm:flex-row sm:items-start">
            <Sparkles className="w-5 h-5 shrink-0 text-fg-accent mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-ink dark:text-paper">
                Planned Pro additions — not available today
              </h3>
              <p className="text-xs text-ink-soft dark:text-paper/65 leading-relaxed">
                These tools are being evaluated for Pro after reliability work. They are not part of the
                current build and are not being sold yet.
              </p>
              <ul className="grid gap-2 text-xs text-ink-soft dark:text-paper/65 sm:grid-cols-2">
                {PLANNED_PRO.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-ink-mute dark:text-paper/45" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line dark:border-line-dark bg-paper-2/50 dark:bg-ink-900/40">
        <div className="container-site py-14 sm:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-success-soft text-fg-positive dark:bg-success/15">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-semibold text-ink dark:text-paper">Local-first by design</h2>
              <p className="text-xs text-ink-soft dark:text-paper/65 leading-relaxed">
                Your documents stay on your computer. Pro does not add cloud storage, AI processing or
                collaboration.
              </p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-soft dark:bg-accent/15 text-fg-accent">
                <Monitor className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-semibold text-ink dark:text-paper">Windows desktop app</h2>
              <p className="text-xs text-ink-soft dark:text-paper/65 leading-relaxed">
                Built with Tauri for Windows 10 and 11 (64-bit), with a local installer and no background
                services.
              </p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-warning-soft text-fg-warning dark:bg-warning/10">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-semibold text-ink dark:text-paper">Clear launch process</h2>
              <p className="text-xs text-ink-soft dark:text-paper/65 leading-relaxed">
                Pro will open only after checkout, account verification and subscription enforcement are
                ready. No payment will be taken before then.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line dark:border-line-dark">
        <div className="container-narrow py-14 sm:py-16 space-y-8">
          <div className="text-center space-y-2">
            <p className="eyebrow text-fg-accent">Pricing FAQ</p>
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl dark:text-paper">
              Common questions
            </h2>
          </div>

          <div className="space-y-3">
            {PRICING_FAQS.map((faq) => (
              <details key={faq.question} className="group card-base">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-bold text-ink dark:text-paper">
                  {faq.question}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-mute transition-transform group-open:rotate-45 group-open:border-accent group-open:text-fg-accent dark:border-line-dark dark:text-paper/45">
                    +
                  </span>
                </summary>
                <p className="border-t border-line px-5 pb-5 pt-3 text-sm text-ink-soft dark:border-line-dark dark:text-paper/65 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-16 sm:py-20">
        <div className="gradient-violet relative overflow-hidden rounded-3xl px-6 py-14 shadow-card-elevated sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="bg-grid-dots pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(70%_80%_at_50%_0%,black,transparent)]"
          />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-white">
            <div className="space-y-2">
              <p className="eyebrow text-white/70">Available today</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
                Download the Free plan.
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                The {DOWNLOAD_FILE_SIZE} Windows installer is ready. No account or payment required.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 sm:flex-row">
              <a
                href={DOWNLOAD_PATH}
                download
                onClick={() => trackCta('pricing_final_download', 'pricing', 'Download Free for Windows')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-violet-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-violet-50"
              >
                <Download className="w-4 h-4" />
                Download Free for Windows
              </a>
              <button
                onClick={() => navigate('features')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/70"
              >
                Explore features
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};