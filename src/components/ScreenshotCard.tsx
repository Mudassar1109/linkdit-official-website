import React from 'react';
import { ScreenshotItem } from '../types';
import { Maximize2, FileText } from 'lucide-react';

interface ScreenshotCardProps {
  screenshot: ScreenshotItem;
  onClick: (screenshot: ScreenshotItem) => void;
}

export const ScreenshotCard: React.FC<ScreenshotCardProps> = ({ screenshot, onClick }) => {
  return (
    <button
      onClick={() => onClick(screenshot)}
      className="group text-left border border-line dark:border-line-dark bg-surface dark:bg-ink-850 overflow-hidden hover:border-line-strong dark:hover:border-ink-800 transition-colors focus-visible:outline-none"
      aria-label={`View "${screenshot.title}"`}
    >
      {/* Window bar */}
      <div className="flex items-center justify-between border-b border-line dark:border-line-dark bg-paper-2/70 dark:bg-ink-900/70 px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 font-mono text-[10px] text-ink-mute dark:text-paper/45 truncate">
            {screenshot.filename}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-mute dark:text-paper/40">
          {screenshot.category}
        </span>
      </div>

      {/* Rendered scene */}
      <div className={`${screenshot.previewColor} p-5 min-h-[190px] flex flex-col justify-between gap-4`}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded bg-paper-2 dark:bg-ink-900 text-accent-deep dark:text-blue-300 shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </span>
          <div className="space-y-1">
            <h3 className="text-sm font-bold leading-snug text-ink dark:text-paper">{screenshot.mockContent.title}</h3>
            <p className="text-xs text-ink-soft dark:text-paper/60 leading-relaxed">{screenshot.mockContent.subtext}</p>
          </div>
        </div>
        <ul className="space-y-1.5">
          {screenshot.mockContent.details.map((detail, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 font-mono text-[10px] text-ink-soft dark:text-paper/55"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-line-strong dark:bg-line-dark" />
              {detail}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-line dark:border-line-dark px-3.5 py-3">
        <p className="text-xs text-ink-soft dark:text-paper/60 line-clamp-2 leading-relaxed">{screenshot.description}</p>
        <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-accent dark:text-blue-300">
          View
          <Maximize2 className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
};