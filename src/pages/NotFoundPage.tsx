import React from 'react';
import { PageId } from '../types';
import { FileQuestion, Home, Search } from 'lucide-react';

interface NotFoundProps {
  navigate: (page: PageId) => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundProps> = ({ navigate, onOpenSearch }) => {
  return (
    <div className="container-narrow py-24 sm:py-32 text-center space-y-6 font-sans">
      <div className="w-14 h-14 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-ink-850 text-fg-accent flex items-center justify-center mx-auto">
        <FileQuestion className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/45 block">
          404 · Page not found
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-ink dark:text-paper">
          This page doesn't exist
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper/60 max-w-md mx-auto">
          The address you opened is not part of this site. Try the homepage or search instead.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('home')}
          className="btn-primary btn-sm w-full sm:w-auto"
        >
          <Home className="w-4 h-4" />
          Return home
        </button>
        <button
          onClick={onOpenSearch}
          className="btn-secondary btn-sm w-full sm:w-auto"
        >
          <Search className="w-4 h-4" />
          Search the site
        </button>
      </div>
    </div>
  );
};