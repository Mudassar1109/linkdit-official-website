import React, { useState } from 'react';
import { PageId, ScreenshotItem } from '../types';
import { SCREENSHOTS, PRODUCT_NAME } from '../data/websiteData';
import { ScreenshotCard } from '../components/ScreenshotCard';
import { LightboxModal } from '../components/LightboxModal';
import { Search, Filter, Layers, Maximize2, Image as ImageIcon } from 'lucide-react';

interface ScreenshotsPageProps {
  navigate: (page: PageId) => void;
  selectedIdFromQuery?: string | null;
}

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

  const categories = ['All', 'Editor', 'Themes', 'Customization', 'Tools', 'Interface'];

  const filteredScreenshots = SCREENSHOTS.filter((s) => {
    if (activeCategory !== 'All' && s.category !== activeCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.filename.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Header Banner */}
      <section className="bg-slate-100 dark:bg-slate-900 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Visual Experience & Workspace Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            21 High-Resolution Screenshots
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Explore every view of {PRODUCT_NAME} — from the core editor and OLED midnight dark theme to search palettes and markdown split preview.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 21 screenshots by name or shortcut..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat} {cat === 'All' ? `(${SCREENSHOTS.length})` : ''}
            </button>
          ))}
        </div>
      </section>

      {/* Screenshots Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredScreenshots.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No Screenshots Match Search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try clearing filters or searching for another keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScreenshots.map((item) => (
              <ScreenshotCard
                key={item.id}
                screenshot={item}
                onClick={(s) => setActiveLightbox(s)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        screenshot={activeLightbox}
        screenshotsList={filteredScreenshots}
        onClose={() => setActiveLightbox(null)}
        onNavigate={(item) => setActiveLightbox(item)}
      />
    </div>
  );
};
