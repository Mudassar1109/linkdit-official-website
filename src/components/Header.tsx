import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../lib/auth/AuthProvider';
import { trackCta } from '../lib/analytics';
import { DOWNLOAD_PATH } from '../data/websiteData';
import { CURRENT_VERSION_LABEL } from '../config';
import {
  Download,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  UserRound,
  CreditCard,
  LogOut,
  Settings,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, navigate, onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  const navItems: { id: PageId; label: string; hint: string }[] = [
    { id: 'products', label: 'Products', hint: 'What TypoDocs is' },
    { id: 'features', label: 'Features', hint: 'Everything it does' },
    { id: 'pricing', label: 'Pricing', hint: 'Free & Pro plans' },
    { id: 'download', label: 'Download', hint: 'Get the app' },
    { id: 'docs', label: 'Docs', hint: 'Guides & reference' },
    { id: 'support', label: 'Support', hint: 'Help & answers' },
    { id: 'release-notes', label: 'Release Notes', hint: "What's new" },
  ];

  /** Real anchors for crawlability, intercepted for SPA navigation. */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, page: PageId) => {
      e.preventDefault();
      navigate(page);
    },
    [navigate]
  );

  const go = (page: PageId) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement strip */}
      {bannerVisible && (
        <div className="gradient-violet text-white">
          <div className="container-site flex h-9 items-center justify-center gap-3 text-[12.5px] font-medium">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <p className="min-w-0 flex-1 truncate">
              TypoDocs {CURRENT_VERSION_LABEL} is out — screenshot capture, faster Auto Save, and a 5.5 MB installer.
            </p>
            <a
              href="/download"
              onClick={(e) => { e.preventDefault(); go('download'); }}
              className="hidden items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold transition-colors hover:bg-white/25 sm:inline-flex"
            >
              See what&apos;s new
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <button
              onClick={() => setBannerVisible(false)}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors hover:bg-white/20"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main bar — deep-navy chrome with separated search section */}
      <header className="border-b border-line bg-paper/90 backdrop-blur-xl dark:border-line-dark dark:bg-ink-950/85">
        <div className="container-site flex h-16 items-center gap-4">
          {/* Brand */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, 'home')}
            className="group flex shrink-0 items-center gap-2.5 rounded-xl py-1 pr-1 focus-ring"
            aria-label="TypoDocs — home"
          >
            <span className="relative">
              <img
                src="/icon-128.png?v=20261025"
                alt=""
                className="h-9 w-9 rounded-xl object-contain shadow-sm ring-1 ring-line transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 dark:ring-line-dark"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[17px] font-bold tracking-tight text-ink dark:text-paper">
                TypoDocs
              </span>
              <span className="mt-0.5 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-ink-mute sm:block dark:text-zinc-500">
                by LinkDit
              </span>
            </span>
          </a>

          {/* Desktop nav — its own group, no search inside */}
          <nav className="mx-auto hidden items-center gap-0.5 min-[1280px]:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.id}
                  href={`/${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-medium transition-colors duration-150 focus-ring min-[1536px]:px-2.5 ${isActive
                    ? 'bg-accent-soft text-fg-accent dark:bg-accent/20 dark:text-violet-200'
                    : 'text-ink-soft hover:bg-paper-2 hover:text-ink dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-paper'
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right cluster — search lives in its own section after a divider */}
          <div className="ml-auto flex items-center gap-2 min-[1280px]:ml-0">
            {/* Vertical divider separating nav from the search section */}
            <span
              aria-hidden="true"
              className="hidden h-7 w-px shrink-0 bg-gradient-to-b from-transparent via-line-strong to-transparent min-[1280px]:block dark:via-line-dark-strong"
            />

            {/* Independent search section */}
            <div className="hidden min-[1280px]:flex">
              <button
                onClick={onOpenSearch}
                aria-label="Search website"
                title="Search (Ctrl + K)"
                className="hidden h-9 items-center gap-2.5 rounded-full border border-line bg-surface pl-3.5 pr-2.5 text-[12.5px] text-ink-mute shadow-xs transition-all hover:border-accent/50 hover:text-ink-soft dark:border-line-dark dark:bg-white/[0.04] dark:text-zinc-500 dark:hover:border-accent/60 dark:hover:text-zinc-300 focus-ring min-[1280px]:flex min-[1280px]:w-44 min-[1536px]:w-60 min-[1536px]:justify-start"
              >
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden min-[1536px]:inline">Search documentation...</span>
                <kbd className="ml-auto hidden rounded-md border border-line bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] font-medium min-[1280px]:inline dark:border-line-dark dark:bg-white/5">
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Condensed search for mid widths — same section, compact control */}
            <button
              onClick={onOpenSearch}
              aria-label="Search website"
              title="Search (Ctrl + K)"
              className="icon-btn hidden h-9 w-9 sm:max-[1279px]:block"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-label="Toggle theme"
              className="icon-btn hidden h-9 w-9 sm:block"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {user ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setAccountMenuOpen((o) => !o)}
                  title={profile?.display_name || user.email || 'Account'}
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={accountMenuOpen}
                  className="flex h-9 items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-[13px] text-ink-soft shadow-xs transition-colors hover:border-line-strong hover:text-ink dark:border-line-dark dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:text-paper focus-ring"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full gradient-violet text-[11px] font-bold text-white">
                    {(profile?.display_name || user.email || 'A').charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[96px] truncate lg:inline">
                    {profile?.display_name || user.email?.split('@')[0] || 'Account'}
                  </span>
                </button>
                {accountMenuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-64 origin-top-right animate-kd-scale-in overflow-hidden rounded-2xl border border-line bg-surface shadow-card-elevated dark:border-line-dark dark:bg-ink-850"
                    role="menu"
                  >
                    <div className="border-b border-line px-4 py-3.5 dark:border-line-dark">
                      <p className="truncate font-display text-sm font-bold text-ink dark:text-paper">
                        {profile?.display_name || 'Account'}
                      </p>
                      <p className="truncate text-xs text-ink-mute dark:text-zinc-500">{user.email}</p>
                    </div>
                    <div className="space-y-0.5 p-2">
                      <button
                        onClick={() => { setAccountMenuOpen(false); go('account'); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-fg-accent dark:text-zinc-300 dark:hover:bg-accent/20 dark:hover:text-violet-200"
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4" /> Account settings
                      </button>
                      <button
                        onClick={() => { setAccountMenuOpen(false); go('billing'); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-fg-accent dark:text-zinc-300 dark:hover:bg-accent/20 dark:hover:text-violet-200"
                        role="menuitem"
                      >
                        <CreditCard className="h-4 w-4" /> Billing &amp; subscription
                      </button>
                    </div>
                    <div className="border-t border-line p-2 dark:border-line-dark">
                      <button
                        onClick={async () => { setAccountMenuOpen(false); await signOut(); go('home'); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-danger-soft hover:text-fg-danger dark:text-zinc-300 dark:hover:bg-danger/15"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => go('sign-in')} className="btn-ghost btn-sm hidden min-[1280px]:inline-flex">
                Sign In
              </button>
            )}
            <a
              href={DOWNLOAD_PATH}
              download
              onClick={() => trackCta('header_download', currentPage, 'Get Started')}
              className="btn-accent btn-sm hidden sm:inline-flex"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Get Started</span>
            </a>

            {/* Mobile actions */}
            <div className="flex items-center gap-1 min-[1280px]:hidden">
              <button
                onClick={onOpenSearch}
                aria-label="Search website"
                className="icon-btn sm:hidden"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
              <button
                ref={menuButtonRef}
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-colors dark:bg-paper dark:text-ink"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer — full-height panel from the right, search included */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 min-[1280px]:hidden">
          <div
            aria-hidden="true"
            className="animate-kd-fade-in absolute inset-0 bg-ink/40 backdrop-blur-sm dark:bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            id="mobile-menu"
            className="animate-kd-slide-in-right absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto border-l border-line bg-paper shadow-card-elevated dark:border-line-dark dark:bg-ink-950"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5 dark:border-line-dark">
              <div className="flex items-center gap-2.5">
                <img src="/icon-128.png?v=20261025" alt="" className="h-8 w-8 rounded-xl object-contain ring-1 ring-line dark:ring-line-dark" />
                <span className="font-display text-[16px] font-bold tracking-tight text-ink dark:text-paper">TypoDocs</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="icon-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dedicated search control */}
            <div className="border-b border-line px-4 py-4 dark:border-line-dark">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenSearch(); }}
                className="flex w-full items-center gap-3 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink-mute transition-colors hover:border-accent/50 hover:text-ink-soft dark:border-line-dark dark:bg-white/[0.04] dark:text-zinc-500 dark:hover:border-accent/60"
              >
                <Search className="h-4 w-4" />
                <span className="flex-1 text-left">Search pages, docs, features...</span>
                <kbd className="rounded-md border border-line bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] dark:border-line-dark dark:bg-white/5">
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Primary nav — numbered editorial list */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5" aria-label="Mobile">
              {navItems.map((item, i) => {
                const isActive = currentPage === item.id;
                return (
                  <a
                    key={item.id}
                    href={`/${item.id}`}
                    onClick={(e) => { e.preventDefault(); go(item.id); }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors ${isActive
                      ? 'bg-accent-soft dark:bg-accent/20'
                      : 'hover:bg-paper-2 dark:hover:bg-white/[0.05]'
                      }`}
                  >
                    <span className={`font-mono text-[10px] ${isActive ? 'text-fg-accent dark:text-violet-300' : 'text-ink-mute dark:text-zinc-600'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">
                      <span className={`block font-display text-[16px] font-bold tracking-tight ${isActive ? 'text-fg-accent dark:text-violet-200' : 'text-ink dark:text-paper'}`}>
                        {item.label}
                      </span>
                      <span className="block text-xs text-ink-mute dark:text-zinc-500">{item.hint}</span>
                    </span>
                    <ArrowUpRight className={`h-4 w-4 ${isActive ? 'text-fg-accent dark:text-violet-300' : 'text-ink-mute dark:text-zinc-600'}`} />
                  </a>
                );
              })}
            </nav>

            {/* Account actions */}
            <div className="space-y-1 border-t border-line px-4 py-4 dark:border-line-dark">
              {user ? (
                <>
                  <button onClick={() => go('account')} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-2 dark:text-zinc-300 dark:hover:bg-white/[0.05]">
                    <Settings className="h-4 w-4" /> Account settings
                  </button>
                  <button onClick={() => go('billing')} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-2 dark:text-zinc-300 dark:hover:bg-white/[0.05]">
                    <CreditCard className="h-4 w-4" /> Billing &amp; subscription
                  </button>
                  <button
                    onClick={async () => { await signOut(); go('home'); }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-2 hover:text-fg-danger dark:text-zinc-300 dark:hover:bg-white/[0.05]"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <button onClick={() => go('sign-in')} className="btn-secondary w-full">
                  <UserRound className="h-4 w-4" /> Sign In
                </button>
              )}
              <a
                href={DOWNLOAD_PATH}
                download
                onClick={() => { trackCta('header_mobile_download', currentPage, 'Get Started'); setMobileMenuOpen(false); }}
                className="btn-accent mt-2 w-full"
              >
                <Download className="h-4 w-4" />
                <span>Get Started</span>
              </a>
              <p className="pt-1 text-center font-mono text-[10px] text-ink-mute dark:text-zinc-600">
                {CURRENT_VERSION_LABEL} · Free for Windows 10 &amp; 11
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
