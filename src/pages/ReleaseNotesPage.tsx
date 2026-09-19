import React from 'react';
import { PageId } from '../types';
import { PRODUCT_NAME, CURRENT_VERSION_LABEL, CHANGELOG_ITEMS } from '../data/websiteData';
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
      <header className="border-b border-line bg-paper-2/60 dark:bg-ink-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center space-y-5">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute">
            Release Notes
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            {PRODUCT_NAME} {current.version}
          </h1>
          <p className="text-sm sm:text-base text-ink-soft dark:text-paper/70 max-w-2xl mx-auto leading-relaxed">
            The current release of a rebuilt, offline-first Markdown and rich-text editor for Windows 10 and 11.
          </p>
          <button
            onClick={() => navigate('download')}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
          >
            <Download className="w-4 h-4" />
            <span>Download v{current.version}</span>
          </button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <article className="border border-line bg-surface dark:bg-ink-850 dark:border-line-dark">
          <div className="border-b border-line dark:border-line-dark p-6 sm:p-8 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-semibold text-accent">v{current.version}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold">Current Release</span>
              <span className="text-xs font-mono text-ink-mute">{current.date}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-ink dark:text-paper">
              {current.title}
            </h2>
            <p className="text-sm text-ink-soft dark:text-paper/70 leading-relaxed">
              {current.summary}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-sm text-ink-soft dark:text-paper/75 leading-relaxed">
            <div className="grid gap-4 sm:grid-cols-2">
              {current.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 border border-line dark:border-line-dark p-4">
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

        <div className="flex items-start gap-3 border border-line dark:border-line-dark bg-paper-2/60 dark:bg-ink-900 p-5">
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
                className="border border-line bg-paper-2/50 dark:bg-ink-900 dark:border-line-dark p-6 space-y-2"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-ink dark:text-paper">v{item.version}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-paper-2 dark:bg-ink-850 text-ink-soft dark:text-paper/60 font-semibold">
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
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-paper-2 dark:bg-ink-850 text-ink-soft dark:text-paper/60 font-semibold">
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