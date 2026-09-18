import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Download, Sun, Moon, Menu, X, Search } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, navigate, onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'products', label: 'Product' },
    { id: 'features', label: 'Features' },
    { id: 'download', label: 'Download' },
    { id: 'release-notes', label: 'Release Notes' },
  ];

  const go = (page: PageId) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow border-b ${
        scrolled
          ? 'bg-paper/90 dark:bg-ink-950/90 backdrop-blur-md border-line dark:border-line-dark shadow-[0_1px_2px_rgba(28,26,22,0.04)]'
          : 'bg-paper/80 dark:bg-ink-950/80 backdrop-blur-md border-line/70 dark:border-line-dark/60'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <button onClick={() => go('home')} className="flex items-center gap-2.5 group" aria-label="LinkDit Pad — home">
            <img
              src="/icon-128.png"
              alt=""
              className="w-8 h-8 rounded-lg object-contain ring-1 ring-line dark:ring-line-dark"
            />
            <span className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tracking-tight text-ink dark:text-paper">LinkDit</span>
              <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-accent-soft text-accent-deep dark:bg-accent/15 dark:text-blue-300">
                Pad
              </span>
            </span>
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`relative pb-0.5 transition-colors ${
                  isActive ? 'text-ink dark:text-paper' : 'text-ink-mute hover:text-ink dark:hover:text-paper'
                }`}
              >
                <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            title="Search (Ctrl + K)"
            aria-label="Search website"
            className="p-2 rounded-md text-ink-mute hover:text-ink dark:hover:text-paper hover:bg-paper-2 dark:hover:bg-ink-900 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-label="Toggle theme"
            className="p-2 rounded-md text-ink-mute hover:text-ink dark:hover:text-paper hover:bg-paper-2 dark:hover:bg-ink-900 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => go('download')}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
          >
            <Download className="w-4 h-4" />
            <span>Download for Windows</span>
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-md text-ink-soft hover:bg-paper-2 dark:hover:bg-ink-900"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-md text-ink dark:text-paper hover:bg-paper-2 dark:hover:bg-ink-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-line dark:border-line-dark bg-paper dark:bg-ink-950 px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-paper-2 dark:bg-ink-900 text-ink dark:text-paper'
                  : 'text-ink-soft dark:text-paper/70 hover:bg-paper-2/70 dark:hover:bg-ink-900/70'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-line dark:border-line-dark">
            <button
              onClick={() => go('download')}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper dark:bg-paper dark:text-ink"
            >
              <Download className="w-4 h-4" />
              <span>Download LinkDit Pad</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};