import React, { Suspense, lazy, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { AdminRouterProvider, useAdminRouter } from './lib/router';
import { AdminLayout } from './components/AdminLayout';
import { LoadingBlock, Alert, Button } from './components/ui';

/* Pages are lazy-loaded so the /admin code (and the Supabase client) is only
   ever fetched when an administrator actually visits /admin — never on the
   public routes. */
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ContentPage = lazy(() => import('./pages/ContentPage'));
const DesignPage = lazy(() => import('./pages/DesignPage'));
const MediaPage = lazy(() => import('./pages/MediaPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const SeoPage = lazy(() => import('./pages/SeoPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ApprovalsPage = lazy(() => import('./pages/ApprovalsPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

/** Admin pages must never be indexed. This is defence-in-depth only —
 *  authentication is enforced independently of this meta tag. */
function useNoIndex() {
  useEffect(() => {
    let el = document.querySelector('meta[name="robots"]');
    const created = !el;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'robots');
      document.head.appendChild(el);
    }
    const prev = el.getAttribute('content');
    el.setAttribute('content', 'noindex, nofollow, noarchive');
    return () => {
      if (created) el?.remove();
      else if (prev) el?.setAttribute('content', prev);
    };
  }, []);
}

const SetupRequired: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#070c17] p-6">
    <div className="w-full max-w-lg space-y-4 rounded-lg border border-[#1e2a44] bg-[#0f172a] p-7">
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-white">Typodocs</span>
        <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-amber-300">
          ADMIN
        </span>
      </div>
      <Alert tone="warning">Authentication backend is not configured.</Alert>
      <p className="text-sm text-slate-400">
        Set <code className="text-cyan-300">VITE_SUPABASE_URL</code> and{' '}
        <code className="text-cyan-300">VITE_SUPABASE_ANON_KEY</code> (public anon key only), then redeploy. See{' '}
        <code className="text-cyan-300">supabase/README.md</code> for the full setup, migrations and owner-bootstrap
        steps. The public website does not require this configuration and continues to work.
      </p>
    </div>
  </div>
);

const NotAuthorized: React.FC = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070c17] p-6">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-[#1e2a44] bg-[#0f172a] p-7">
        <h1 className="text-lg font-semibold text-white">Administrator access required</h1>
        <p className="text-sm text-slate-400">
          The account <span className="text-slate-200">{user?.email}</span> is signed in but has no administrator
          role. Access is granted by an Owner. There is no public sign-up.
        </p>
        <Button variant="secondary" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  );
};

function RoutedPage() {
  const { segment } = useAdminRouter();
  switch (segment) {
    case 'content':
      return <ContentPage />;
    case 'design':
      return <DesignPage />;
    case 'media':
      return <MediaPage />;
    case 'downloads':
      return <DownloadsPage />;
    case 'blog':
      return <BlogPage />;
    case 'seo':
      return <SeoPage />;
    case 'analytics':
      return <AnalyticsPage />;
    case 'approvals':
      return <ApprovalsPage />;
    case 'users':
      return <UsersPage />;
    case 'audit-logs':
      return <AuditLogsPage />;
    case 'settings':
      return <SettingsPage />;
    case 'dashboard':
    case '':
    default:
      return <DashboardPage />;
  }
}

const AdminShell: React.FC = () => {
  const { configured, initializing, session, profile } = useAuth();
  const { segment } = useAdminRouter();

  useNoIndex();

  if (!configured) return <SetupRequired />;

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070c17]">
        <LoadingBlock label="Checking session…" />
      </div>
    );
  }

  const isAuthScreen = segment === 'login' || segment === 'reset-password';

  if (!session) {
    return (
      <Suspense fallback={<LoadingBlock />}>
        {segment === 'reset-password' ? <ResetPasswordPage /> : <LoginPage />}
      </Suspense>
    );
  }

  if (!profile) {
    // A recovery session (password reset) is still useful before the profile
    // resolves, but once resolved without a role the account is not an admin.
    if (segment === 'reset-password' && isAuthScreen) {
      return (
        <Suspense fallback={<LoadingBlock />}>
          <ResetPasswordPage />
        </Suspense>
      );
    }
    return <NotAuthorized />;
  }

  return (
    <AdminLayout>
      <Suspense fallback={<LoadingBlock />}>
        <RoutedPage />
      </Suspense>
    </AdminLayout>
  );
};

/** Entry point for /admin/* rendered by the public App router. */
export default function AdminApp() {
  return (
    <AuthProvider>
      <AdminRouterProvider>
        <AdminShell />
      </AdminRouterProvider>
    </AuthProvider>
  );
}
