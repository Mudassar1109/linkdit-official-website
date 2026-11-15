import React from 'react';
import { PageId } from '../types';
import { CONTACT_EMAIL, PRODUCT_NAME, SITE_URL } from '../data/websiteData';
import { PageHero } from '../components/PageHero';
import { Mail, Globe, ExternalLink } from 'lucide-react';

interface ContactProps {
  navigate: (page: PageId) => void;
}

export const ContactPage: React.FC<ContactProps> = ({ navigate }) => {
  return (
    <div className="border-t border-line dark:border-line-dark">
      {/* Header */}
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Contact{' '}
            <span className="text-gradient-accent">
              LinkDit
            </span>
          </>
        }
        description={`${PRODUCT_NAME} is built by a small independent team. Send us an email and a person will read it.`}
      />

      {/* Contact channels — card grid */}
      <section className="container-narrow py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="card-base card-hover relative overflow-hidden p-6 space-y-3 group"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(60%_100%_at_20%_0%,rgba(124,58,237,0.08),transparent_75%)]"
            />
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-fg-accent dark:bg-accent/20 dark:text-violet-200">
              <Mail className="w-5 h-5" />
            </span>
            <h3 className="relative font-display font-bold tracking-tight text-ink dark:text-paper">Support &amp; questions</h3>
            <p className="relative text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
              Installation issues, feature questions, bug reports.
            </p>
            <span className="relative inline-flex items-center gap-1 text-xs font-mono text-fg-accent group-hover:underline">
              {CONTACT_EMAIL}
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="card-base card-hover relative overflow-hidden p-6 space-y-3 group"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(60%_100%_at_80%_0%,rgba(192,38,211,0.08),transparent_75%)]"
            />
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-2-soft text-fg-accent dark:bg-accent/20 dark:text-violet-200">
              <Mail className="w-5 h-5" />
            </span>
            <h3 className="relative font-display font-bold tracking-tight text-ink dark:text-paper">Everything else</h3>
            <p className="relative text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
              Press, partnerships, pricing questions, and general inquiries.
            </p>
            <span className="relative inline-flex items-center gap-1 text-xs font-mono text-fg-accent group-hover:underline">
              {CONTACT_EMAIL}
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        </div>

        <div className="card-base mt-4 p-6 space-y-2">
          <h3 className="flex items-center gap-2 font-display font-bold tracking-tight text-ink dark:text-paper">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-accent-soft text-fg-accent dark:bg-accent/20 dark:text-violet-200">
              <Globe className="w-4 h-4" />
            </span>
            Official domain
          </h3>
          <p className="text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
            The only official site is{' '}
            <a href={`${SITE_URL}/`} className="font-mono text-fg-accent hover:underline">
              {SITE_URL.replace(/^https?:\/\//, '')}
            </a>
            . We will never email you asking for payment or passwords. When Pro becomes available,
            any payment will be taken only through the official checkout linked from this domain.
          </p>
        </div>

        <p className="pt-8 text-center text-xs text-ink-mute dark:text-paper/40">
          Please allow a few working days for a reply.
        </p>
      </section>
    </div>
  );
};