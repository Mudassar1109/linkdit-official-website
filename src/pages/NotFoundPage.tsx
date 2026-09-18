import React from 'react';
import { PageId } from '../types';
import { FileQuestion, Home, Search } from 'lucide-react';

interface NotFoundProps {
  navigate: (page: PageId) => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundProps> = ({ navigate, onOpenSearch }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center space-y-6 font-sans">
      <div className="w-14 h-14 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-ink-850 text-accent-deep dark:text-blue-300 flex items-center justify-center mx-auto">
        <FileQuestion className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/45 block">
          404 · Page not found
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-paper">
          This page doesn't exist
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper/60 max-w-md mx-auto">
          The address you opened is not part of this site. Try the homepage or search instead.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('home')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-2.5 text-xs font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
        >
          <Home className="w-4 h-4" />
          Return home
        </button>
        <button
          onClick={onOpenSearch}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-line-strong dark:border-line-dark px-5 py-2.5 text-xs font-semibold text-ink-soft dark:text-paper/65 hover:border-accent transition-colors"
        >
          <Search className="w-4 h-4" />
          Search the site
        </button>
      </div>
    </div>
  );
};