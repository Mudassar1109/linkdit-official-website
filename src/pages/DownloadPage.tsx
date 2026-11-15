import React, { useState } from 'react';
import { PageId } from '../types';
import { CHANGELOG_ITEMS, DOWNLOAD_OPTIONS, DOWNLOAD_PATH, FAQS, PRODUCT_NAME } from '../data/websiteData';
import { trackInstallerDownload } from '../lib/analytics';
import {
  Download,
  ShieldCheck,
  Copy,
  Check,
  Clock,
  HardDrive,
  Monitor,
  FileCode,
  ArrowRight,
  Package,
  Cpu,
  Terminal,
  FileText,
  Plus,
  BadgeCheck,
} from 'lucide-react';

interface DownloadPageProps {
  navigate: (page: PageId) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ navigate }) => {
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const current = DOWNLOAD_OPTIONS.find((o) => o.isCurrent) ?? DOWNLOAD_OPTIONS[0];
  const platforms = DOWNLOAD_OPTIONS.filter((o) => !o.isCurrent);
  const currentRelease = CHANGELOG_ITEMS.find((item) => item.status === 'current') ?? CHANGELOG_ITEMS[0];
  const installFaqs = FAQS.filter((f) => f.category === 'Installation').slice(0, 5);

  const handleCopySha = (sha: string) => {
    navigator.clipboard?.writeText(sha).catch(() => {});
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  return (
    <div className="font-sans">
      {/* ------------------------- PRODUCT HERO ------------------------- */}
      <section className="relative overflow-hidden border-b border-line dark:border-line-dark">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(56rem_24rem_at_50%_-20%,rgba(124,58,237,0.1),transparent_70%)] dark:bg-[radial-gradient(56rem_24rem_at_50%_-20%,rgba(124,58,237,0.16),transparent_70%)]"
        />
        <div className="container-site grid items-start gap-10 pb-14 pt-14 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-20">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-positive dark:bg-success/15">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Current release · {current.version} · {current.releaseDate}
            </span>
            <h1 className="text-[2.75rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-6xl dark:text-paper">
              Get{' '}
              <span className="text-gradient-accent">{PRODUCT_NAME}.</span>
            </h1>
            <p className="text-base leading-relaxed text-ink-soft sm:text-lg dark:text-zinc-400">
              Download the Free plan with no account or payment required. Pro tools are coming soon.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={DOWNLOAD_PATH}
                download={current.filename}
                onClick={() => trackInstallerDownload(current)}
                className="btn-download"
              >
                <Download className="h-5 w-5" />
                <span>Download for Windows</span>
              </a>
              <button
                onClick={() => {
                  const el = document.getElementById('platforms');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-secondary btn-lg"
              >
                All formats
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-mono text-xs text-ink-mute dark:text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" /> {current.fileSize}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5" /> {current.requirements}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Signed NSIS installer
              </span>
            </div>
          </div>

          {/* Installer spec card — the page's second hero object */}
          <div className="card-base card-elevated relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(124,58,237,0.1),transparent_75%)]"
            />
            <div className="relative flex items-center gap-4 border-b border-line bg-paper-2/60 px-6 py-5 dark:border-line-dark dark:bg-ink-900/60">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-violet text-white shadow-glow">
                <Package className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-[15px] font-bold tracking-tight text-ink dark:text-paper">
                  {current.filename}
                </div>
                <div className="font-mono text-[11px] text-ink-mute dark:text-zinc-500">
                  {current.type} · {current.fileSize} · {current.releaseDate}
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-positive dark:bg-success/15">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>
            <dl className="divide-y divide-line dark:divide-line-dark">
              {[
                ['Version', current.version],
                ['Size', current.fileSize],
                ['Requires', current.requirements],
                ['Type', current.type],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-mute dark:text-zinc-500">{k}</dt>
                  <dd className="truncate font-mono text-xs text-ink dark:text-paper">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-line px-6 py-4 dark:border-line-dark">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute dark:text-zinc-500">
                  SHA-256
                </span>
                <button
                  onClick={() => handleCopySha(current.sha256)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-fg-accent hover:underline"
                >
                  {copiedSha === current.sha256 ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <code className="mt-2 block break-all font-mono text-[11px] leading-relaxed text-ink-soft dark:text-zinc-400">
                {current.sha256}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- PLATFORM CARDS ---------------------------- */}
      <section id="platforms" className="border-b border-line dark:border-line-dark">
        <div className="container-site py-14 sm:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="eyebrow text-fg-accent">All formats</p>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl dark:text-paper">
                Pick the build that fits.
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {platforms.map((option) => {
              const avail = option.isAvailable;
              return (
                <div
                  key={option.id}
                  className={`card-base card-hover relative flex h-full flex-col justify-between gap-5 p-6 ${
                    avail ? '' : 'border-dashed opacity-90'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                          avail
                            ? 'bg-accent-soft text-fg-accent ring-1 ring-accent/20 dark:bg-accent/20 dark:text-violet-200'
                            : 'border border-line bg-paper-2 text-ink-mute dark:border-line-dark dark:bg-ink-800 dark:text-zinc-500'
                        }`}
                      >
                        <FileCode className="h-5 w-5" />
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                          avail
                            ? 'bg-success-soft text-fg-positive dark:bg-success/15'
                            : 'bg-paper-2 text-ink-mute dark:bg-ink-800 dark:text-zinc-500'
                        }`}
                      >
                        {avail ? 'Available' : 'Coming soon'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-[15px] font-bold tracking-tight text-ink dark:text-paper">{option.title}</h3>
                      <p className="text-[13px] leading-relaxed text-ink-soft dark:text-zinc-400">{option.tagline}</p>
                    </div>
                    <p className="font-mono text-[11px] text-ink-mute dark:text-zinc-500">
                      {avail ? `${option.version} · ${option.fileSize}` : option.releaseDate}
                    </p>
                    {option.note && (
                      <p className="border-l-2 border-line pl-3 text-[11px] leading-relaxed text-ink-mute dark:border-line-dark dark:text-zinc-500">
                        {option.note}
                      </p>
                    )}
                  </div>
                  <div>
                    {avail ? (
                      <a
                        href={`/downloads/${option.filename}`}
                        onClick={() => trackInstallerDownload(option)}
                        className="btn-secondary w-full"
                      >
                        <Download className="h-4 w-4" />
                        {option.format.slice(1).toUpperCase()}
                      </a>
                    ) : (
                      <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-dashed border-line-strong px-3.5 py-2.5 text-xs font-semibold text-ink-mute dark:border-line-dark-strong dark:text-zinc-500">
                        <Clock className="h-3.5 w-3.5" />
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------ REQUIREMENTS + INSTALL GUIDE ----------------- */}
      <section className="border-b border-line bg-paper-2/40 dark:border-line-dark dark:bg-ink-900/40">
        <div className="container-site grid gap-12 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
          {/* System requirements — icon tiles */}
          <div className="min-w-0 space-y-6">
            <div className="space-y-2">
              <p className="eyebrow text-fg-accent">System requirements</p>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink dark:text-paper">Will it run on my PC?</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: <Monitor className="h-4 w-4" />, k: 'Operating system', v: 'Windows 10 or Windows 11' },
                { icon: <Cpu className="h-4 w-4" />, k: 'Architecture', v: '64-bit (x64) only' },
                { icon: <HardDrive className="h-4 w-4" />, k: 'Installer size', v: `${current.fileSize} setup (.exe)` },
                { icon: <ShieldCheck className="h-4 w-4" />, k: 'Account', v: 'None for the Free plan' },
              ].map((row) => (
                <div key={row.k} className="card-base space-y-2 p-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-fg-accent dark:bg-accent/20 dark:text-violet-200">
                    {row.icon}
                  </span>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute dark:text-zinc-500">
                    {row.k}
                  </div>
                  <div className="text-sm font-semibold text-ink dark:text-paper">{row.v}</div>
                </div>
              ))}
            </div>
            <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-mute dark:text-zinc-500">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {PRODUCT_NAME} stores your documents as plain files on this machine. It never uploads them, and the
              installer contains no third-party offers or bundled software.
            </p>
          </div>

          {/* Install guide — connected steps */}
          <div className="min-w-0 space-y-6">
            <div className="space-y-2">
              <p className="eyebrow text-fg-accent">Installation guide</p>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink dark:text-paper">Three steps, then write.</h2>
            </div>
            <ol className="relative space-y-5 border-l-2 border-dashed border-line-strong pl-7 dark:border-line-dark-strong">
              {[
                'Download the setup (.exe) above.',
                'Run it and follow the installer prompts — a UAC confirmation appears, which is normal for a per-machine install.',
                'Open TypoDocs from the Start menu and start writing.',
              ].map((step, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.42rem] top-0 inline-flex h-8 w-8 items-center justify-center rounded-full gradient-violet font-mono text-xs font-bold text-white shadow-glow">
                    {i + 1}
                  </span>
                  <span className="block pt-1.5 text-sm leading-relaxed text-ink-soft dark:text-zinc-300">{step}</span>
                </li>
              ))}
            </ol>
            <div className="card-base space-y-3 p-5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-mute dark:text-zinc-500">
                <Terminal className="h-3.5 w-3.5" />
                Verify the download (optional but recommended)
              </div>
              <div className="overflow-x-auto rounded-xl bg-ink-950 p-4 dark:bg-black/40">
                <code className="block whitespace-pre font-mono text-xs leading-relaxed text-zinc-200">
                  Get-FileHash -Algorithm SHA256{" "}
                  <span className="text-violet-400">.\{current.filename}</span>
                </code>
              </div>
              <p className="text-xs leading-relaxed text-ink-soft dark:text-zinc-400">
                Compare the SHA-256 value above with the file you downloaded. Never run an installer whose checksum
                does not match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------- RELEASE NOTES ------------------------- */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-14 sm:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="eyebrow text-fg-accent">Release notes</p>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl dark:text-paper">
                What shipped in v{currentRelease.version}.
              </h2>
            </div>
            <button
              onClick={() => navigate('release-notes')}
              className="btn-ghost -mr-2 text-fg-accent hover:bg-accent-soft dark:text-violet-300 dark:hover:bg-accent/15"
            >
              Full version history
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="card-base overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper-2/60 px-6 py-4 dark:border-line-dark dark:bg-ink-900/60">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl gradient-violet text-white">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-bold text-ink dark:text-paper">{currentRelease.title}</div>
                  <div className="font-mono text-[11px] text-ink-mute dark:text-zinc-500">
                    v{currentRelease.version} · {currentRelease.date}
                  </div>
                </div>
              </div>
              <span className="badge-accent">Current</span>
            </div>
            <div className="grid gap-x-10 gap-y-6 px-6 py-6 sm:grid-cols-2">
              {[
                { label: 'Highlights', items: currentRelease.highlights },
                { label: 'Improvements', items: currentRelease.improvements },
              ].map((group) => (
                <div key={group.label} className="space-y-2.5">
                  <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-mute dark:text-zinc-500">
                    {group.label}
                  </h3>
                  <ul className="space-y-2">
                    {group.items.slice(0, 4).map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft dark:text-zinc-300">
                        <Plus className="mt-[3px] h-3.5 w-3.5 shrink-0 text-fg-accent dark:text-violet-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- FAQ ------------------------------ */}
      <section className="container-site py-14 sm:py-16">
        <div className="mb-8 max-w-2xl space-y-2">
          <p className="eyebrow text-fg-accent">Download FAQ</p>
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl dark:text-paper">
            Before you install.
          </h2>
        </div>
        <div className="space-y-3">
          {installFaqs.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className={`card-base overflow-hidden ${open ? 'card-elevated' : ''}`}>
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left transition-colors hover:bg-paper-2/50 dark:hover:bg-ink-800/40"
                >
                  <span className="flex items-center gap-3 text-sm font-bold text-ink dark:text-paper">
                    <span className={`font-mono text-[11px] ${open ? 'text-fg-accent dark:text-violet-300' : 'text-ink-mute dark:text-zinc-500'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {faq.question}
                  </span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 ${
                    open
                      ? 'rotate-45 border-accent text-fg-accent dark:border-accent dark:text-violet-300'
                      : 'border-line text-ink-mute dark:border-line-dark dark:text-zinc-500'
                  }`}>
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>
                {open && (
                  <p className="animate-kd-fade-in px-6 pb-5 pl-[4.1rem] text-sm leading-relaxed text-ink-soft dark:text-zinc-400">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
