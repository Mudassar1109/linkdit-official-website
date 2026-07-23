import React, { useState } from 'react';
import { PageId } from '../types';
import { FEATURE_CATEGORIES, PRODUCT_NAME } from '../data/websiteData';
import {
  FileText,
  PenTool,
  Sliders,
  Palette,
  Type,
  Zap,
  Shield,
  WifiOff,
  Cpu,
  Cloud,
  Check,
  Search,
  Sparkles,
} from 'lucide-react';

interface FeaturesPageProps {
  navigate: (page: PageId) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Interactive Live Feature Tester Widget State
  const [demoWeight, setDemoWeight] = useState<number>(400);
  const [demoLineHeight, setDemoLineHeight] = useState<number>(1.6);
  const [demoAccent, setDemoAccent] = useState<string>('#3b82f6');

  const filteredCategories = FEATURE_CATEGORIES.filter((cat) => {
    if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.features.some((f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
    );
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'PenTool': return <PenTool className="w-5 h-5 text-emerald-500" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-purple-500" />;
      case 'Palette': return <Palette className="w-5 h-5 text-pink-500" />;
      case 'Type': return <Type className="w-5 h-5 text-indigo-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Shield': return <Shield className="w-5 h-5 text-teal-500" />;
      case 'WifiOff': return <WifiOff className="w-5 h-5 text-slate-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-rose-500" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-sky-500" />;
      default: return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* Page Header */}
      <section className="bg-slate-100 dark:bg-slate-900 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Complete Capabilities Matrix
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            {PRODUCT_NAME} Features
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
            Explore all 10 feature categories — from core text editing and custom fonts to local privacy guarantees and roadmap AI features.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-4 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search features (e.g. Markdown, Vim, Font weight)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Categories ({FEATURE_CATEGORIES.length})
          </button>
          {FEATURE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </section>

      {/* INTERACTIVE LIVE TYPOGRAPHY & THEME TESTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Interactive Typography & Theme Customizer Studio</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Test font weights, line spacing, and accent highlights in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span>Weight ({demoWeight}):</span>
                <input
                  type="range"
                  min="300"
                  max="700"
                  step="100"
                  value={demoWeight}
                  onChange={(e) => setDemoWeight(Number(e.target.value))}
                  className="w-24 accent-blue-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <span>Line Height ({demoLineHeight}):</span>
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={demoLineHeight}
                  onChange={(e) => setDemoLineHeight(Number(e.target.value))}
                  className="w-24 accent-blue-600"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span>Accent:</span>
                {['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setDemoAccent(color)}
                    className="w-5 h-5 rounded-full border border-white shadow-2xs"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-xl bg-slate-950 text-slate-100 transition-all font-sans"
            style={{ fontWeight: demoWeight, lineHeight: demoLineHeight }}
          >
            <p className="text-base sm:text-lg">
              "Great software should feel like an extension of your mind. Sub-120ms launch speed, smooth typography, and complete local privacy create an environment where focus happens naturally."
            </p>
            <div className="mt-3 text-xs font-mono" style={{ color: demoAccent }}>
              Active Accent Highlight Preview • LinkDit Pad Engine
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CATEGORIES LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cat.features.map((feat, fIdx) => (
                <div
                  key={fIdx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2 relative"
                >
                  {feat.badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {feat.badge}
                    </span>
                  )}
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat.name}</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
