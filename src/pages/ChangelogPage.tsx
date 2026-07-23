import React from 'react';
import { PageId } from '../types';
import { CHANGELOG_ITEMS, PRODUCT_NAME } from '../data/websiteData';
import { Tag, CheckCircle, Sparkles, Shield, Wrench, Bug } from 'lucide-react';

interface ChangelogProps {
  navigate: (page: PageId) => void;
}

export const ChangelogPage: React.FC<ChangelogProps> = ({ navigate }) => {
  return (
    <div className="space-y-12 pb-16 font-sans">
      <section className="bg-slate-100 dark:bg-slate-900 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Version Timeline & History
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            {PRODUCT_NAME} Changelog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Track all updates, new features, optimizations, and security patches across release versions.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {CHANGELOG_ITEMS.map((item, idx) => (
          <div key={idx} className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
            {/* Dot indicator */}
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-950"></span>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                v{item.version}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                {item.date}
              </span>
              {item.badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  {item.badge}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{item.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{item.summary}</p>

            {/* Highlights */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Added Features
                </span>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {item.featuresAdded.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Improvements & Fixes
                </span>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {item.improvements.map((imp, iIdx) => (
                    <li key={iIdx} className="flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                  {item.bugFixes.map((fix, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2">
                      <Bug className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
