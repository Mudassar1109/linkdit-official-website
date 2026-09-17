import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageId } from '../types';
import { SCREENSHOTS, DOWNLOAD_OPTIONS, FAQS, DOMAIN_NAME, PRODUCT_NAME, TAGLINE } from '../data/websiteData';
import { ScreenshotCard } from '../components/ScreenshotCard';
import {
  FileText,
  Download,
  Zap,
  Shield,
  WifiOff,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Eye,
  Sliders,
  ChevronDown,
  Layers,
  Code,
  Globe,
  Terminal,
  Play,
  Mouse,
  ArrowDown,
} from 'lucide-react';

interface HomePageProps {
  navigate: (page: PageId) => void;
  onOpenScreenshot: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenScreenshot }) => {
  // Interactive Live Demo State
  const [demoText, setDemoText] = useState(`# Launching LinkDit Pad

LinkDit Pad is the minimalist markdown tool for maximum productivity.

- No Cloud sync needed. 100% Local Files.
- Built with sub-120ms launch speed in mind.
- Export to PDF, HTML, or Markdown with GFM support.

\`\`\`typescript
// Pure local file system operations
import { saveFile } from './fs';
saveFile('notes.md', 'Written in LinkDit Pad');
\`\`\``);

  const [demoTab, setDemoTab] = useState<'editor' | 'preview'>('editor');
  const [demoTheme, setDemoTheme] = useState<'dark' | 'light'>('light');

  const wordCount = demoText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-20 pb-16 font-sans relative overflow-hidden">
      {/* Decorative Animated Background Ambient Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-purple-500/20 blur-[130px] rounded-full -z-10 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[400px] right-0 w-[450px] h-[450px] bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-blue-500/15 blur-[140px] rounded-full -z-10 pointer-events-none"
      />

      {/* Floating Particles in Hero Background */}
      <div className="absolute top-12 left-0 right-0 h-[450px] overflow-hidden -z-10 pointer-events-none">
        {[
          { top: '15%', left: '18%', size: 'w-1.5 h-1.5', delay: 0 },
          { top: '35%', left: '78%', size: 'w-2 h-2', delay: 1 },
          { top: '65%', left: '25%', size: 'w-1 h-1', delay: 2 },
          { top: '25%', left: '85%', size: 'w-1.5 h-1.5', delay: 1.5 },
          { top: '75%', left: '70%', size: 'w-2 h-2', delay: 2.5 },
        ].map((pt, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [0, -18, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{ duration: 4 + idx, repeat: Infinity, ease: 'easeInOut', delay: pt.delay }}
            className={`absolute rounded-full bg-blue-400 dark:bg-blue-300 shadow-xs ${pt.size}`}
            style={{ top: pt.top, left: pt.left }}
          />
        ))}
      </div>

      {/* HERO SECTION */}
      <section className="pt-12 md:pt-16 pb-8 text-center max-w-4xl mx-auto px-4 sm:px-6 relative">
        {/* Entrance Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Release Badge */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('download')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:border-blue-400/80 hover:shadow-md transition-all cursor-pointer group"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span>LinkDit Pad v0.1.1 Commercial Release</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </motion.div>

          {/* Hero Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-slate-950 dark:text-white leading-[1.08] font-sans">
            Write Better. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 dark:from-white dark:via-blue-200 dark:to-slate-400 bg-clip-text text-transparent italic font-serif">
              Create Faster.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            The ultra-fast, distraction-free markdown editor built for writers, developers, and thinkers. Local-first. Zero telemetry. Completely yours.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('download')}
              className="w-full sm:w-auto bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-7 py-3.5 rounded-full text-sm font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4" />
              <span>Download LinkDit Pad v0.1.1</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('features')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Explore Feature Matrix
            </motion.button>
          </div>

          {/* Animated Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-10 flex flex-col items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-mono"
          >
            <span>Scroll to preview workspace</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* PRODUCT MOCKUP PREVIEW (INTERACTIVE EDITOR) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative"
        >
          {/* Subtle Glow Aura behind editor frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-70 pointer-events-none" />

          {/* Window Container */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-200/90 dark:border-slate-800/90 p-1 flex flex-col min-h-[380px] overflow-hidden"
          >
            {/* Window Titlebar */}
            <div className="bg-slate-100/80 dark:bg-slate-950/80 h-10 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:opacity-100 transition-opacity"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:opacity-100 transition-opacity"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:opacity-100 transition-opacity"></span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 ml-3 truncate">
                  LinkDit Pad — Untitled.md
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-slate-200/70 dark:bg-slate-800/80 p-0.5 rounded-full text-[11px] font-medium border border-slate-300/40 dark:border-slate-700/40">
                  <button
                    onClick={() => setDemoTab('editor')}
                    className={`px-3 py-0.5 rounded-full transition-all ${
                      demoTab === 'editor'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => setDemoTab('preview')}
                    className={`px-3 py-0.5 rounded-full transition-all ${
                      demoTab === 'preview'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Preview
                  </button>
                </div>

                <button
                  onClick={() => setDemoTheme(demoTheme === 'dark' ? 'light' : 'dark')}
                  className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors"
                >
                  {demoTheme === 'dark' ? 'Dark' : 'Light'}
                </button>
              </div>
            </div>

            {/* Window Body Split View */}
            <div className="flex-1 flex overflow-hidden min-h-[300px]">
              {/* Sidebar File Drawer */}
              <aside className="w-48 bg-slate-50/80 dark:bg-slate-950/60 border-r border-slate-200/80 dark:border-slate-800/80 p-4 hidden md:flex flex-col gap-3 font-mono text-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  WORKING VAULT
                </div>
                <div className="space-y-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2 p-1.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/50 dark:border-blue-800/50">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate">Untitled.md</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Ideas_2026.md</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Release_Notes.md</span>
                  </div>
                </div>
              </aside>

              {/* Editor Canvas */}
              <article className={`flex-1 p-6 font-mono text-xs leading-relaxed transition-colors overflow-y-auto ${demoTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}`}>
                {demoTab === 'editor' ? (
                  <textarea
                    value={demoText}
                    onChange={(e) => setDemoText(e.target.value)}
                    className="w-full h-60 bg-transparent font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-blue-500 selection:text-white"
                    placeholder="Type your markdown..."
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none text-xs space-y-3 font-sans">
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                      Launching LinkDit Pad
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      LinkDit Pad is the minimalist tool for maximum productivity.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                      <li>No Cloud sync needed. 100% Local Files.</li>
                      <li>Built with sub-120ms launch speed in mind.</li>
                      <li>Export to PDF, HTML, or Markdown with GFM support.</li>
                    </ul>
                  </div>
                )}
              </article>
            </div>

            {/* Status Bar */}
            <div className="bg-slate-50/90 dark:bg-slate-950/90 px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span>UTF-8</span>
                <span>Markdown (GFM)</span>
                <span>{wordCount} Words</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Local Storage Active</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* BOTTOM FEATURE HIGHLIGHT ROW CARDS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Privacy First</span>
              <span className="text-sm font-semibold text-slate-950 dark:text-white">100% Local Storage</span>
            </div>
            <div className="flex flex-col md:border-l border-slate-200 dark:border-slate-800 md:pl-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Standard</span>
              <span className="text-sm font-semibold text-slate-950 dark:text-white">Markdown Native</span>
            </div>
            <div className="flex flex-col md:border-l border-slate-200 dark:border-slate-800 md:pl-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enterprise Ready</span>
              <span className="text-sm font-semibold text-slate-950 dark:text-white">Offline Guarantee</span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-200 dark:border-slate-800 w-full md:w-auto justify-between md:justify-start">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">WIN</div>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">MSI</div>
              <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">EXE</div>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Windows 10 & 11 Ready</span>
          </div>
        </motion.div>
      </section>

      {/* CORE BENEFITS FEATURE CARDS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white font-sans">
            Engineered for Uninterrupted Focus
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Eliminate loading delays, telemetry trackers, and forced account logins.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-5 h-5 text-amber-500" />,
              title: 'Sub-120ms Cold Launch',
              desc: 'No splash screen delay. Opens directly into your document buffer in under 120ms.',
            },
            {
              icon: <Shield className="w-5 h-5 text-emerald-500" />,
              title: 'Zero Telemetry',
              desc: 'Zero analytics pings, no remote trackers, and zero background network telemetry.',
            },
            {
              icon: <WifiOff className="w-5 h-5 text-blue-500" />,
              title: '100% Offline Control',
              desc: 'Functions completely disconnected. Files stay safely on your physical hard drive.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SCREENSHOTS SHOWCASE PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Visual Workspace Gallery
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Explore 21 high-resolution workspace previews.
            </p>
          </div>

          <button
            onClick={() => navigate('screenshots')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white hover:underline"
          >
            <span>View All 21 Previews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCREENSHOTS.slice(0, 6).map((item) => (
            <ScreenshotCard key={item.id} screenshot={item} onClick={() => onOpenScreenshot(item.id)} />
          ))}
        </div>
      </section>

      {/* STICKY FLOATING BADGE FOR SCREENSHOTS GALLERY */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col gap-2">
        <button
          onClick={() => navigate('screenshots')}
          className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-105 transition-transform">
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-950 dark:text-white">View Gallery</div>
            <div className="text-[10px] text-slate-400">21 High-Res Previews</div>
          </div>
        </button>
      </div>
    </div>
  );
};
