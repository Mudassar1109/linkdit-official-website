import React from 'react';
import { PageId } from '../types';
import { CHANGELOG_ITEMS, PRODUCT_NAME } from '../data/websiteData';
import { PageHero } from '../components/PageHero';
import { Sparkles, Wrench, Bug } from 'lucide-react';

interface ChangelogProps {
  navigate: (page: PageId) => void;
}

const badgeStyles: Record<string, string> = {
  Current: 'bg-accent text-paper',
  Previous: 'bg-paper-2 dark:bg-ink-850 text-ink-soft dark:text-paper/60',
  Legacy: 'bg-paper-2 dark:bg-ink-850 text-ink-soft dark:text-paper/60',
  Major: 'bg-accent text-paper',
  Feature: 'bg-accent-soft text-fg-accent dark:bg-accent/15',
  Patch: 'bg-paper-2 dark:bg-ink-850 text-ink-soft dark:text-paper/60',
};

export const ChangelogPage: React.FC<ChangelogProps> = ({ navigate }) => {
  return (
    <div className="border-t border-line dark:border-line-dark">
      {/* Header */}
      <PageHero
        eyebrow="Changelog"
        title={
          <>
            {PRODUCT_NAME}{' '}
            <span className="text-gradient-accent">
              version history
            </span>
          </>
        }
        description={`What shipped in each release. The current version is ${CHANGELOG_ITEMS[0]?.version || '0.1.2'}.`}
      />

      {/* Timeline — card-based with violet nodes */}
      <section className="container-narrow py-14 space-y-12">
        {CHANGELOG_ITEMS.map((item, idx) => (
          <div key={idx} className={`relative pl-8 sm:pl-10 border-l-2 border-dashed border-line-strong dark:border-line-dark space-y-5 ${item.status === 'legacy' ? 'opacity-70' : ''}`}>
            <span className={`absolute -left-[10px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full ring-6 ring-paper dark:ring-ink-950 ${item.status === 'legacy' ? 'bg-ink-mute/50' : 'gradient-violet shadow-glow'}`} />

            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-3xl font-bold tracking-[-0.02em] text-ink dark:text-paper">
                v{item.version}
              </span>
              <span className="badge-neutral">{item.date}</span>
              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeStyles[item.badge] || ''}`}>
                  {item.badge}
                </span>
              )}
            </div>

            <h3 className="font-display text-lg font-bold tracking-tight text-ink dark:text-paper">{item.title}</h3>
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

            <div className="card-base p-6 space-y-5">
              {item.featuresAdded.length > 0 && (
                <div className="space-y-2">
                  <span className="eyebrow text-fg-accent block">
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
                  <span className="eyebrow text-ink-mute dark:text-paper/45 block">
                    Improvements &amp; fixes
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