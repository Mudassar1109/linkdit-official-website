import React, { useState } from 'react';
import { generateProjectZip } from '../utils/zipExporter';
import { Archive, Download, CheckCircle, Loader2, X, FileCode, Shield } from 'lucide-react';
import { DOMAIN_NAME } from '../data/websiteData';

interface ZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipExportModal: React.FC<ZipModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const blob = await generateProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LinkDit-Official-Website-Source-${DOMAIN_NAME}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setCompleted(true);
    } catch (err) {
      console.error('Failed to export ZIP package:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Download Complete Project ZIP
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official website codebase ready for Vercel deployment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            This option packages the full production-ready codebase for <strong>{DOMAIN_NAME}</strong>, including all 21 screenshot specs, download cards, documentation hub, changelog, and legal policies.
          </p>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Framework:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">React 19 / Vite / Tailwind v4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Custom Domain:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">https://{DOMAIN_NAME}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Vercel Deployment Ready:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Yes (vercel.json)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Bundling ZIP...</span>
              </>
            ) : completed ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Downloaded ZIP!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Source ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
