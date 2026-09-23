import React from 'react';
import { PageId } from '../types';
import { Download, Mail } from 'lucide-react';
import { DOMAIN_NAME, PRODUCT_NAME, TAGLINE } from '../data/websiteData';

interface FooterProps {
  navigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const productLinks: { id: PageId; label: string }[] = [
    { id: 'products', label: 'Product' },
    { id: 'features', label: 'Features' },
    { id: 'download', label: 'Download' },
    { id: 'release-notes', label: 'Release Notes' },
  ];

  const companyLinks: { id: PageId; label: string }[] = [
    { id: 'screenshots', label: 'Interface Gallery' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'changelog', label: 'Changelog' },
    { id: 'docs', label: 'Documentation' },
    { id: 'support', label: 'Support' },
    { id: 'contact', label: 'Contact' },
  ];

  const legalLinks: { id: PageId; label: string }[] = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'license', label: 'Software License' },
    { id: 'eula', label: 'End User License' },
    { id: 'copyright', label: 'Copyright & Trademarks' },
  ];

  return (
    <footer className="border-t border-line dark:border-line-dark bg-paper-2/60 dark:bg-ink-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-line dark:border-line-dark">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/icon-128.png?v=20260918" alt="" className="w-8 h-8 rounded-lg object-contain ring-1 ring-line dark:ring-line-dark" />
              <span className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold tracking-tight text-ink dark:text-paper">LinkDit</span>
                <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-accent-soft text-accent-deep dark:bg-accent/15 dark:text-blue-300">
                  Pad
                </span>
              </span>
            </div>
            <p className="text-xs text-ink-soft dark:text-paper/55 max-w-xs leading-relaxed">
              {TAGLINE} {PRODUCT_NAME} is a fast, offline-first Markdown and rich-text editor for Windows —
              no account, no telemetry, and your files stay on your computer.
            </p>
            <a
              href={`https://${DOMAIN_NAME}/`}
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
            >
              <Download className="w-3.5 h-3.5" />
              Download for Windows
            </a>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/45">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              {productLinks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => navigate(l.id)} className="text-ink-soft dark:text-paper/60 hover:text-ink dark:hover:text-paper transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/45">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              {companyLinks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => navigate(l.id)} className="text-ink-soft dark:text-paper/60 hover:text-ink dark:hover:text-paper transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/45">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              {legalLinks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => navigate(l.id)} className="text-ink-soft dark:text-paper/60 hover:text-ink dark:hover:text-paper transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-mute dark:text-paper/45">
          <div className="flex items-center gap-3">
            <span>© 2026 LinkDit</span>
            <span className="text-line-strong dark:text-line-dark">•</span>
            <span>v0.1.2</span>
            <span className="text-line-strong dark:text-line-dark">•</span>
            <a
              href={`mailto:support@${DOMAIN_NAME}`}
              className="inline-flex items-center gap-1.5 hover:text-ink dark:hover:text-paper transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              support@{DOMAIN_NAME}
            </a>
          </div>
          <span>Zero telemetry · Local files only</span>
        </div>
      </div>
    </footer>
  );
};