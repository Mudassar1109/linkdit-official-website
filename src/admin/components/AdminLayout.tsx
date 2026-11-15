import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Palette,
  Images,
  DownloadCloud,
  Newspaper,
  Search,
  BarChart3,
  CheckSquare,
  Users,
  ScrollText,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useAdminRouter, type AdminSegment } from '../lib/router';
import { roleHasPermission, ROLE_LABELS, type Permission } from '../lib/permissions';
import { cx } from './ui';

interface NavItem {
  segment: AdminSegment;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: Permission;
}

const NAV: NavItem[] = [
  { segment: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard.view' },
  { segment: 'content', label: 'Content', icon: FileText, permission: 'content.view' },
  { segment: 'design', label: 'Design', icon: Palette, permission: 'content.view' },
  { segment: 'media', label: 'Media & Branding', icon: Images, permission: 'media.view' },
  { segment: 'downloads', label: 'Downloads', icon: DownloadCloud, permission: 'downloads.view' },
  { segment: 'blog', label: 'Blog', icon: Newspaper, permission: 'blog.view' },
  { segment: 'seo', label: 'SEO', icon: Search, permission: 'seo.view' },
  { segment: 'analytics', label: 'Analytics & Ads', icon: BarChart3, permission: 'analytics.view' },
  { segment: 'approvals', label: 'Approvals', icon: CheckSquare, permission: 'approvals.view' },
  { segment: 'users', label: 'Administrators', icon: Users, permission: 'users.view' },
  { segment: 'audit-logs', label: 'Audit Logs', icon: ScrollText, permission: 'audit.view' },
  { segment: 'settings', label: 'Settings', icon: SettingsIcon, permission: 'settings.view' },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, role, signOut } = useAuth();
  const { segment, navigate } = useAdminRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV.filter((item) => roleHasPermission(role, item.permission));
  const active: AdminSegment | '' = segment === '' ? 'dashboard' : segment;
  const activeLabel = NAV.find((n) => n.segment === active)?.label ?? 'Dashboard';

  const go = (seg: AdminSegment) => {
    navigate(`/${seg}`);
    setMobileOpen(false);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-4">
        <img
          src="/icon-128.png?v=20261025"
          alt=""
          className="h-8 w-8 rounded-lg object-contain ring-1 ring-navy-600"
        />
        <div className="leading-tight">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold tracking-tight text-white">TypoDocs</span>
            <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-amber-300">
              ADMIN
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Content Management</span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2" aria-label="Admin sections">
        <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Workspace
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.segment;
          return (
            <button
              key={item.segment}
              onClick={() => go(item.segment)}
              aria-current={isActive ? 'page' : undefined}
              className={cx(
                'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-cyan-500/10 font-medium text-cyan-300'
                  : 'text-slate-400 hover:bg-navy-800 hover:text-slate-100',
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400" />
              )}
              <Icon className={cx('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300')} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-navy-700 p-3">
        <div className="rounded-md border border-navy-700 bg-navy-900 px-3 py-2.5">
          <div className="truncate text-xs font-medium text-slate-200">{profile?.email}</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-slate-500">{role ? ROLE_LABELS[role] : 'No role'}</span>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-navy-800 hover:text-rose-300"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-navy-700 bg-navy-900 lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-kd-fade-in bg-navy-950/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 animate-kd-slide-in-left border-r border-navy-700 bg-navy-900 shadow-admin-pop">
            {sidebar}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-navy-700 bg-navy-950/90 px-4 backdrop-blur lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="-ml-1 rounded-md p-2 text-slate-400 transition-colors hover:bg-navy-800 hover:text-white lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="truncate text-sm font-semibold text-white">{activeLabel}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Private · not indexed</span>
            </div>
            <a
              href="/"
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-navy-800 hover:text-cyan-300"
            >
              View public site <span aria-hidden="true">↗</span>
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
};