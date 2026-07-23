import React, { useState, useEffect } from 'react';
import { ScreenshotItem } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Info,
  Keyboard,
  Layers,
} from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between text-white border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/60 font-semibold">
            {screenshot.filename}
          </span>
          <div>
            <h3 className="font-bold text-base sm:text-lg leading-tight">{screenshot.title}</h3>
            <span className="text-xs text-slate-400">
              {currentIndex + 1} of {screenshotsList.length} • Category: {screenshot.category}
            </span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 w-12 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800/60 ml-2 transition-colors"
            title="Close Lightbox (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-2xl">
        {/* Previous Image Button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 z-20 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white shadow-xl transition-all hover:scale-110"
          title="Previous Screenshot (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image / Canvas Mock Container */}
        <div
          className="transition-transform duration-200 max-w-full max-h-full overflow-auto flex items-center justify-center p-4"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* We render a pristine, full-fidelity UI frame simulating the actual screenshot slot */}
          <div className="w-[850px] max-w-full rounded-xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-sans text-left">
            {/* Window Chrome */}
            <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  LinkDit Pad - {screenshot.filename}
                </span>
              </div>
              {screenshot.shortcut && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-800">
                  <Keyboard className="w-3 h-3" />
                  <span>{screenshot.shortcut}</span>
                </div>
              )}
            </div>

            {/* Inner Content Display */}
            <div className={`p-8 bg-gradient-to-br ${screenshot.previewColor} text-white min-h-[360px] flex flex-col justify-between`}>
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-mono tracking-wider border border-white/20">
                  PUBLIC SCREENSHOT SLOT #{screenshot.id.split('_')[0]}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {screenshot.mockContent.title}
                </h2>
                <p className="text-sm sm:text-base text-white/80 max-w-lg">
                  {screenshot.mockContent.subtext}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {screenshot.mockContent.details.map((detail, idx) => (
                  <div key={idx} className="bg-black/30 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs">
                    <span className="text-white/60 font-mono block mb-1">Feature 0{idx + 1}</span>
                    <span className="font-medium text-white">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Image Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 z-20 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white shadow-xl transition-all hover:scale-110"
          title="Next Screenshot (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Info Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 gap-2">
        <p className="line-clamp-1">{screenshot.description}</p>
        <div className="flex items-center gap-3 shrink-0">
          <kbd className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[10px]">
            ← → Navigate
          </kbd>
          <kbd className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[10px]">
            Esc Close
          </kbd>
        </div>
      </div>
    </div>
  );
};
