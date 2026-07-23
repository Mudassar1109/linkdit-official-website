import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  FileText,
  Download,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  BookOpen,
  MapPin,
  HelpCircle,
  Archive,
} from 'lucide-react';
import { DOMAIN_NAME, PRODUCT_NAME, TAGLINE } from '../data/websiteData';

interface HeaderProps {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  onOpenSearch: () => void;
  onOpenExportZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  navigate,
  onOpenSearch,
  onOpenExportZip,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageId; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'features', label: 'Features' },
    { id: 'download', label: 'Download', badge: 'v1.0' },
    { id: 'screenshots', label: 'Gallery', badge: '21' },
    { id: 'docs', label: 'Docs' },
    { id: 'changelog', label: 'Changelog' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-xs border-b border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            id="header-logo-button"
          >
            <img
              src="/icon-128.png"
              alt="LinkDit Pad Logo"
              className="w-8 h-8 rounded-lg shadow-xs group-hover:scale-105 transition-transform duration-200 object-contain"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-slate-950 dark:text-white font-sans">
                LinkDit
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                Pad
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium" id="desktop-navigation">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-slate-950 dark:text-white font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200/80 dark:border-slate-700/80">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Global Search Trigger */}
          <button
            onClick={onOpenSearch}
            id="search-trigger-button"
            className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 px-3 py-2 rounded-full border border-slate-200/80 dark:border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title="Search website (Ctrl + K)"
            aria-label="Search website"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <kbd className="hidden md:inline-block font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              Ctrl K
            </kbd>
          </button>

          {/* Support Link */}
          <button
            onClick={() => navigate('support')}
            id="support-header-link"
            className="text-xs font-medium px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors text-slate-600 dark:text-slate-300"
          >
            Support
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-header-btn"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Primary Download CTA */}
          <button
            onClick={() => navigate('download')}
            id="primary-download-cta-header"
            className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-5 py-2 rounded-full text-xs font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download LinkDit Pad</span>
          </button>
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            id="theme-toggle-mobile-btn"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-900">
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg w-full"
            >
              <Search className="w-4 h-4" />
              <span>Search website & documentation...</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-2">
            <button
              onClick={() => {
                navigate('download');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download LinkDit Pad v1.0.0</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
