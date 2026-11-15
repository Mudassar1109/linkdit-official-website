import React from 'react';
import { PageId } from '../types';
import { PRODUCT_NAME, CURRENT_VERSION_LABEL, CHANGELOG_ITEMS } from '../data/websiteData';
import { trackCta } from '../lib/analytics';
import { PageHero } from '../components/PageHero';
import { Download, FileText, ArrowRight, CheckCircle, Info, Archive, Clock } from 'lucide-react';

interface ReleaseProps {
  navigate: (page: PageId) => void;
}

export const ReleaseNotesPage: React.FC<ReleaseProps> = ({ navigate }) => {
  const current = CHANGELOG_ITEMS.find((item) => item.status === 'current') ?? CHANGELOG_ITEMS[0];
  const previous = CHANGELOG_ITEMS.filter((item) => item.status === 'previous');
  const legacy = CHANGELOG_ITEMS.filter((item) => item.status === 'legacy');

  return (
    <div className="space-y-16 pb-20 font-sans">
      <PageHero
        eyebrow="Release Notes"
        title={
          <>
            {PRODUCT_NAME}{' '}
            <span className="text-gradient-accent">
              v{current.version}
            </span>
          </>
        }
        description="The current release of a rebuilt, offline-first Markdown and rich-text editor for Windows 10 and 11."
      >
        <button
          onClick={() => {
            trackCta('release_notes_download', 'release-notes', `Download v${current.version}`);
            navigate('download');
          }}
          className="btn-accent"
        >
          <Download className="w-4 h-4" />
          <span>Download v{current.version}</span>
        </button>
      </PageHero>

      <section className="container-narrow space-y-10">
        <article className="card-base overflow-hidden">
          <div className="border-b border-line dark:border-line-dark p-6 sm:p-8 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-semibold text-accent">v{current.version}</span>
              <span className="badge-accent">Current Release</span>
              <span className="text-xs font-mono text-ink-mute">{current.date}</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink dark:text-paper">
              {current.title}
            </h2>
            <p className="text-sm text-ink-soft dark:text-paper/70 leading-relaxed">
              {current.summary}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-sm text-ink-soft dark:text-paper/75 leading-relaxed">
            <div className="grid gap-4 sm:grid-cols-2">
              {current.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-line bg-paper-2/40 p-4 dark:border-line-dark dark:bg-ink-900/60">
                  <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold text-ink dark:text-paper mb-2">What's in this release</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                {current.featuresAdded.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line dark:border-line-dark pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => navigate('changelog')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
              >
                <FileText className="w-4 h-4" />
                <span>View full version history</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </article>

        <div className="card-base flex items-start gap-3 p-5">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-ink dark:text-paper">
              Why is {CURRENT_VERSION_LABEL} newer than v1.0.0?
            </p>
            <p className="text-sm text-ink-soft dark:text-paper/70 leading-relaxed">
              Version numbering was restarted when {PRODUCT_NAME} was rebuilt from scratch on a new codebase.
              The releases below with higher version numbers (v1.0.0, v0.9.5) belong to the earlier product line and
              are kept on record for transparency. They are not newer than {CURRENT_VERSION_LABEL} and are not meant for new installs.
            </p>
          </div>
        </div>

        {previous.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-ink-mute" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-mute">
                Previous release (current product line)
              </h2>
            </div>
            {previous.map((item) => (
              <article
                key={item.version}
                className="card-base p-6 space-y-2"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-ink dark:text-paper">v{item.version}</span>
                  <span className="badge-neutral">
                    Previous release
                  </span>
                  <span className="text-xs font-mono text-ink-mute">{item.date}</span>
                </div>
                <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">{item.summary}</p>
              </article>
            ))}
            <p className="text-xs text-ink-mute leading-relaxed">
              Superseded by the current {CURRENT_VERSION_LABEL} release. Kept on record for accurate version history.
            </p>
          </section>
        )}

        {legacy.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4 text-ink-mute" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-mute">
                Legacy releases (earlier product line)
              </h2>
            </div>
            {legacy.map((item) => (
              <article
                key={item.version}
                className="border border-line bg-paper-2/50 dark:bg-ink-900 dark:border-line-dark p-6 space-y-2 opacity-80"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-ink-soft dark:text-paper/80">v{item.version}</span>
                  <span className="badge-neutral">
                    {item.badge === 'Legacy' ? 'Legacy release' : item.title}
                  </span>
                  <span className="text-xs font-mono text-ink-mute">{item.date}</span>
                </div>
                <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">{item.summary}</p>
              </article>
            ))}
            <p className="text-xs text-ink-mute leading-relaxed">
              These builds are superseded by the current {CURRENT_VERSION_LABEL} release. They remain listed only for accurate record-keeping,
              and the Download page marks their installers as legacy to avoid confusion.
            </p>
          </section>
        )}
      </section>
    </div>
  );
};