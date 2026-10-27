import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../lib/auth/AuthProvider';
import { trackCta } from '../lib/analytics';
import { DOWNLOAD_PATH } from '../data/websiteData';
import { Download, Sun, Moon, Menu, X, Search, UserRound, CreditCard, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, navigate, onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

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
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'products', label: 'Product' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'compare', label: 'Compare' },
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
          <button onClick={() => go('home')} className="flex items-center gap-2.5 group" aria-label="TypoDocs — home">
            <img
              src="/icon-128.png?v=20261025"
              alt=""
              className="w-8 h-8 rounded-lg object-contain ring-1 ring-line dark:ring-line-dark"
            />
            <span className="text-lg font-bold tracking-tight text-ink dark:text-paper">TypoDocs</span>
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
          {user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen((o) => !o)}
                title={profile?.display_name || user.email || 'Account'}
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={accountMenuOpen}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-mute hover:text-ink dark:hover:text-paper hover:bg-paper-2 dark:hover:bg-ink-900 transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-paper dark:bg-paper dark:text-ink">
                  <UserRound className="w-4 h-4" />
                </div>
                <span className="max-w-[140px] truncate">{profile?.display_name || user.email?.split('@')[0] || 'Account'}</span>
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-line bg-surface shadow-card dark:border-line-dark dark:bg-ink-850" role="menu">
                  <div className="px-3 py-2 border-b border-line dark:border-line-dark">
                    <p className="text-xs font-semibold text-ink dark:text-paper truncate">{profile?.display_name || 'Account'}</p>
                    <p className="text-xs text-ink-mute dark:text-paper/55 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        go('account');
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-paper-2 dark:text-paper dark:hover:bg-ink-900"
                      role="menuitem"
                    >
                      <Settings className="h-4 w-4" />
                      Account settings
                    </button>
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        go('billing');
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-paper-2 dark:text-paper dark:hover:bg-ink-900"
                      role="menuitem"
                    >
                      <CreditCard className="h-4 w-4" />
                      Billing & subscription
                    </button>
                  </div>
                  <div className="border-t border-line py-1 dark:border-line-dark">
                    <button
                      onClick={async () => {
                        setAccountMenuOpen(false);
                        await signOut();
                        go('home');
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-paper-2 dark:text-paper dark:hover:bg-ink-900"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => go('sign-in')}
              title="Sign in"
              aria-label="Sign in"
              className="p-2 rounded-md text-ink-mute hover:text-ink dark:hover:text-paper hover:bg-paper-2 dark:hover:bg-ink-900 transition-colors"
            >
              <UserRound className="w-4 h-4" />
            </button>
          )}
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
          <a
            href={DOWNLOAD_PATH}
            download
            onClick={() => trackCta('header_download', currentPage, 'Download for Windows')}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
          >
            <Download className="w-4 h-4" />
            <span>Download for Windows</span>
          </a>
        </div>

        {/* Mobile actions */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={() => go(user ? 'account' : 'sign-in')}
            aria-label={user ? 'Account' : 'Sign in'}
            className="p-2 rounded-md text-ink-soft hover:bg-paper-2 dark:hover:bg-ink-900"
          >
            <UserRound className="w-5 h-5" />
          </button>
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
          {user ? (
            <>
              <button
                onClick={() => go('account')}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-ink-soft transition-colors hover:bg-paper-2/70 dark:text-paper/70 dark:hover:bg-ink-900/70"
              >
                <Settings className="w-4 h-4" />
                Account settings
              </button>
              <button
                onClick={() => go('billing')}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-ink-soft transition-colors hover:bg-paper-2/70 dark:text-paper/70 dark:hover:bg-ink-900/70"
              >
                <CreditCard className="w-4 h-4" />
                Billing & subscription
              </button>
              <button
                onClick={async () => {
                  await signOut();
                  go('home');
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-ink-soft transition-colors hover:bg-paper-2/70 dark:text-paper/70 dark:hover:bg-ink-900/70"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => go('sign-in')}
              className="flex w-full items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-ink-soft transition-colors hover:bg-paper-2/70 dark:text-paper/70 dark:hover:bg-ink-900/70"
            >
              <UserRound className="w-4 h-4" />
              Sign in
            </button>
          )}
          <div className="pt-3 border-t border-line dark:border-line-dark">
            <a
              href={DOWNLOAD_PATH}
              download
              onClick={() => {
                trackCta('header_mobile_download', currentPage, 'Download TypoDocs');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper dark:bg-paper dark:text-ink"
            >
              <Download className="w-4 h-4" />
              <span>Download TypoDocs</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};