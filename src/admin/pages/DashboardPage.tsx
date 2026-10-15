import React from 'react';
import { useAuth } from '../lib/auth';
import { roleHasPermission, ROLE_LABELS } from '../lib/permissions';
import { useAsync, useDocumentTitle } from '../lib/hooks';
import * as api from '../lib/api';
import { Alert, LoadingBlock, Mono, Panel, SectionHeader, StatusBadge } from '../components/ui';

const Card: React.FC<{ label: string; value: React.ReactNode; hint?: string }> = ({ label, value, hint }) => (
  <Panel className="p-5">
    <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{label}</div>
    <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    {hint && <div className="mt-0.5 text-xs text-slate-500">{hint}</div>}
  </Panel>
);

const DashboardPage: React.FC = () => {
  useDocumentTitle('Dashboard');
  const { profile, role } = useAuth();

  const canContent = roleHasPermission(role, 'content.view');
  const canApprovals = roleHasPermission(role, 'approvals.view');
  const canDownloads = roleHasPermission(role, 'downloads.view');
  const canUsers = roleHasPermission(role, 'users.view');

  const content = useAsync(() => (canContent ? api.listContent() : Promise.resolve([])), [canContent]);
  const submissions = useAsync(() => (canApprovals ? api.listSubmissions() : Promise.resolve([])), [canApprovals]);
  const releases = useAsync(() => (canDownloads ? api.listReleases() : Promise.resolve([])), [canDownloads]);
  const admins = useAsync(() => (canUsers ? api.listAdminUsers() : Promise.resolve([])), [canUsers]);

  const loading = content.loading || submissions.loading || releases.loading || admins.loading;
  const errors = [content.error, submissions.error, releases.error, admins.error].filter(Boolean) as string[];
  const notConfigured = errors.some((e) => e === 'Backend not configured.');
  const otherError = errors.find((e) => e !== 'Backend not configured.');

  const drafts = content.data?.filter((c) => c.status === 'draft').length ?? 0;
  const publishedContent = content.data?.filter((c) => c.status === 'published').length ?? 0;
  const pending = submissions.data?.filter((s) => s.status === 'submitted' || s.status === 'in_review').length ?? 0;
  const currentRelease = releases.data?.find((r) => r.is_current && r.status === 'published');
  const draftReleases = releases.data?.filter((r) => r.status !== 'published').length ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Welcome, ${profile?.display_name || profile?.email?.split('@')[0] || 'administrator'}`}
        description={`Signed in as ${role ? ROLE_LABELS[role] : 'unknown role'}.`}
      />

      {notConfigured && (
        <Alert tone="error">
          <strong>Backend not configured.</strong> Supabase credentials are missing, so no live data is available. The
          dashboard is intentionally showing nothing rather than fabricated figures.
        </Alert>
      )}
      {otherError && <Alert tone="error">Could not load dashboard data: {otherError}</Alert>}

      {loading ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Content drafts" value={drafts} hint="Awaiting publication" />
            <Card label="Published content" value={publishedContent} hint="Serving the public site" />
            <Card label="Pending approvals" value={pending} hint="Submitted or in review" />
            <Card
              label="Current release"
              value={currentRelease ? currentRelease.version : '—'}
              hint={currentRelease ? currentRelease.channel : 'No published release'}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel className="p-5">
              <h3 className="text-sm font-semibold text-white">Downloads</h3>
              <p className="mt-1 text-xs text-slate-500">
                {canDownloads
                  ? `${draftReleases} release record(s) not yet published. Installers keep their existing hosting; only metadata is managed here.`
                  : 'Your role cannot view release metadata.'}
              </p>
            </Panel>
            <Panel className="p-5">
              <h3 className="text-sm font-semibold text-white">Administrators</h3>
              <p className="mt-1 text-xs text-slate-500">
                {canUsers ? `${admins.data?.length ?? 0} administrator account(s).` : 'Your role cannot view administrator accounts.'}
              </p>
              {canUsers && admins.data && admins.data.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {admins.data.slice(0, 5).map((a) => (
                    <li key={a.user_id} className="flex items-center justify-between gap-3 text-xs">
                      <Mono className="truncate">{a.email}</Mono>
                      <StatusBadge status={a.is_active ? 'active' : 'inactive'} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <Alert tone="info">
            This console manages the website's content, media and settings. Nothing here fabricates analytics: where a
            real integration is not configured, screens show “Not configured” rather than invented numbers.
          </Alert>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
