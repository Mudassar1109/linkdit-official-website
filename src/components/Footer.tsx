import React from 'react';
import { PageId } from '../types';
import { Download, Mail, ArrowUpRight, Globe } from 'lucide-react';
import { CONTACT_EMAIL, DOWNLOAD_PATH, PRODUCT_NAME, TAGLINE } from '../data/websiteData';
import { CURRENT_VERSION_LABEL, SITE_URL } from '../config';
import { trackCta } from '../lib/analytics';

interface FooterProps {
  navigate: (page: PageId) => void;
  currentPage: PageId;
}

export const Footer: React.FC<FooterProps> = ({ navigate, currentPage }) => {
  const productLinks: { id: PageId; label: string }[] = [
    { id: 'products', label: 'Product' },
    { id: 'features', label: 'Features' },
    { id: 'screenshots', label: 'Interface Gallery' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const resourceLinks: { id: PageId; label: string }[] = [
    { id: 'download', label: 'Download' },
    { id: 'docs', label: 'Documentation' },
    { id: 'changelog', label: 'Changelog' },
    { id: 'release-notes', label: 'Release Notes' },
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

  const companyLinks: { id: PageId; label: string; external?: string }[] = [
    { id: 'contact', label: 'Contact' },
    { id: 'home', label: 'typodocs.online', external: SITE_URL },
  ];

  const columns: { title: string; links: { id: PageId; label: string; external?: string }[] }[] = [
    { title: 'Product', links: productLinks },
    { title: 'Resources', links: resourceLinks },
    { title: 'Company', links: companyLinks },
    { title: 'Legal', links: legalLinks },
  ];

  const footerLink =
    'group inline-flex items-center gap-1.5 text-[13px] text-zinc-400 transition-colors hover:text-white';

  return (
    <footer className="mt-auto bg-ink-950 text-zinc-300">
      {/* CTA band */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(147,51,255,0.28),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(30%_60%_at_85%_20%,rgba(71,123,255,0.16),transparent_70%)]"
        />
        <div className="container-site relative grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <p className="eyebrow text-zinc-500">{TAGLINE}</p>
            <h2 className="max-w-xl text-3xl leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.75rem]">
              Your words deserve a desk of their own.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
              Download the Free plan for Windows 10 &amp; 11. No account, no telemetry, files stay on your PC.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <a
              href={DOWNLOAD_PATH}
              download
              onClick={() => trackCta('footer_download', currentPage, 'Download for Windows')}
              className="btn-accent btn-lg"
            >
              <Download className="h-4 w-4" />
              Download for Windows
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
            >
              <Mail className="h-4 w-4" />
              Contact us
            </a>
          </div>
        </div>
      </div>

      {/* Link grid */}
      <div className="container-site grid grid-cols-2 gap-x-8 gap-y-10 py-12 md:grid-cols-6 sm:py-14">
        <div className="col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <img
              src="/icon-128.png?v=20261025"
              alt=""
              className="h-10 w-10 rounded-xl object-contain shadow-sm ring-1 ring-white/15"
            />
            <div>
              <div className="font-display text-[16px] font-bold tracking-tight text-white">{PRODUCT_NAME}</div>
              <div className="font-mono text-[10px] text-zinc-500">{CURRENT_VERSION_LABEL} · Windows 10/11</div>
            </div>
          </div>
          <p className="max-w-xs text-[13px] leading-relaxed text-zinc-400">
            A fast, offline-first Markdown and rich-text editor for Windows. The Free plan needs no account, and your
            files stay on your computer.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Zero telemetry
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Local files only
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200"
            >
              <Mail className="h-3 w-3" />
              Email us
            </a>
            <a
              href={SITE_URL}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200"
            >
              <Globe className="h-3 w-3" />
              typodocs.online
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="space-y-4">
            <h4 className="eyebrow text-zinc-500">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.external ?? `/${l.id}`}
                    onClick={(e) => {
                      if (l.external) return;
                      e.preventDefault();
                      navigate(l.id);
                    }}
                    className={footerLink}
                  >
                    {l.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-70" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Ghost wordmark */}
      <div className="relative overflow-hidden" aria-hidden="true">
        <p className="select-none whitespace-nowrap text-center font-display text-[16.5vw] font-bold leading-[0.78] tracking-[-0.04em] text-white/[0.045]">
          TYPODOCS
        </p>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container-site flex flex-col items-center justify-between gap-2.5 py-6 text-xs text-zinc-500 sm:flex-row">
          <span>© {new Date().getFullYear()} LinkDit. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('privacy'); }} className="transition-colors hover:text-zinc-300">
              Privacy
            </a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('terms'); }} className="transition-colors hover:text-zinc-300">
              Terms
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 font-mono transition-colors hover:text-zinc-300">
              <Mail className="h-3.5 w-3.5" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
