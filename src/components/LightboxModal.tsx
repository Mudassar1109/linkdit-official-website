import React, { useState, useEffect } from 'react';
import { ScreenshotItem } from '../types';
import { X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface LightboxProps {
  screenshot: ScreenshotItem | null;
  screenshotsList: ScreenshotItem[];
  onClose: () => void;
  onNavigate: (screenshot: ScreenshotItem) => void;
}

export const LightboxModal: React.FC<LightboxProps> = ({
  screenshot,
  screenshotsList,
  onClose,
  onNavigate,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    setZoomLevel(1);
  }, [screenshot?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!screenshot) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenshot, screenshotsList]);

  if (!screenshot) return null;

  const currentIndex = screenshotsList.findIndex((item) => item.id === screenshot.id);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + screenshotsList.length) % screenshotsList.length;
    onNavigate(screenshotsList[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % screenshotsList.length;
    onNavigate(screenshotsList[nextIndex]);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={screenshot.title}
    >
      <div className="w-full max-w-4xl max-h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between text-paper pb-3 gap-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-accent/20 text-blue-300">
              {screenshot.filename}
            </span>
            <h3 className="font-bold text-lg leading-tight">{screenshot.title}</h3>
            <span className="text-xs text-paper/55">
              {currentIndex + 1} of {screenshotsList.length} · {screenshot.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-md bg-ink-900 hover:bg-ink-850 text-paper/80 transition-colors"
              aria-label="Previous scene"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-md bg-ink-900 hover:bg-ink-850 text-paper/80 transition-colors"
              aria-label="Next scene"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md bg-ink-900 hover:bg-ink-850 text-paper/80 transition-colors"
              aria-label="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scene */}
        <div className="relative border border-line-dark overflow-hidden rounded-lg bg-ink-900/60">
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-md bg-ink-850/90 hover:bg-ink-850 text-paper/80"
            aria-label="Previous scene"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Full-size rendered scene */}
          <div className="p-6 sm:p-10 text-left">
            <div className={`${screenshot.previewColor} rounded-lg border border-line dark:border-line-dark shadow-xl overflow-hidden`}>
              <div className="flex items-center justify-between bg-paper-2/80 dark:bg-ink-900 px-4 py-2.5 border-b border-line dark:border-line-dark">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-xs text-ink-soft dark:text-paper/55">LinkDit Pad — {screenshot.filename}</span>
                </div>
              </div>
              <div className="flex min-h-[300px]">
                <aside className="hidden sm:block w-44 shrink-0 border-r border-line dark:border-line-dark bg-paper-2/40 dark:bg-ink-900/30 p-4 space-y-2.5 text-xs">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute dark:text-paper/40 pb-1">
                    Recent
                  </div>
                  <div className="flex items-center gap-2 rounded bg-accent-soft dark:bg-accent/15 px-2 py-1.5 font-medium text-accent-deep dark:text-blue-300">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate">{screenshot.filename}</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-ink-soft dark:text-paper/55">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate">notes.md</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-ink-soft dark:text-paper/55">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate">journal.txt</span>
                  </div>
                </aside>
                <div className="flex-1 p-6 sm:p-8 space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-paper-2 dark:bg-ink-900 text-accent-deep dark:text-blue-300 shrink-0">
                      <FileText className="w-5 h-5" />
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-lg sm:text-xl font-bold text-ink dark:text-paper">
                        {screenshot.mockContent.title}
                      </h4>
                      <p className="text-sm text-ink-soft dark:text-paper/65">{screenshot.mockContent.subtext}</p>
                    </div>
                  </div>
                  <div className="border-t border-line dark:border-line-dark pt-4 space-y-2">
                    {screenshot.mockContent.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-3 font-mono text-xs text-ink-soft dark:text-paper/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-paper-2/60 dark:bg-ink-900/50 px-4 py-2 border-t border-line dark:border-line-dark text-[11px] font-mono text-ink-mute dark:text-paper/45 flex items-center justify-between">
                <span>UTF-8 · {screenshot.category}</span>
                <span className="text-emerald-600 dark:text-emerald-400">Local</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-md bg-ink-850/90 hover:bg-ink-850 text-paper/80"
            aria-label="Next scene"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Caption */}
        <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-paper/60">
          <p className="leading-relaxed">{screenshot.description}</p>
          <div className="flex items-center gap-3 shrink-0 font-mono text-paper/45 text-[10px]">
            <span>← → : navigate</span>
            <span>Esc : close</span>
          </div>
        </div>
      </div>
    </div>
  );
};