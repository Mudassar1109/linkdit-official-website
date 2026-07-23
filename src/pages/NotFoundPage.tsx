import React from 'react';
import { PageId } from '../types';
import { DOMAIN_NAME } from '../data/websiteData';
import { FileQuestion, ArrowLeft, Home, Search } from 'lucide-react';

interface NotFoundProps {
  navigate: (page: PageId) => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundProps> = ({ navigate, onOpenSearch }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 font-sans">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-800 shadow-md">
        <FileQuestion className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-wider">
          Error 404 • Page Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Requested URL Does Not Exist
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The route you navigated to on <strong>https://{DOMAIN_NAME}</strong> could not be located.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={() => navigate('home')}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4 text-blue-500" />
          <span>Search Site Index</span>
        </button>
      </div>
    </div>
  );
};
