import React, { useState } from 'react';
import { ScreenshotItem } from '../types';
import { Maximize2, Keyboard, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface ScreenshotCardProps {
  screenshot: ScreenshotItem;
  onClick: (screenshot: ScreenshotItem) => void;
}

export const ScreenshotCard: React.FC<ScreenshotCardProps> = ({ screenshot, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = `/screenshots/${screenshot.filename}`;

  return (
    <div
      onClick={() => onClick(screenshot)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Window Frame Mockup */}
      <div className="bg-slate-100 dark:bg-slate-950 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 dark:bg-rose-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 dark:bg-amber-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 dark:bg-emerald-500/80"></span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 ml-1.5 truncate max-w-[160px]">
            {screenshot.filename}
          </span>
        </div>

        {screenshot.shortcut && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-1">
            <Keyboard className="w-2.5 h-2.5" />
            {screenshot.shortcut}
          </span>
        )}
      </div>

      {/* Visual Canvas or Real Screenshot */}
      <div className={`relative h-44 bg-gradient-to-br ${screenshot.previewColor} p-5 flex flex-col justify-between text-white overflow-hidden group-hover:scale-[1.01] transition-transform duration-300`}>
        {!imageError ? (
          <img
            src={imageSrc}
            alt={screenshot.title}
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : null}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs z-20">
          <span className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Click to Enlarge</span>
          </span>
        </div>

        <div className="space-y-1 relative z-10">
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-black/40 backdrop-blur-md inline-block border border-white/20">
            {screenshot.category}
          </span>
          <h4 className="font-bold text-lg leading-tight line-clamp-1 drop-shadow-sm">{screenshot.title}</h4>
        </div>

        {imageError && (
          <div className="text-xs text-white/90 line-clamp-2 bg-black/30 backdrop-blur-xs p-2 rounded-lg border border-white/10 font-mono text-[11px] relative z-10">
            {screenshot.mockContent.subtext}
          </div>
        )}
      </div>

      {/* Card Footer Details */}
      <div className="p-4 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <p className="line-clamp-1 text-slate-500 dark:text-slate-400">{screenshot.description}</p>
        <span className="shrink-0 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
          View →
        </span>
      </div>
    </div>
  );
};
