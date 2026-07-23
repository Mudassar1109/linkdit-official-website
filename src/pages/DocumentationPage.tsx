import React, { useState } from 'react';
import { PageId, DocArticle } from '../types';
import { DOC_ARTICLES, PRODUCT_NAME } from '../data/websiteData';
import {
  BookOpen,
  Search,
  Check,
  Copy,
  ChevronRight,
  FileCode,
  Sliders,
  Keyboard,
  HelpCircle,
} from 'lucide-react';

interface DocsProps {
  navigate: (page: PageId) => void;
}

export const DocumentationPage: React.FC<DocsProps> = ({ navigate }) => {
  const [activeArticle, setActiveArticle] = useState<DocArticle>(DOC_ARTICLES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredArticles = DOC_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Documentation Hub
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              User Manuals
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search docs..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <nav className="space-y-1">
            {filteredArticles.map((article) => {
              const isActive = activeArticle.id === article.id;
              return (
                <button
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {article.categoryName}
                    </span>
                    <span className="line-clamp-1">{article.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Doc Content Viewport */}
        <main className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                {activeArticle.categoryName}
              </span>
              <span>Updated: {activeArticle.lastUpdated}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {activeArticle.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {activeArticle.description}
            </p>
          </div>

          {/* Article Markdown Content */}
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200 font-sans">
            {activeArticle.content}
          </div>

          {/* Code Snippet Box if available */}
          {activeArticle.codeSnippet && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Command / Code Example ({activeArticle.language})</span>
                <button
                  onClick={() => handleCopyCode(activeArticle.codeSnippet!)}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied Code' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <code>{activeArticle.codeSnippet}</code>
              </pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
