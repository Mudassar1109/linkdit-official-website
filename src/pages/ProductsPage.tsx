import React from 'react';
import { PageId } from '../types';
import { PRODUCT_NAME, TAGLINE } from '../data/websiteData';
import { trackCta } from '../lib/analytics';
import { PageHero } from '../components/PageHero';
import { Download, ArrowRight, Check, X, Monitor, Shield, FileText, WifiOff } from 'lucide-react';

interface ProductsPageProps {
  navigate: (page: PageId) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ navigate }) => {
  const pillars = [
    {
      icon: <Monitor className="w-5 h-5" />,
      title: 'A native Windows app',
      desc: 'Built with Tauri — a small Rust core and a fast, lightweight interface. No Electron-scale overhead, no background services.',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Local & private',
      desc: 'The Free plan needs no account or login and has no telemetry. Documents are plain files on your disk and never leave your machine.',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Markdown & rich text',
      desc: 'Type Markdown, use rich text for tables and task lists, or keep it plain .txt. The choice is per document.',
    },
    {
      icon: <WifiOff className="w-5 h-5" />,
      title: 'Offline by design',
      desc: 'Install once and everything works with no connection — on flights, in cafés, or on air-gapped machines.',
    },
  ];

  const formats = [
    '.md',
    '.txt',
    '.json',
    '.js',
    '.ts',
    '.py',
    '.html',
    '.css',
    '.sql',
    '.yaml',
    '.log',
  ];

  const comparison: { label: string; lp: string; web: string }[] = [
    { label: 'Where your files live', lp: 'On your computer', web: 'On their servers' },
    { label: 'Works fully offline', lp: 'Yes', web: 'No' },
    { label: 'Account required', lp: 'Not for Free; Pro when available', web: 'Usually yes' },
    { label: 'Usage telemetry', lp: 'None', web: 'Typical' },
    { label: 'Markdown support', lp: 'Yes, native', web: 'Extra plugin' },
    { label: 'Local file formats', lp: 'Open .md / .txt', web: 'Proprietary' },
  ];

  return (
    <div className="font-sans">
      {/* Header */}
      <PageHero
        eyebrow="The Product"
        title={
          <>
            {PRODUCT_NAME}{' '}
            <span className="text-gradient-accent">
              in one page.
            </span>
          </>
        }
        description={
          <>
            {TAGLINE} {PRODUCT_NAME} is the editor you fall back on when you need to
            actually write — notes, docs, READMEs, journals, and code that is mostly words.
          </>
        }
      >
        <button
          onClick={() => {
            trackCta('products_download', 'products', 'Download for Windows');
            navigate('download');
          }}
          className="btn-accent btn-lg"
        >
          <Download className="w-4 h-4" />
          <span>Download for Windows</span>
        </button>
        <button
          onClick={() => {
            trackCta('products_pricing', 'products', 'See pricing');
            navigate('pricing');
          }}
          className="btn-secondary btn-lg"
        >
          See pricing
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('release-notes')}
          className="btn-secondary btn-lg"
        >
          Release notes
          <ArrowRight className="w-4 h-4" />
        </button>
      </PageHero>

      {/* Screenshot showcase — the product, unedited */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-14 sm:py-16">
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-violet-500/10 blur-3xl"
            />
            <div className="relative overflow-hidden rounded-2xl border border-line shadow-card-elevated dark:border-line-dark">
              <div className="flex items-center gap-3 border-b border-line bg-paper-2/70 px-4 py-2.5 dark:border-line-dark dark:bg-ink-900/70">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
                </span>
                <span className="font-mono text-[11px] text-ink-mute dark:text-zinc-500">TypoDocs — the real workspace</span>
              </div>
              <img
                src="/images/software/01-main-editor.png"
                alt="TypoDocs Markdown editor interface"
                loading="lazy"
                decoding="async"
                className="w-full object-cover object-top"
              />
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { src: '/images/software/02-settings-editor.png', alt: 'TypoDocs editor settings and Auto Save controls', label: 'Editor settings' },
              { src: '/images/software/03-workspace-dark.png', alt: 'TypoDocs dark workspace', label: 'Dark workspace' },
              { src: '/images/software/04-trash-recovery.png', alt: 'TypoDocs Trash and recovery', label: 'Trash & recovery' },
            ].map((shot) => (
              <figure key={shot.src} className="card-base card-hover overflow-hidden">
                <img
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover object-top"
                />
                <figcaption className="border-t border-line px-4 py-3 font-mono text-[11px] text-ink-mute dark:border-line-dark dark:text-zinc-500">
                  {shot.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars — numbered split cards */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-16 sm:py-20">
          <div className="mb-10 space-y-2">
            <p className="eyebrow text-fg-accent">Four pillars</p>
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl dark:text-paper">
              What makes it a different kind of editor.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <div key={p.title} className="card-base card-hover group relative space-y-3.5 p-7">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-fg-accent ring-1 ring-accent/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:bg-accent/20 dark:text-violet-200">
                    {p.icon}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.14em] text-ink-mute dark:text-zinc-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="text-[15px] font-bold tracking-tight text-ink dark:text-paper">{p.title}</h2>
                <p className="text-[13px] leading-relaxed text-ink-soft dark:text-zinc-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-16 sm:py-20 flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2 space-y-4">
            <p className="eyebrow text-fg-accent">Formats</p>
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl dark:text-paper">
              Your files are just files.
            </h2>
            <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
              Open anything text-based — Markdown, plain text, config, logs, or source code. TypoDocs
              works with the same open formats every other text tool understands, so nothing is ever
              locked into one program.
            </p>
          </div>
          <div className="lg:w-1/2 flex flex-wrap content-start gap-2.5">
            {formats.map((f) => (
              <span
                key={f}
                className="rounded-full border border-line dark:border-line-dark bg-surface dark:bg-ink-850 px-3.5 py-1.5 font-mono text-xs text-ink-soft shadow-xs transition-colors hover:border-accent hover:text-fg-accent dark:text-paper/70"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Honest comparison */}
      <section className="border-b border-line dark:border-line-dark bg-paper-2/50 dark:bg-ink-900/40">
        <div className="container-site py-16 sm:py-20">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="eyebrow text-fg-accent">How it differs</p>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl dark:text-paper">
                Local desktop software, with a Free plan.
              </h2>
            </div>

            <div className="overflow-x-auto card-base">
              <table className="w-full text-left text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-line dark:border-line-dark">
                    <th className="table-header">Dimension</th>
                    <th className="table-header text-accent">TypoDocs</th>
                    <th className="table-header">Typical web docs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line dark:divide-line-dark">
                  {comparison.map((row) => (
                    <tr key={row.label} className="table-row-hover text-ink-soft dark:text-paper/70">
                      <td className="px-5 py-3.5 font-medium text-ink dark:text-paper">{row.label}</td>
                      <td className="px-5 py-3.5 flex items-center gap-2 text-fg-accent">
                        <Check className="w-4 h-4 shrink-0" />
                        {row.lp}
                      </td>
                      <td className="px-5 py-3.5 flex items-center gap-2 text-ink-mute dark:text-paper/50">
                        <X className="w-4 h-4 shrink-0" />
                        {row.web}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-ink-mute dark:text-paper/50 leading-relaxed">
              We are not claiming TypoDocs replaces a full IDE or a collaborative suite. This table only
              describes how the two categories store and treat your documents.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};