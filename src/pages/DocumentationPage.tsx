import React, { useState } from 'react';
import { PageId, DocArticle } from '../types';
import { DOC_ARTICLES, PRODUCT_NAME } from '../data/websiteData';
import { Search, ChevronRight, BookOpen } from 'lucide-react';

interface DocsProps {
  navigate: (page: PageId) => void;
}

type InlineToken = { type: 'bold' | 'code' | 'italic' | 'text'; value: string };

function inlineTokens(line: string): InlineToken[] {
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const tokens: InlineToken[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) tokens.push({ type: 'text', value: line.slice(last, m.index) });
    const s = m[0];
    if (s.startsWith('**') && s.endsWith('**')) tokens.push({ type: 'bold', value: s.slice(2, -2) });
    else if (s.startsWith('`') && s.endsWith('`')) tokens.push({ type: 'code', value: s.slice(1, -1) });
    else if (s.startsWith('*') && s.endsWith('*')) tokens.push({ type: 'italic', value: s.slice(1, -1) });
    else tokens.push({ type: 'text', value: s });
    last = m.index + s.length;
  }
  if (last < line.length) tokens.push({ type: 'text', value: line.slice(last) });
  return tokens;
}

const Inline: React.FC<{ line: string }> = ({ line }) => (
  <>
    {inlineTokens(line).map((t, i) => {
      switch (t.type) {
        case 'bold':
          return (
            <strong key={i} className="font-semibold text-ink dark:text-paper">
              {t.value}
            </strong>
          );
        case 'code':
          return (
            <code key={i} className="rounded bg-accent-soft dark:bg-ink-850 px-1.5 py-0.5 font-mono text-[0.85em] text-fg-accent">
              {t.value}
            </code>
          );
        case 'italic':
          return (
            <em key={i} className="italic text-ink dark:text-paper">
              {t.value}
            </em>
          );
        default:
          return <span key={i}>{t.value}</span>;
      }
    })}
  </>
);

interface LineProps {
  line: string;
  isLast: boolean;
}

const ContentLine: React.FC<LineProps> = ({ line, isLast }) => {
  const trimmed = line.trim();
  if (trimmed === '') return <div className="h-3" />;
  if (trimmed.startsWith('# ')) {
    return (
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-paper pt-2 pb-1">
        <Inline line={trimmed.slice(2)} />
      </h1>
    );
  }
  if (trimmed.startsWith('## ')) {
    return (
      <h2 className="text-lg font-semibold text-ink dark:text-paper pt-5 pb-1">
        <Inline line={trimmed.slice(3)} />
      </h2>
    );
  }
  if (trimmed.startsWith('- ')) {
    return (
      <li className="flex items-start gap-2.5 text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
        <span className="mt-[7px] w-1.5 h-1.5 shrink-0 rounded-full bg-accent" />
        <span>
          <Inline line={trimmed.slice(2)} />
        </span>
      </li>
    );
  }
  if (/^\d+\.\s/.test(trimmed)) {
    const num = trimmed.match(/^(\d+)\.\s/)![1];
    return (
      <li className="flex items-start gap-2.5 text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
        <span className="mt-px shrink-0 font-mono text-xs font-semibold text-fg-accent">
          {num}.
        </span>
        <span>
          <Inline line={trimmed.replace(/^\d+\.\s/, '')} />
        </span>
      </li>
    );
  }
  return (
    <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
      <Inline line={trimmed} />
    </p>
  );
};

export const DocumentationPage: React.FC<DocsProps> = ({ navigate }) => {
  const [activeArticle, setActiveArticle] = useState<DocArticle>(DOC_ARTICLES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = DOC_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border-t border-line dark:border-line-dark">
      <div className="container-site py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-5 lg:sticky lg:top-32 lg:self-start">
            <div className="space-y-3">
              <span className="eyebrow text-fg-accent block">Documentation</span>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink dark:text-paper">
                Guides &amp; Reference
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 text-ink-mute absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search docs..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-surface dark:bg-ink-900 border border-line dark:border-line-dark text-xs text-ink dark:text-paper placeholder:text-ink-mute focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            <nav className="space-y-1.5">
              {filteredArticles.map((article) => {
                const isActive = activeArticle.id === article.id;
                return (
                  <button
                    key={article.id}
                    onClick={() => setActiveArticle(article)}
                    className={`w-full text-left p-3.5 rounded-2xl text-xs font-medium transition-colors flex items-center justify-between gap-2 border ${
                      isActive
                        ? 'bg-accent-soft dark:bg-accent/20 text-fg-accent border-accent/40 font-semibold shadow-xs'
                        : 'text-ink-soft dark:text-paper/60 border-transparent hover:bg-paper-2 dark:hover:bg-ink-850'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono text-ink-mute dark:text-paper/40">
                        {article.categoryName}
                      </span>
                      <span className="block truncate">{article.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Article */}
          <main className="lg:col-span-3 card-base overflow-hidden">
            <div className="relative border-b border-line dark:border-line-dark p-6 sm:p-10 pb-5 space-y-2">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(60%_100%_at_20%_0%,rgba(124,58,237,0.07),transparent_75%)]"
              />
              <div className="relative flex flex-wrap items-center gap-2.5 text-xs font-mono text-ink-mute dark:text-paper/45">
                <span className="badge-accent">{activeArticle.categoryName}</span>
                <span>Updated {activeArticle.lastUpdated}</span>
                <span className="text-line-strong dark:text-line-dark">•</span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {activeArticle.readTime}
                </span>
              </div>
              <p className="relative text-sm text-ink-soft dark:text-paper/60">{activeArticle.description}</p>
            </div>

            <div className="p-6 sm:p-10 space-y-0.5">
              {activeArticle.content
                .split('\n')
                .map((line, i) => (
                  <ContentLine key={i} line={line} isLast={i === activeArticle.content.split('\n').length - 1} />
                ))}
            </div>

            <div className="border-t border-line dark:border-line-dark p-6 sm:p-10 pt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-ink-mute dark:text-paper/45">
                {PRODUCT_NAME} v0.1.2 · Docs updated {activeArticle.lastUpdated}
              </p>
              <button
                onClick={() => navigate('support')}
                className="btn-ghost btn-sm text-fg-accent hover:bg-accent-soft dark:text-violet-300"
              >
                Need help? Visit Support →
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};