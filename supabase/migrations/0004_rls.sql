-- ===========================================================================
-- 0004_rls.sql — Row Level Security for every exposed table
-- ===========================================================================
-- Principles:
--   * Enable RLS on every table in the exposed `public` schema.
--   * There is NO public write access anywhere.
--   * Anonymous reads are limited to genuinely published public content.
--   * Drafts, submissions, versions, settings(secret), audit logs and the
--     admin roster are never readable by anonymous visitors.
--   * There are no blanket `using (true)` / `with check (true)` policies.
--   * All writes happen through SECURITY DEFINER functions (0005), which
--     bypass RLS by design and perform their own permission checks.
-- ===========================================================================

alter table public.admin_users               enable row level security;
alter table public.admin_role_permissions    enable row level security;
alter table public.approval_category_policies enable row level security;
alter table public.cms_content               enable row level security;
alter table public.cms_content_versions      enable row level security;
alter table public.cms_media                 enable row level security;
alter table public.cms_download_releases     enable row level security;
alter table public.cms_blog_posts            enable row level security;
alter table public.cms_settings              enable row level security;
alter table public.cms_submissions           enable row level security;
alter table public.cms_audit_logs            enable row level security;

-- Union of privileges: RLS is the gate; these grants only decide which verbs
-- are *considered* before policies are evaluated.
grant usage on schema public to anon, authenticated;

grant select on public.cms_content, public.cms_media, public.cms_download_releases,
  public.cms_blog_posts, public.cms_settings to anon, authenticated;
grant select on public.admin_users, public.admin_role_permissions,
  public.approval_category_policies, public.cms_content_versions,
  public.cms_submissions, public.cms_audit_logs to authenticated;

-- ---------------------------------------------------------------------------
-- admin_users — a user may read their own row; privileged admins read all.
-- ---------------------------------------------------------------------------
drop policy if exists admin_users_select_self on public.admin_users;
create policy admin_users_select_self on public.admin_users
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists admin_users_select_managers on public.admin_users;
create policy admin_users_select_managers on public.admin_users
  for select to authenticated
  using (public.has_permission('users.view'));

-- ---------------------------------------------------------------------------
-- admin_role_permissions / approval_category_policies — readable by admins.
-- ---------------------------------------------------------------------------
drop policy if exists admin_role_permissions_read on public.admin_role_permissions;
create policy admin_role_permissions_read on public.admin_role_permissions
  for select to authenticated
  using (public.is_current_admin());

drop policy if exists approval_policies_read on public.approval_category_policies;
create policy approval_policies_read on public.approval_category_policies
  for select to authenticated
  using (public.is_current_admin());

-- ---------------------------------------------------------------------------
-- cms_content — public may read PUBLISHED records only; admins read all.
-- ---------------------------------------------------------------------------
drop policy if exists cms_content_public_read on public.cms_content;
create policy cms_content_public_read on public.cms_content
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists cms_content_admin_read on public.cms_content;
create policy cms_content_admin_read on public.cms_content
  for select to authenticated
  using (public.has_permission('content.view'));

-- ---------------------------------------------------------------------------
-- cms_content_versions — administrators only.
-- ---------------------------------------------------------------------------
drop policy if exists cms_versions_admin_read on public.cms_content_versions;
create policy cms_versions_admin_read on public.cms_content_versions
  for select to authenticated
  using (public.has_permission('content.view'));

-- ---------------------------------------------------------------------------
-- cms_media — published assets are public; admins read everything.
-- ---------------------------------------------------------------------------
drop policy if exists cms_media_public_read on public.cms_media;
create policy cms_media_public_read on public.cms_media
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists cms_media_admin_read on public.cms_media;
create policy cms_media_admin_read on public.cms_media
  for select to authenticated
  using (public.has_permission('media.view'));

-- ---------------------------------------------------------------------------
-- cms_download_releases — only available + published releases are public.
-- ---------------------------------------------------------------------------
drop policy if exists cms_releases_public_read on public.cms_download_releases;
create policy cms_releases_public_read on public.cms_download_releases
  for select to anon, authenticated
  using (status = 'published' and is_available = true);

drop policy if exists cms_releases_admin_read on public.cms_download_releases;
create policy cms_releases_admin_read on public.cms_download_releases
  for select to authenticated
  using (public.has_permission('downloads.view'));

-- ---------------------------------------------------------------------------
-- cms_blog_posts — ONLY published posts with a past published_at are public.
-- ---------------------------------------------------------------------------
drop policy if exists cms_blog_public_read on public.cms_blog_posts;
create policy cms_blog_public_read on public.cms_blog_posts
  for select to anon, authenticated
  using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists cms_blog_admin_read on public.cms_blog_posts;
create policy cms_blog_admin_read on public.cms_blog_posts
  for select to authenticated
  using (public.has_permission('blog.view'));

-- ---------------------------------------------------------------------------
-- cms_settings — non-secret settings are readable (ad/analytics IDs are public
-- identifiers anyway); secret values are admin-only.
-- ---------------------------------------------------------------------------
drop policy if exists cms_settings_public_read on public.cms_settings;
create policy cms_settings_public_read on public.cms_settings
  for select to anon, authenticated
  using (is_secret = false);

drop policy if exists cms_settings_admin_read on public.cms_settings;
create policy cms_settings_admin_read on public.cms_settings
  for select to authenticated
  using (public.has_permission('settings.view'));

-- ---------------------------------------------------------------------------
-- cms_submissions — reviewers and anyone who can view approvals.
-- ---------------------------------------------------------------------------
drop policy if exists cms_submissions_admin_read on public.cms_submissions;
create policy cms_submissions_admin_read on public.cms_submissions
  for select to authenticated
  using (public.has_permission('approvals.view'));

-- ---------------------------------------------------------------------------
-- cms_audit_logs — read-only to admins with audit.view; mutations blocked by
-- the append-only trigger in 0002_cms.sql.
-- ---------------------------------------------------------------------------
drop policy if exists cms_audit_admin_read on public.cms_audit_logs;
create policy cms_audit_admin_read on public.cms_audit_logs
  for select to authenticated
  using (public.has_permission('audit.view'));

-- ===========================================================================
-- NOTE: No INSERT / UPDATE / DELETE policies exist on any CMS table. Combined
-- with RLS this denies all client writes. Publication, approval and role
-- changes are only possible through the SECURITY DEFINER functions below,
-- which enforce permissions, anti-self-approval and audit logging server-side.
-- ===========================================================================
