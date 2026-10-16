import React, { useMemo, useState } from 'react';
import { PageId, EditorComparison } from '../types';
import {
  COMPARISON_CHECKED,
  COMPARISON_FILTERS,
  COMPARISON_ROWS,
  COMPARISON_SOURCES,
  EDITORS,
} from '../data/comparisonData';
import { PRODUCT_NAME } from '../data/websiteData';
import { trackCta } from '../lib/analytics';
import { Search, Download, ArrowRight, Check, Minus, ExternalLink, X } from 'lucide-react';

interface ComparePageProps {
  navigate: (page: PageId) => void;
}

function matchesQuery(editor: EditorComparison, q: string): boolean {
  if (!q) return true;
  const haystack = [
    editor.name,
    editor.tagline,
    ...editor.tags,
    ...Object.values(editor.cells),
    ...editor.pros,
    ...editor.limitations,
    ...editor.useCases,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export const ComparePage: React.FC<ComparePageProps> = ({ navigate }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const visibleEditors = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EDITORS.filter((editor) => {
      if (filter !== 'all' && !editor.tags.includes(filter as EditorComparison['tags'][number])) {
        return false;
      }
      return matchesQuery(editor, q);
    });
  }, [query, filter]);

  const clearFilters = () => {
    setQuery('');
    setFilter('all');
  };

  return (
    <div className="font-sans">
      {/* Comparison hero */}
      <header className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-14 text-center space-y-6">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Editor comparison
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            Markdown editors, compared
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            {PRODUCT_NAME} next to five editors writers and developers reach for every day. Price,
            platforms, editing model, privacy, and extensibility — every fact taken from the vendors&apos;
            own documentation, never guessed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                trackCta('compare_hero_download', 'compare', 'Download for Windows');
                navigate('download');
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
            >
              <Download className="w-4 h-4" />
              <span>Download for Windows</span>
            </button>
            <a
              href="#comparison-table"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-6 py-2.5 text-sm font-semibold text-ink hover:border-ink transition-colors dark:border-line-dark dark:text-paper dark:hover:border-paper"
            >
              Jump to the table
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs font-mono text-ink-mute dark:text-paper/45 pt-1">
            {EDITORS.length} editors · {COMPARISON_ROWS.length} dimensions · official sources only
          </p>
        </div>
      </header>

      {/* Searchable, filterable comparison table */}
      <section id="comparison-table" className="border-b border-line dark:border-line-dark scroll-mt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
              Side by side
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-paper">
              The full comparison table
            </h2>
            <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed max-w-2xl">
              Search by name or feature, or narrow the field with a filter. Deselect a filter to see all
              six editors again.
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-ink-mute absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search editors or features (e.g. plugins, citations, offline)..."
                aria-label="Search editors or features"
                className="w-full rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-ink-900 pl-9 pr-3 py-2.5 text-sm text-ink dark:text-paper placeholder:text-ink-mute focus:outline-none focus:border-accent"
              />
            </div>
            <div
              className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1"
              role="group"
              aria-label="Filter editors"
            >
              {COMPARISON_FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    aria-pressed={active}
                    className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                        : 'border border-line dark:border-line-dark text-ink-soft dark:text-paper/60 hover:border-line-strong dark:hover:border-paper/40'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-ink-mute dark:text-paper/50" aria-live="polite">
            Showing {visibleEditors.length} of {EDITORS.length} editors
            {filter !== 'all' &&
              ` · filter: ${COMPARISON_FILTERS.find((f) => f.id === filter)?.label ?? filter}`}
          </p>

          {visibleEditors.length === 0 ? (
            <div className="border border-line dark:border-line-dark bg-surface dark:bg-ink-850 p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-ink dark:text-paper">No editors match your search.</p>
              <p className="text-xs text-ink-soft dark:text-paper/60">
                Try a different term, or reset the search and filters.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-4 py-2 text-xs font-semibold text-ink hover:border-ink transition-colors dark:border-line-dark dark:text-paper dark:hover:border-paper"
              >
                <X className="w-3.5 h-3.5" />
                Clear search and filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-line dark:border-line-dark bg-surface dark:bg-ink-850">
              <table className="w-full text-left text-sm min-w-[960px]">
                <caption className="sr-only">
                  Comparison of {EDITORS.map((e) => e.name).join(', ')} across {COMPARISON_ROWS.length}{' '}
                  dimensions, based on official sources checked in {COMPARISON_CHECKED}.
                </caption>
                <thead>
                  <tr className="border-b border-line dark:border-line-dark text-xs font-mono uppercase tracking-wider text-ink-mute dark:text-paper/50">
                    <th
                      scope="col"
                      className="sticky left-0 z-20 bg-surface dark:bg-ink-850 px-5 py-3 font-semibold border-r border-line dark:border-line-dark"
                    >
                      Dimension
                    </th>
                    {visibleEditors.map((editor) => (
                      <th
                        key={editor.id}
                        scope="col"
                        className={`px-5 py-3 font-semibold ${
                          editor.isLinkDit ? 'text-accent' : ''
                        }`}
                      >
                        {editor.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line dark:divide-line-dark">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.id} className="text-ink-soft dark:text-paper/70">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-surface dark:bg-ink-850 px-5 py-3.5 font-medium text-ink dark:text-paper border-r border-line dark:border-line-dark align-top"
                      >
                        {row.label}
                      </th>
                      {visibleEditors.map((editor) => (
                        <td
                          key={editor.id}
                          className={`px-5 py-3.5 align-top ${
                            editor.isLinkDit ? 'bg-accent-soft/40 dark:bg-accent/10' : ''
                          }`}
                        >
                          {editor.cells[row.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-ink-mute dark:text-paper/50 leading-relaxed">
            Facts and prices as published by each vendor ({COMPARISON_CHECKED}). Prices are in USD and can
            change — check the vendor&apos;s own pricing page before buying. Sources are listed below.
          </p>
        </div>
      </section>

      {/* Editor cards */}
      <section id="editor-cards" className="border-b border-line dark:border-line-dark bg-paper-2/50 dark:bg-ink-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
              The detail
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-paper">
              Pros, limitations, and who each editor is for
            </h2>
          </div>

          {visibleEditors.length === 0 ? (
            <p className="text-sm text-ink-soft dark:text-paper/60">
              No editor cards to show — adjust your search or filters above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleEditors.map((editor) => (
                <article
                  key={editor.id}
                  className={`flex flex-col gap-5 border bg-surface dark:bg-ink-850 p-6 ${
                    editor.isLinkDit
                      ? 'border-accent/50 dark:border-accent/50'
                      : 'border-line dark:border-line-dark'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold tracking-tight text-ink dark:text-paper">
                        {editor.name}
                      </h3>
                      {editor.isLinkDit && (
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-soft text-accent-deep dark:bg-accent/15 dark:text-blue-300">
                          This site
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-soft dark:text-paper/60 leading-relaxed">
                      {editor.tagline}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-mute dark:text-paper/45">
                      Pros
                    </h4>
                    <ul className="space-y-1.5">
                      {editor.pros.map((item) => (
                        <li key={item} className="flex gap-2 text-xs text-ink-soft dark:text-paper/65 leading-relaxed">
                          <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-deep dark:text-blue-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-mute dark:text-paper/45">
                      Limitations
                    </h4>
                    <ul className="space-y-1.5">
                      {editor.limitations.map((item) => (
                        <li key={item} className="flex gap-2 text-xs text-ink-soft dark:text-paper/65 leading-relaxed">
                          <Minus className="w-3.5 h-3.5 mt-0.5 shrink-0 text-ink-mute dark:text-paper/45" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-mute dark:text-paper/45">
                      Best for
                    </h4>
                    <ul className="space-y-1.5">
                      {editor.useCases.map((item) => (
                        <li key={item} className="flex gap-2 text-xs text-ink-soft dark:text-paper/65 leading-relaxed">
                          <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-ink-mute dark:text-paper/45" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t border-line dark:border-line-dark flex flex-wrap items-center gap-3">
                    {editor.isLinkDit ? (
                      <button
                        onClick={() => {
                          trackCta('compare_card_download', 'compare', 'Download for Windows');
                          navigate('download');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download for Windows
                      </button>
                    ) : (
                      <a
                        href={editor.websiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink dark:text-paper hover:text-accent-deep dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {editor.websiteLabel}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sources and methodology */}
      <section id="sources" className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
              Sources &amp; methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-paper">
              Where every claim comes from
            </h2>
            <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
              Each price, licence, platform list, and feature on this page is taken from the product&apos;s
              own website, documentation, or repository, checked in {COMPARISON_CHECKED}. Where a vendor
              does not publish a fact, the table says so instead of guessing. No scores, ratings, or
              benchmark numbers are used — this page compares published facts, not opinions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {COMPARISON_SOURCES.map((source) => (
              <div key={source.editor} className="space-y-3">
                <h3 className="text-sm font-semibold text-ink dark:text-paper">{source.editor}</h3>
                <ul className="space-y-2">
                  {source.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1.5 text-xs text-ink-soft dark:text-paper/60 hover:text-ink dark:hover:text-paper transition-colors leading-relaxed"
                      >
                        <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
                        <span className="break-all">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-xs text-ink-mute dark:text-paper/50 leading-relaxed">
            Visual Studio Code is a product of Microsoft Corporation. Obsidian, Typora, MarkText, and
            Zettlr belong to their respective owners and are named here for identification only. See{' '}
            <button
              onClick={() => navigate('copyright')}
              className="underline hover:text-ink dark:hover:text-paper transition-colors"
            >
              Copyright &amp; Trademarks
            </button>
            .
          </p>
        </div>
      </section>

      {/* Download CTA */}
      <section className="bg-paper-2/50 dark:bg-ink-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
                Try it
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-paper">
                Write clearly. Write locally.
              </h2>
              <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
                If an offline, account-free editor for Windows fits your workflow, {PRODUCT_NAME} is free
                to download — about 6 MB, no sign-up, and no telemetry.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  trackCta('compare_download', 'compare', 'Download for Windows');
                  navigate('download');
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
              >
                <Download className="w-4 h-4" />
                <span>Download for Windows</span>
              </button>
              <button
                onClick={() => navigate('features')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-6 py-2.5 text-sm font-semibold text-ink hover:border-ink transition-colors dark:border-line-dark dark:text-paper dark:hover:border-paper"
              >
                See all features
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
