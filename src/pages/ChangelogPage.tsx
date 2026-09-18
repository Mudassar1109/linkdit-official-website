import React from 'react';
import { PageId } from '../types';
import { CHANGELOG_ITEMS, PRODUCT_NAME } from '../data/websiteData';
import { Sparkles, Wrench, Bug } from 'lucide-react';

interface ChangelogProps {
  navigate: (page: PageId) => void;
}

const badgeStyles: Record<string, string> = {
  Current: 'bg-accent text-blue-50',
  Legacy: 'bg-paper-2 dark:bg-ink-850 text-ink-soft dark:text-paper/60',
  Major: 'bg-accent text-blue-50',
  Feature: 'bg-accent-soft text-accent-deep dark:bg-accent/15 dark:text-blue-300',
  Patch: 'bg-paper-2 dark:bg-ink-850 text-ink-soft dark:text-paper/60',
};

export const ChangelogPage: React.FC<ChangelogProps> = ({ navigate }) => {
  return (
    <div className="border-t border-line dark:border-line-dark">
      {/* Header */}
      <header className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 text-center space-y-5">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Changelog
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            {PRODUCT_NAME} version history
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            What shipped in each release. The current version is {CHANGELOG_ITEMS[0]?.version || '0.1.1'}.
          </p>
        </div>
      </header>

      {/* Timeline */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {CHANGELOG_ITEMS.map((item, idx) => (
          <div key={idx} className={`relative pl-7 sm:pl-8 border-l-2 border-line-strong dark:border-line-dark space-y-5 ${item.status === 'legacy' ? 'opacity-70' : ''}`}>
            <span className={`absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full ring-6 ring-paper dark:ring-ink-950 ${item.status === 'legacy' ? 'bg-ink-soft/50 dark:bg-paper/35' : 'bg-accent'}`} />

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold tracking-tight text-ink dark:text-paper font-mono">
                v{item.version}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-2 dark:bg-ink-850 text-ink-soft dark:text-paper/60 font-semibold">
                {item.date}
              </span>
              {item.badge && (
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${badgeStyles[item.badge] || ''}`}>
                  {item.badge}
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-ink dark:text-paper">{item.title}</h3>
            <p className="text-sm text-ink-soft dark:text-paper/60 leading-relaxed">{item.summary}</p>

            {item.highlights && item.highlights.length > 0 && (
              <ul className="space-y-2 text-sm">
                {item.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2.5 text-ink-soft dark:text-paper/65 leading-relaxed">
                    <span className="mt-[7px] w-1.5 h-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="bg-surface dark:bg-ink-850 border border-line dark:border-line-dark p-6 space-y-5">
              {item.featuresAdded.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/45 block">
                    Added
                  </span>
                  <ul className="space-y-1.5 text-sm">
                    {item.featuresAdded.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-ink-soft dark:text-paper/65">
                        <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(item.improvements.length > 0 || item.bugFixes.length > 0) && (
                <div className="space-y-2 pt-4 border-t border-line dark:border-line-dark">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/45 block">
                    Improvements & fixes
                  </span>
                  <ul className="space-y-1.5 text-sm">
                    {item.improvements.map((imp, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2.5 text-ink-soft dark:text-paper/65">
                        <Wrench className="w-4 h-4 mt-0.5 shrink-0 text-ink-soft dark:text-paper/55" />
                        <span>{imp}</span>
                      </li>
                    ))}
                    {item.bugFixes.map((fix, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-ink-soft dark:text-paper/65">
                        <Bug className="w-4 h-4 mt-0.5 shrink-0 text-ink-soft dark:text-paper/55" />
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};