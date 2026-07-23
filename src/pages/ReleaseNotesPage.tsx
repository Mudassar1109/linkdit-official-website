import React from 'react';
import { PageId } from '../types';
import { PRODUCT_NAME, DOMAIN_NAME } from '../data/websiteData';
import { Download, Sparkles, Shield, CheckCircle, FileText, ArrowRight } from 'lucide-react';

interface ReleaseProps {
  navigate: (page: PageId) => void;
}

export const ReleaseNotesPage: React.FC<ReleaseProps> = ({ navigate }) => {
  return (
    <div className="space-y-12 pb-16 font-sans">
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800 font-semibold inline-block">
            Official Release Announcement
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {PRODUCT_NAME} v1.0.0 Release Notes
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Detailed breakdown of our v1.0.0 milestone release, installer formats, performance benchmarks, and local security guarantees.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Release Date: July 22, 2026 • Build Hash: #4e82a9
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              v1.0.0 Production Release Overview
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We are excited to launch the first official commercial release of <strong>{PRODUCT_NAME}</strong>. This release delivers a lightning-fast, distraction-free markdown and text editor designed specifically for users who require sub-120ms launch speed and total offline privacy.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Key Features in v1.0.0</span>
            </h3>

            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Sub-120ms Cold Startup Engine</strong>: Optimized memory footprint starting under 25MB RAM.</li>
              <li><strong>GFM Markdown Live Split View</strong>: Dual preview mode rendering GFM tables, task lists, and syntax blocks.</li>
              <li><strong>21 UI Gallery Views</strong>: Fully customizable OLED Midnight Dark and Archival Light themes.</li>
              <li><strong>Native Windows Installers</strong>: Available as standard Setup (.exe), Enterprise MSI, and MSIX packages.</li>
              <li><strong>100% Local File Storage</strong>: Zero telemetry, zero analytics tracking, and no cloud logins required.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => navigate('download')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download v1.0.0 Installers</span>
            </button>

            <button
              onClick={() => navigate('changelog')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
            >
              <span>View Full Version History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
