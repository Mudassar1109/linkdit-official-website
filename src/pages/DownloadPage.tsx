import React, { useState } from 'react';
import { PageId } from '../types';
import { DOWNLOAD_OPTIONS, PRODUCT_NAME } from '../data/websiteData';
import {
  Download,
  ShieldCheck,
  Copy,
  Check,
  Clock,
  HardDrive,
  Terminal,
  FileCode,
  ArrowRight,
} from 'lucide-react';

interface DownloadPageProps {
  navigate: (page: PageId) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ navigate }) => {
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const current = DOWNLOAD_OPTIONS.find((o) => o.isCurrent) ?? DOWNLOAD_OPTIONS[0];
  const others = DOWNLOAD_OPTIONS.filter((o) => o.id !== current.id);

  const handleCopySha = (sha: string) => {
    navigator.clipboard?.writeText(sha).catch(() => {});
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-14 text-center space-y-5">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Download
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            Get {PRODUCT_NAME}
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            Free, no account required, and free forever for personal, academic, and commercial use.
          </p>
        </div>
      </header>

      {/* Primary download card */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="border border-line dark:border-line-dark bg-surface dark:bg-ink-850 overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-line dark:border-line-dark bg-paper-2/60 dark:bg-ink-900/50">
              <div className="flex items-center gap-2 text-xs font-mono text-ink-soft dark:text-paper/60">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Current release · v{current.version}
              </div>
              <span className="text-xs font-mono text-ink-mute dark:text-paper/50">{current.releaseDate}</span>
            </div>

            <div className="p-6 sm:p-8 grid lg:grid-cols-[1fr_auto] gap-8 items-start">
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-paper">
                    Windows Setup (.exe)
                  </h2>
                  <p className="mt-1.5 text-sm text-ink-soft dark:text-paper/65 leading-relaxed">{current.tagline}</p>
                </div>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-line dark:border-line-dark bg-line dark:bg-line-dark text-sm">
                  {[
                    ['Version', current.version],
                    ['Size', current.fileSize],
                    ['Requires', current.requirements],
                    ['Type', current.type],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-surface dark:bg-ink-950 px-4 py-3">
                      <dt className="text-[10px] font-mono uppercase tracking-wider text-ink-mute dark:text-paper/45">{k}</dt>
                      <dd className="mt-0.5 font-mono text-xs text-ink dark:text-paper">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-mute dark:text-paper/45">
                      SHA-256 checksum
                    </span>
                    <button
                      onClick={() => handleCopySha(current.sha256)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-deep"
                    >
                      {copiedSha === current.sha256 ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <code className="block rounded bg-paper-2 dark:bg-ink-950 border border-line dark:border-line-dark px-3 py-2 font-mono text-[11px] leading-relaxed break-all text-ink-soft dark:text-paper/60">
                    {current.sha256}
                  </code>
                </div>

                <a
                  href={`/downloads/${current.filename}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3.5 text-sm font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {current.filename}</span>
                </a>
                <p className="text-xs text-ink-mute dark:text-paper/50">
                  The installer is a standard NSIS setup for Windows 10/11 (64-bit). Downloading it directly from this domain is the only supported way to get it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other formats */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Other formats
          </h2>
          {others.map((option) => {
            const avail = option.isAvailable;
            return (
              <div
                key={option.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-line dark:border-line-dark bg-paper-2/40 dark:bg-ink-850 px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-md bg-paper-2 dark:bg-ink-900 text-ink-soft dark:text-paper/60">
                    <FileCode className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink dark:text-paper">{option.title}</span>
                      <span
                        className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                          avail ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-mute dark:text-paper/50'
                        }`}
                      >
                        {avail ? 'Available' : 'Not yet'}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft dark:text-paper/60 mt-0.5 leading-relaxed">{option.tagline}</p>
                    {option.note && (
                      <p className="text-[11px] text-ink-mute dark:text-paper/50 mt-1 leading-relaxed">{option.note}</p>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <span className="hidden sm:block font-mono text-xs text-ink-mute dark:text-paper/50">
                    {option.version}
                  </span>
                  {avail ? (
                    <a
                      href={`/downloads/${option.filename}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-line-strong dark:border-line-dark px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink transition-colors dark:border-line-dark dark:text-paper dark:hover:border-paper"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {option.format.slice(1).toUpperCase()}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-line dark:border-line-dark px-3.5 py-2 text-xs font-semibold text-ink-mute dark:text-paper/40">
                      <Clock className="w-3.5 h-3.5" />
                      Coming later
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Install + verify */}
      <section className="border-b border-line dark:border-line-dark bg-paper-2/50 dark:bg-ink-900/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-2 gap-12">
          <div className="min-w-0 space-y-4">
            <h2 className="text-lg font-bold text-ink dark:text-paper">Install in three steps</h2>
            <ol className="space-y-3">
              {[
                'Download the setup (.exe) above.',
                'Run it and follow the installer prompts — a UAC confirmation appears, which is normal for a per-machine install.',
                'Open LinkDit Pad from the Start menu and start writing.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink-soft dark:text-paper/70 leading-relaxed">
                  <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-soft dark:bg-accent/15 text-accent-deep dark:text-blue-300 font-mono text-[11px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="min-w-0 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink dark:text-paper">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Verify the download
            </h2>
            <p className="text-sm text-ink-soft dark:text-paper/70 leading-relaxed">
              Compare the SHA-256 value above with the file you downloaded. Never run an installer whose
              checksum does not match. On Windows, use PowerShell:
            </p>
            <div className="rounded border border-line dark:border-line-dark bg-ink-950 dark:bg-ink-850 p-4 overflow-x-auto max-w-full">
              <code className="text-xs font-mono text-paper/85 leading-relaxed block whitespace-pre">
                Get-FileHash -Algorithm SHA256{" "}
                <span className="text-blue-300">.\{current.filename}</span>
              </code>
            </div>
            <p className="flex items-start gap-2 text-xs text-ink-mute dark:text-paper/50 leading-relaxed">
              <HardDrive className="w-4 h-4 shrink-0 mt-0.5" />
              {PRODUCT_NAME} stores your documents as plain files on this machine. It never uploads them,
              and the installer itself contains no third-party offers or bundled software.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 text-center space-y-3">
        <p className="text-sm text-ink-soft dark:text-paper/65">
          Already installed? Here's what changed in this release.
        </p>
        <button
          onClick={() => navigate('release-notes')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
        >
          Read the release notes
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};