import React, { useState } from 'react';
import { PageId } from '../types';
import { FEATURE_CATEGORIES, PRODUCT_NAME } from '../data/websiteData';
import { trackCta } from '../lib/analytics';
import { PageHero } from '../components/PageHero';
import { FileText, PenTool, Sliders, Palette, Zap, Shield, Search, ArrowRight } from 'lucide-react';

interface FeaturesPageProps {
  navigate: (page: PageId) => void;
}

const getCategoryIcon = (iconName: string) => {
  const className = 'w-5 h-5';
  switch (iconName) {
    case 'FileText': return <FileText className={className} />;
    case 'PenTool': return <PenTool className={className} />;
    case 'Sliders': return <Sliders className={className} />;
    case 'Palette': return <Palette className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Shield': return <Shield className={className} />;
    default: return <FileText className={className} />;
  }
};

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [demoWeight, setDemoWeight] = useState(450);
  const [demoLineHeight, setDemoLineHeight] = useState(1.7);

  const filteredCategories = FEATURE_CATEGORIES.filter((cat) => {
    if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.features.some((f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="font-sans">
      {/* Header */}
      <PageHero
        eyebrow="Features"
        title={
          <>
            What{' '}
            <span className="text-gradient-accent">
              {PRODUCT_NAME} does
            </span>
          </>
        }
        description="The workspace below is available in the current Windows build. Some advanced tools in this build are planned for Pro when it launches; Pro is coming soon."
      >
        {/* Search + filter — pill controls */}
        <div className="mx-auto w-full max-w-xl flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-mute absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search features (e.g. Markdown, tabs, telemetry)..."
              className="w-full rounded-full border border-line dark:border-line-dark bg-surface dark:bg-ink-900 pl-10 pr-4 py-2.5 text-sm text-ink dark:text-paper placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'gradient-violet text-white shadow-glow'
                  : 'border border-line dark:border-line-dark text-ink-soft dark:text-paper/60 hover:border-accent hover:text-fg-accent'
              }`}
            >
              All
            </button>
            {FEATURE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'gradient-violet text-white shadow-glow'
                    : 'border border-line dark:border-line-dark text-ink-soft dark:text-paper/60 hover:border-accent hover:text-fg-accent'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      {/* Typography tester — display-font specimen panel */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-12">
          <div className="card-base relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(124,58,237,0.05),transparent)]"
            />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-line dark:border-line-dark">
              <div>
                <p className="eyebrow text-fg-accent mb-1">Type tester</p>
                <h2 className="font-display font-bold tracking-tight text-lg text-ink dark:text-paper">Sample the reading experience</h2>
                <p className="text-xs text-ink-mute dark:text-paper/50 mt-0.5">
                  Adjust weight and line height in this text preview — the slider lives here, not in the app.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-ink-soft dark:text-paper/60">
                <label className="flex items-center gap-2">
                  Weight ({demoWeight})
                  <input
                    type="range"
                    min="400"
                    max="700"
                    step="50"
                    value={demoWeight}
                    onChange={(e) => setDemoWeight(Number(e.target.value))}
                    className="w-24 accent-accent"
                  />
                </label>
                <label className="flex items-center gap-2">
                  Line height ({demoLineHeight.toFixed(1)})
                  <input
                    type="range"
                    min="1.3"
                    max="2.0"
                    step="0.1"
                    value={demoLineHeight}
                    onChange={(e) => setDemoLineHeight(Number(e.target.value))}
                    className="w-24 accent-accent"
                  />
                </label>
              </div>
            </div>
            <div className="relative px-6 sm:px-8 py-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-6 top-6 font-display text-[6rem] font-bold leading-none text-accent/10 sm:left-8"
              >
                Aa
              </span>
              <p
                className="relative pt-5 text-sm sm:text-base text-ink dark:text-paper"
                style={{ fontWeight: demoWeight, lineHeight: demoLineHeight }}
              >
                The words you read here are sized with the same kind of restraint TypoDocs applies to its
                own interface: comfortable line spacing, a calm typeface, and nothing competing with the text.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories — split editorial layout: sticky intro rail + feature grid */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-14 space-y-16">
          {filteredCategories.length === 0 && (
            <p className="text-center text-sm text-ink-mute dark:text-paper/50">
              No features match that search.
            </p>
          )}
          {filteredCategories.map((cat, catIdx) => (
            <div key={cat.id} className="grid gap-8 lg:grid-cols-[0.85fr_2fr] lg:gap-14">
              {/* Sticky intro rail */}
              <div className="lg:sticky lg:top-36 lg:self-start space-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-fg-accent ring-1 ring-accent/20 dark:bg-accent/20 dark:text-violet-200">
                    {getCategoryIcon(cat.iconName)}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.14em] text-ink-mute dark:text-zinc-500">
                    {String(catIdx + 1).padStart(2, '0')} / {String(FEATURE_CATEGORIES.length).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl dark:text-paper">
                  {cat.title}
                </h2>
                <p className="text-sm leading-relaxed text-ink-soft dark:text-zinc-400">{cat.description}</p>
                <span aria-hidden="true" className="hidden h-px w-24 gradient-violet lg:block" />
              </div>

              {/* Feature list */}
              <div className="grid gap-3 sm:grid-cols-2">
                {cat.features.map((feat, fIdx) => (
                  <div key={fIdx} className="card-base card-hover group relative flex gap-4 p-5 overflow-hidden">
                    <span className="mt-0.5 font-mono text-[10px] text-ink-mute transition-colors group-hover:text-fg-accent dark:text-zinc-600">
                      {String(fIdx + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-ink dark:text-paper">{feat.name}</h3>
                      <p className="text-xs text-ink-soft dark:text-zinc-400 leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — gradient band */}
      <section className="container-site py-16">
        <div className="gradient-violet relative overflow-hidden rounded-3xl px-6 py-14 text-center space-y-4 shadow-card-elevated sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="bg-grid-dots pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(70%_70%_at_50%_0%,black,transparent)]"
          />
          <div className="relative space-y-4 text-white">
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
              See it on your machine.
            </h2>
            <p className="mx-auto max-w-md text-sm text-white/80">
              Install once, open a document, and try every feature on this page — the Free plan includes them all.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  trackCta('features_download', 'features', 'Download the Free plan');
                  navigate('download');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-violet-50"
              >
                Download the Free plan
              </button>
              <button
                onClick={() => {
                  trackCta('features_pricing', 'features', 'See pricing');
                  navigate('pricing');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60"
              >
                Compare Free and planned Pro features
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};