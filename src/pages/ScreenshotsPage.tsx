import React, { useState } from 'react';
import { PageId, ScreenshotItem } from '../types';
import { SCREENSHOTS, PRODUCT_NAME } from '../data/websiteData';
import { ScreenshotCard } from '../components/ScreenshotCard';
import { LightboxModal } from '../components/LightboxModal';
import { Search, ImageIcon } from 'lucide-react';

interface ScreenshotsPageProps {
  navigate: (page: PageId) => void;
  selectedIdFromQuery?: string | null;
}

const VIEWS = ['All', 'Interface', 'Editor', 'Themes'];

export const ScreenshotsPage: React.FC<ScreenshotsPageProps> = ({
  navigate,
  selectedIdFromQuery,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightbox, setActiveLightbox] = useState<ScreenshotItem | null>(() => {
    if (selectedIdFromQuery) {
      return SCREENSHOTS.find((s) => s.id === selectedIdFromQuery) || null;
    }
    return null;
  });

  const filteredScreenshots = SCREENSHOTS.filter((s) => {
    if (activeCategory !== 'All' && s.category !== activeCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );
  });

  const reset = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 text-center space-y-5">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Interface
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            The {PRODUCT_NAME} workspace, rendered
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            Six views of the current build — tabs, Markdown, rich text, dark theme, sidebar, and the
            status bar. Previews are drawn on this page; the real thing is one download away.
          </p>

          <div className="mx-auto max-w-md relative">
            <Search className="w-4 h-4 text-ink-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search views..."
              className="w-full rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-ink-900 pl-10 pr-3 py-2.5 text-sm text-ink dark:text-paper placeholder:text-ink-mute focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </header>

      {/* Category tabs */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {VIEWS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                  : 'border border-line dark:border-line-dark text-ink-soft dark:text-paper/60 hover:border-line-strong'
              }`}
            >
              {cat}
              {cat === 'All' ? ` (${SCREENSHOTS.length})` : ''}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          {filteredScreenshots.length === 0 ? (
            <div className="text-center py-16 border border-line dark:border-line-dark bg-surface dark:bg-ink-850 space-y-3">
              <ImageIcon className="w-8 h-8 text-ink-mute mx-auto" />
              <h3 className="text-base font-semibold text-ink dark:text-paper">No views match</h3>
              <button
                onClick={reset}
                className="text-sm font-semibold text-accent hover:text-accent-deep"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-line dark:border-line-dark bg-line dark:bg-line-dark">
              {filteredScreenshots.map((item) => (
                <ScreenshotCard key={item.id} screenshot={item} onClick={(s) => setActiveLightbox(s)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <LightboxModal
        screenshot={activeLightbox}
        screenshotsList={filteredScreenshots}
        onClose={() => setActiveLightbox(null)}
        onNavigate={(item) => setActiveLightbox(item)}
      />
    </div>
  );
};