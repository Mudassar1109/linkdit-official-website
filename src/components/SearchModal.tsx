import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { SCREENSHOTS, FEATURE_CATEGORIES, DOC_ARTICLES } from '../data/websiteData';
import { Search, X, ArrowRight, FileText, Download, Image, BookOpen, Layers } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (page: PageId) => void;
  onSelectScreenshot?: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  navigate,
  onSelectScreenshot,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredScreenshots = SCREENSHOTS.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase()) ||
      s.filename.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = DOC_ARTICLES.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase())
  );

  const pages: { id: PageId; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'products', title: 'LinkDit Pad Product Overview', desc: 'Core editor specs & capabilities', icon: <FileText className="w-4 h-4 text-blue-500" /> },
    { id: 'download', title: 'Download LinkDit Pad', desc: 'Windows setup (.exe, .msi, .msix)', icon: <Download className="w-4 h-4 text-emerald-500" /> },
    { id: 'screenshots', title: 'Screenshots Gallery', desc: 'Explore all 21 UI views', icon: <Image className="w-4 h-4 text-purple-500" /> },
    { id: 'docs', title: 'Documentation & Guides', desc: 'User manual and hotkey references', icon: <BookOpen className="w-4 h-4 text-amber-500" /> },
    { id: 'features', title: 'All Features Matrix', desc: 'Text editing, themes, privacy & offline', icon: <Layers className="w-4 h-4 text-indigo-500" /> },
  ];

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, screenshots, documentation, feature matrix..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Quick Pages */}
          {filteredPages.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                Main Pages
              </span>
              <div className="space-y-1">
                {filteredPages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigate(p.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                        {p.icon}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {p.title}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{p.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots Matches */}
          {filteredScreenshots.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                Screenshots ({filteredScreenshots.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredScreenshots.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      navigate('screenshots');
                      if (onSelectScreenshot) onSelectScreenshot(s.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-950/50 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {s.filename}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {s.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documentation Matches */}
          {filteredDocs.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                Documentation Articles
              </span>
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      navigate('docs');
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {doc.title}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {doc.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between font-mono">
          <span>Search index powered by LinkDit Pad engine</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
