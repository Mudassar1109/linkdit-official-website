import React, { useState } from 'react';
import { PageId } from '../types';
import { FEATURE_CATEGORIES, PRODUCT_NAME } from '../data/websiteData';
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
      <header className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 text-center space-y-5">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Features
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            What {PRODUCT_NAME} does
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            Every feature listed here exists in the current Windows build. Nothing is vaporware.
          </p>

          {/* Search + filter */}
          <div className="mx-auto max-w-xl flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-mute absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search features (e.g. Markdown, tabs, telemetry)..."
                className="w-full rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-ink-900 pl-9 pr-3 py-2.5 text-sm text-ink dark:text-paper placeholder:text-ink-mute focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none sm:justify-end">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                    : 'border border-line dark:border-line-dark text-ink-soft dark:text-paper/60 hover:border-line-strong'
                }`}
              >
                All
              </button>
              {FEATURE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                      : 'border border-line dark:border-line-dark text-ink-soft dark:text-paper/60 hover:border-line-strong'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Typography tester (a font preview, not a product claim) */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="border border-line dark:border-line-dark bg-surface dark:bg-ink-850 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line dark:border-line-dark">
              <div>
                <h2 className="font-semibold text-ink dark:text-paper">Sample the reading experience</h2>
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
                    className="w-24 accent-[#2563eb]"
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
                    className="w-24 accent-[#2563eb]"
                  />
                </label>
              </div>
            </div>
            <p
              className="pt-5 text-sm sm:text-base text-ink dark:text-paper"
              style={{ fontWeight: demoWeight, lineHeight: demoLineHeight }}
            >
              The words you read here are sized with the same kind of restraint LinkDit Pad applies to its
              own interface: comfortable line spacing, a calm typeface, and nothing competing with the text.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-12">
          {filteredCategories.length === 0 && (
            <p className="text-center text-sm text-ink-mute dark:text-paper/50">
              No features match that search.
            </p>
          )}
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-soft dark:bg-accent/15 text-accent-deep dark:text-blue-300">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-ink dark:text-paper">{cat.title}</h2>
                  <p className="text-xs text-ink-mute dark:text-paper/55">{cat.description}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px border border-line dark:border-line-dark bg-line dark:bg-line-dark">
                {cat.features.map((feat, fIdx) => (
                  <div key={fIdx} className="bg-paper dark:bg-ink-950 p-5 space-y-2">
                    <h3 className="text-sm font-semibold text-ink dark:text-paper">{feat.name}</h3>
                    <p className="text-xs text-ink-soft dark:text-paper/60 leading-relaxed">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-paper">
            See it on your machine.
          </h2>
          <button
            onClick={() => navigate('download')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
          >
            Download for Windows
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};