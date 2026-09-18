import React from 'react';
import { PageId } from '../types';
import { DOMAIN_NAME, PRODUCT_NAME } from '../data/websiteData';
import { Mail, Globe, ExternalLink } from 'lucide-react';

interface ContactProps {
  navigate: (page: PageId) => void;
}

export const ContactPage: React.FC<ContactProps> = ({ navigate }) => {
  return (
    <div className="border-t border-line dark:border-line-dark">
      {/* Header */}
      <header className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 text-center space-y-5">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Contact
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            Contact LinkDit
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            {PRODUCT_NAME} is built by a small independent team. Send us an email and a person will read it.
          </p>
        </div>
      </header>

      {/* Contact channels */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-px bg-line dark:bg-line-dark border border-line dark:border-line-dark grid sm:grid-cols-2">
          <a
            href={`mailto:support@${DOMAIN_NAME}`}
            className="bg-surface dark:bg-ink-850 p-6 hover:bg-paper-2 dark:hover:bg-ink-800 transition-colors group space-y-3"
          >
            <Mail className="w-5 h-5 text-accent-deep dark:text-blue-300" />
            <h3 className="font-semibold text-ink dark:text-paper">Support & questions</h3>
            <p className="text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
              Installation issues, feature questions, bug reports.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-accent-deep dark:text-blue-300 group-hover:underline">
              support@{DOMAIN_NAME}
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          <a
            href={`mailto:hello@${DOMAIN_NAME}`}
            className="bg-surface dark:bg-ink-850 p-6 hover:bg-paper-2 dark:hover:bg-ink-800 transition-colors group space-y-3"
          >
            <Mail className="w-5 h-5 text-accent-deep dark:text-blue-300" />
            <h3 className="font-semibold text-ink dark:text-paper">Everything else</h3>
            <p className="text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
              Press, partnerships, and general inquiries.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-accent-deep dark:text-blue-300 group-hover:underline">
              hello@{DOMAIN_NAME}
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        </div>

        <div className="mt-4 border border-line dark:border-line-dark bg-surface dark:bg-ink-900 p-6 space-y-2">
          <h3 className="flex items-center gap-2 font-semibold text-ink dark:text-paper">
            <Globe className="w-4 h-4 text-accent-deep dark:text-blue-300" />
            Official domain
          </h3>
          <p className="text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
            The only official site is{' '}
            <a href={`https://${DOMAIN_NAME}/`} className="font-mono text-accent-deep dark:text-blue-300 hover:underline">
              https://{DOMAIN_NAME}
            </a>
            . We never ask for payment, passwords, or installation of anything outside this domain.
          </p>
        </div>

        <p className="pt-8 text-center text-xs text-ink-mute dark:text-paper/40">
          Please allow a few working days for a reply.
        </p>
      </section>
    </div>
  );
};