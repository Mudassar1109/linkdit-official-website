import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/** Segments that live under /admin. */
export type AdminSegment =
  | 'login'
  | 'reset-password'
  | 'dashboard'
  | 'content'
  | 'design'
  | 'media'
  | 'downloads'
  | 'blog'
  | 'seo'
  | 'analytics'
  | 'approvals'
  | 'users'
  | 'audit-logs'
  | 'settings';

interface RouterValue {
  /** Current /admin/* path without the leading `/admin`. '' means dashboard. */
  segment: AdminSegment | '';
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterValue | undefined>(undefined);

const KNOWN: AdminSegment[] = [
  'login',
  'reset-password',
  'dashboard',
  'content',
  'design',
  'media',
  'downloads',
  'blog',
  'seo',
  'analytics',
  'approvals',
  'users',
  'audit-logs',
  'settings',
];

export function parseAdminSegment(pathname: string): AdminSegment | '' {
  const rest = pathname.replace(/^\/admin\/?/, '').replace(/\/+$/, '');
  if (!rest) return '';
  const first = rest.split('/')[0] as AdminSegment;
  return KNOWN.includes(first) ? first : '';
}

export const AdminRouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to.startsWith('/admin') ? to : `/admin${to.startsWith('/') ? to : `/${to}`}`;
    if (window.location.pathname !== target) {
      window.history.pushState({}, '', target);
    }
    setPath(target);
    window.scrollTo({ top: 0 });
  }, []);

  const value = useMemo<RouterValue>(
    () => ({ segment: parseAdminSegment(path), path, navigate }),
    [path, navigate],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useAdminRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useAdminRouter must be used within AdminRouterProvider');
  return ctx;
}
