import React, { useState } from 'react';
import { PageId, ScreenshotItem } from '../types';
import { SCREENSHOTS, PRODUCT_NAME } from '../data/websiteData';
import { ScreenshotCard } from '../components/ScreenshotCard';
import { PageHero } from '../components/PageHero';
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
      <PageHero
        eyebrow="Interface"
        title={
          <>
            The {PRODUCT_NAME} workspace,{' '}
            <span className="text-gradient-accent">
              rendered
            </span>
          </>
        }
        description="Six views of the current build — tabs, Markdown, rich text, dark theme, sidebar, and the status bar. Previews are drawn on this page; the real thing is one download away."
      >
        <div className="mx-auto w-full max-w-md relative">
          <Search className="w-4 h-4 text-fg-subtle absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search views..."
            className="w-full rounded-full border border-line dark:border-line-dark bg-surface dark:bg-ink-900 pl-10 pr-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-fg-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </PageHero>

      {/* Category tabs */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-6 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {VIEWS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'gradient-violet text-white shadow-glow'
                  : 'border border-line dark:border-line-dark text-fg-muted hover:border-accent hover:text-fg-accent'
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
        <div className="container-site py-12">
          {filteredScreenshots.length === 0 ? (
            <div className="card-base text-center py-16 space-y-3">
              <ImageIcon className="w-8 h-8 text-fg-subtle mx-auto" />
              <h3 className="font-display text-base font-bold text-fg">No views match</h3>
              <button
                onClick={reset}
                className="btn-secondary btn-sm mx-auto"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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