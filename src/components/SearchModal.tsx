import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { SCREENSHOTS, DOC_ARTICLES } from '../data/websiteData';
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

  const q = query.toLowerCase();

  const filteredScreenshots = SCREENSHOTS.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
  );

  const filteredDocs = DOC_ARTICLES.filter(
    (d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
  );

  const pages: { id: PageId; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'products', title: 'The Product', desc: 'What LinkDit Pad is', icon: <FileText className="w-4 h-4" /> },
    { id: 'download', title: 'Download LinkDit Pad', desc: 'Windows setup (.exe) — v0.1.2', icon: <Download className="w-4 h-4" /> },
    { id: 'screenshots', title: 'Interface Gallery', desc: 'Rendered previews of the workspace', icon: <Image className="w-4 h-4" /> },
    { id: 'docs', title: 'Documentation & Guides', desc: 'Quick start, Markdown, rich text, themes', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'features', title: 'All Features', desc: 'Editing, files, themes, privacy', icon: <Layers className="w-4 h-4" /> },
  ];

  const filteredPages = pages.filter(
    (p) => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-ink-950/70 dark:bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      <div className="w-full max-w-2xl bg-surface dark:bg-ink-850 shadow-2xl border border-line dark:border-line-dark overflow-hidden">
        {/* Input */}
        <div className="p-4 border-b border-line dark:border-line-dark flex items-center gap-3">
          <Search className="w-5 h-5 text-ink-mute shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, docs, interface views..."
            className="w-full bg-transparent text-ink dark:text-paper placeholder:text-ink-mute dark:placeholder:text-paper/40 text-sm focus:outline-none font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-md text-ink-mute hover:text-ink dark:hover:text-paper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {filteredPages.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-ink-mute dark:text-paper/45 block mb-2">
                Pages
              </span>
              <div className="space-y-1">
                {filteredPages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigate(p.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-paper-2 dark:hover:bg-ink-850 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-paper-2 dark:bg-ink-850 text-accent-deep dark:text-blue-300">
                        {p.icon}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-ink dark:text-paper">{p.title}</h5>
                        <p className="text-xs text-ink-mute dark:text-paper/50">{p.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-mute group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredScreenshots.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-ink-mute dark:text-paper/45 block mb-2">
                Interface views ({filteredScreenshots.length})
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
                    className="p-2.5 rounded-md border border-line dark:border-line-dark hover:border-accent bg-paper-2/40 dark:bg-ink-950/40 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-soft dark:bg-accent/15 text-accent-deep dark:text-blue-300">
                        {s.id}
                      </span>
                      <span className="text-xs font-semibold text-ink dark:text-paper truncate">{s.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredDocs.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-ink-mute dark:text-paper/45 block mb-2">
                Documentation
              </span>
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      navigate('docs');
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-md hover:bg-paper-2 dark:hover:bg-ink-850 transition-colors text-left"
                  >
                    <h5 className="text-sm font-semibold text-ink dark:text-paper">{doc.title}</h5>
                    <p className="text-xs text-ink-mute dark:text-paper/50 line-clamp-1">{doc.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-paper-2/60 dark:bg-ink-950/40 border-t border-line dark:border-line-dark text-xs text-ink-mute dark:text-paper/40 flex items-center justify-between font-mono">
          <span>Site search · Ctrl+K</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};