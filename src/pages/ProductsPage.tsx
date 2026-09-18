import React from 'react';
import { PageId } from '../types';
import { PRODUCT_NAME, TAGLINE } from '../data/websiteData';
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
      desc: 'No account, no login, no telemetry. Documents are plain files on your disk and never leave your machine.',
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
    { label: 'Account required', lp: 'No', web: 'Usually yes' },
    { label: 'Usage telemetry', lp: 'None', web: 'Typical' },
    { label: 'Markdown support', lp: 'Yes, native', web: 'Extra plugin' },
    { label: 'Local file formats', lp: 'Open .md / .txt', web: 'Proprietary' },
  ];

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-14 text-center space-y-5">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            The Product
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            {PRODUCT_NAME}
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            {TAGLINE} {PRODUCT_NAME} is the editor you fall back on when you need to
            actually write — notes, docs, READMEs, journals, and code that is mostly words.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('download')}
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
            >
              <Download className="w-4 h-4" />
              <span>Download for Windows</span>
            </button>
            <button
              onClick={() => navigate('release-notes')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-6 py-2.5 text-sm font-semibold text-ink hover:border-ink transition-colors dark:border-line-dark dark:text-paper dark:hover:border-paper"
            >
              Release notes
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Pillars */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px border border-line dark:border-line-dark bg-line dark:bg-line-dark">
            {pillars.map((p) => (
              <div key={p.title} className="bg-paper dark:bg-ink-950 p-7 space-y-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-paper-2 dark:bg-ink-900 text-accent-deep dark:text-blue-300">
                  {p.icon}
                </span>
                <h2 className="text-base font-semibold text-ink dark:text-paper">{p.title}</h2>
                <p className="text-xs text-ink-soft dark:text-paper/60 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
              Formats
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-paper">
              Your files are just files.
            </h2>
            <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
              Open anything text-based — Markdown, plain text, config, logs, or source code. LinkDit Pad
              works with the same open formats every other text tool understands, so nothing is ever
              locked into one program.
            </p>
          </div>
          <div className="lg:w-1/2 flex flex-wrap content-start gap-2">
            {formats.map((f) => (
              <span
                key={f}
                className="rounded-md border border-line dark:border-line-dark bg-paper-2/60 dark:bg-ink-900/50 px-3 py-1.5 font-mono text-xs text-ink-soft dark:text-paper/70"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Honest comparison */}
      <section className="border-b border-line dark:border-line-dark bg-paper-2/50 dark:bg-ink-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
                How it differs
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-paper">
                Desktop software, not a web subscription.
              </h2>
            </div>

            <div className="overflow-x-auto border border-line dark:border-line-dark bg-surface dark:bg-ink-850">
              <table className="w-full text-left text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-line dark:border-line-dark text-xs font-mono uppercase tracking-wider text-ink-mute dark:text-paper/50">
                    <th className="px-5 py-3 font-semibold">Dimension</th>
                    <th className="px-5 py-3 font-semibold text-accent">LinkDit Pad</th>
                    <th className="px-5 py-3 font-semibold">Typical web docs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line dark:divide-line-dark">
                  {comparison.map((row) => (
                    <tr key={row.label} className="text-ink-soft dark:text-paper/70">
                      <td className="px-5 py-3.5 font-medium text-ink dark:text-paper">{row.label}</td>
                      <td className="px-5 py-3.5 flex items-center gap-2 text-accent-deep dark:text-blue-300">
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
              We are not claiming LinkDit Pad replaces a full IDE or a collaborative suite. This table only
              describes how the two categories store and treat your documents.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};