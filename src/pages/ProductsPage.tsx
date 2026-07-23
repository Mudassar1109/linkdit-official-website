import React from 'react';
import { PageId } from '../types';
import { PRODUCT_NAME, TAGLINE, DOMAIN_NAME } from '../data/websiteData';
import {
  FileText,
  Zap,
  Shield,
  WifiOff,
  Check,
  X,
  Code,
  Layers,
  Sparkles,
  Download,
  ArrowRight,
  Terminal,
  Cpu,
} from 'lucide-react';

interface ProductsPageProps {
  navigate: (page: PageId) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ navigate }) => {
  const supportedFormats = [
    { ext: '.md', name: 'Markdown Document', desc: 'Full GFM preview & table formatting' },
    { ext: '.txt', name: 'Plain Text File', desc: 'Pure UTF-8 plaintext writing' },
    { ext: '.json', name: 'JSON Configuration', desc: 'Syntax highlighting & format checking' },
    { ext: '.js / .ts', name: 'JavaScript & TypeScript', desc: 'Code blocks with auto-indents' },
    { ext: '.py', name: 'Python Scripts', desc: 'Clean indent guides & syntax colors' },
    { ext: '.sql', name: 'SQL Query Scripts', desc: 'Keyword highlighting & schema notes' },
    { ext: '.yaml / .yml', name: 'YAML Specs', desc: 'Config file formatting' },
    { ext: '.html / .css', name: 'HTML & CSS Web Files', desc: 'Structure & style preview' },
  ];

  return (
    <div className="space-y-20 pb-16 font-sans">
      {/* Product Hero Header */}
      <section className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold inline-block">
            Official Product Overview
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {PRODUCT_NAME}
          </h1>
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 font-mono">
            {TAGLINE}
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Engineered from the ground up for writers, developers, students, and productivity enthusiasts who value zero latency, local file control, and distraction-free writing.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => navigate('download')}
              className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Get LinkDit Pad v1.0</span>
            </button>
            <button
              onClick={() => navigate('screenshots')}
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span>View Screenshots</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 CORE PRODUCT PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Built on Four Core Pillars
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Designed to solve the lag, bloat, and forced cloud dependencies of modern software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Zap className="w-8 h-8 text-blue-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Sub-120ms Fast</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Launches instantly when you open a file from Windows File Explorer or Terminal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Shield className="w-8 h-8 text-emerald-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">100% Private</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero telemetry, no user tracking, no forced login accounts. Your documents stay on disk.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <WifiOff className="w-8 h-8 text-amber-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Fully Offline</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Requires no internet connection. Perfectly reliable on airplanes or air-gapped systems.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Modern Aesthetic</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              OLED midnight dark mode, paper cream light mode, and customizable typography weights.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORTED FORMATS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Supported File Formats
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            LinkDit Pad handles all standard plain text formats natively without proprietary locks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportedFormats.map((item, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 inline-block border border-blue-200 dark:border-blue-800">
                {item.ext}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON MATRIX vs OTHER EDITORS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How LinkDit Pad Compares
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            See how LinkDit Pad balances pure speed with rich markdown features.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-md font-sans">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-4">Feature / Metric</th>
                <th className="p-4 text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30">LinkDit Pad</th>
                <th className="p-4">Standard Notepad</th>
                <th className="p-4">VS Code / IDE</th>
                <th className="p-4">Cloud Docs (Notion)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-4 font-semibold">Startup Latency</td>
                <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-blue-50/30 dark:bg-blue-950/20">&lt; 120ms</td>
                <td className="p-4 font-mono">~ 100ms</td>
                <td className="p-4 font-mono text-rose-500">1,500ms+</td>
                <td className="p-4 font-mono text-rose-500">3,000ms+</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">RAM Usage</td>
                <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-blue-50/30 dark:bg-blue-950/20">~ 24 MB</td>
                <td className="p-4 font-mono">~ 15 MB</td>
                <td className="p-4 font-mono text-rose-500">300 MB+</td>
                <td className="p-4 font-mono text-rose-500">500 MB+</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">GFM Markdown Live Preview</td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold bg-blue-50/30 dark:bg-blue-950/20"><Check className="w-4 h-4" /></td>
                <td className="p-4 text-slate-400"><X className="w-4 h-4" /></td>
                <td className="p-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                <td className="p-4 text-emerald-600"><Check className="w-4 h-4" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Zero Telemetry Privacy</td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold bg-blue-50/30 dark:bg-blue-950/20"><Check className="w-4 h-4" /></td>
                <td className="p-4 text-slate-400"><X className="w-4 h-4" /></td>
                <td className="p-4 text-slate-400"><X className="w-4 h-4" /></td>
                <td className="p-4 text-slate-400"><X className="w-4 h-4" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">No Cloud Login Required</td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold bg-blue-50/30 dark:bg-blue-950/20"><Check className="w-4 h-4" /></td>
                <td className="p-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                <td className="p-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                <td className="p-4 text-slate-400"><X className="w-4 h-4" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
