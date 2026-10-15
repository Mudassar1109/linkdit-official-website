-- ===========================================================================
-- 0002_cms.sql — CMS content, media, releases, blog, settings, workflow, audit
-- ===========================================================================
-- All tables have RLS enabled in 0004_rls.sql. Writes occur only through the
-- SECURITY DEFINER functions in 0005_functions.sql.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- cms_content: one row per CMS-managed field. `value` always holds the current
-- EDITABLE value; `status` says whether that value is live. `published_version_id`
-- points at the version currently serving the public site.
-- ---------------------------------------------------------------------------
create table if not exists public.cms_content (
  id                  uuid primary key default gen_random_uuid(),
  key                 text not null unique,
  section             text not null default 'general',
  classification      text not null default 'ordinary'
                        check (classification in ('ordinary','restricted')),
  approval_category   text,
  value               text not null default '',
  value_type          text not null default 'text'
                        check (value_type in ('text','html','json','url')),
  status              text not null default 'draft'
                        check (status in ('draft','submitted','in_review','approved','rejected','published','archived')),
  published_version_id uuid,
  updated_by          uuid references auth.users (id) on delete set null,
  updated_at          timestamptz not null default now(),
  created_at          timestamptz not null default now()
);
create index if not exists cms_content_section_idx on public.cms_content (section);
create index if not exists cms_content_status_idx on public.cms_content (status);

-- ---------------------------------------------------------------------------
-- cms_content_versions: immutable version history for CMS content.
-- ---------------------------------------------------------------------------
create table if not exists public.cms_content_versions (
  id           uuid primary key default gen_random_uuid(),
  content_id   uuid not null references public.cms_content (id) on delete cascade,
  content_key  text not null,
  version_no   integer not null,
  value        text not null default '',
  value_type   text not null default 'text',
  status       text not null default 'draft',
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  published_at timestamptz,
  unique (content_id, version_no)
);
create index if not exists cms_content_versions_content_idx on public.cms_content_versions (content_id, version_no desc);

-- ---------------------------------------------------------------------------
-- cms_media: metadata for uploaded assets. Binary objects live in Storage.
-- ---------------------------------------------------------------------------
create table if not exists public.cms_media (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,
  public_url  text,
  alt_text    text not null default '',
  mime_type   text not null,
  size_bytes  bigint not null default 0,
  width       integer,
  height      integer,
  purpose     text not null default 'general'
                check (purpose in ('logo','favicon','banner','feature','screenshot','blog-cover','general')),
  status      text not null default 'draft' check (status in ('draft','published','archived')),
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists cms_media_purpose_idx on public.cms_media (purpose);
create index if not exists cms_media_status_idx on public.cms_media (status);

-- ---------------------------------------------------------------------------
-- cms_download_releases: installer/release metadata. Large binaries are NOT
-- stored here — only validated metadata pointing at the existing verified
-- hosting workflow (this domain or approved hosts such as GitHub Releases).
-- ---------------------------------------------------------------------------
create table if not exists public.cms_download_releases (
  id              uuid primary key default gen_random_uuid(),
  version         text not null,
  channel         text not null default 'stable' check (channel in ('stable','beta','legacy')),
  title           text not null default '',
  release_date    date,
  release_notes   text not null default '',
  installer_url   text not null,
  filename        text not null,
  file_size       text not null default '',
  sha256          text not null,
  min_windows     text not null default 'Windows 10/11 (64-bit)',
  format          text not null default '.exe' check (format in ('.exe','.msi','.msix','.zip')),
  is_available    boolean not null default false,
  is_current      boolean not null default false,
  status          text not null default 'draft'
                    check (status in ('draft','submitted','in_review','approved','rejected','published','archived')),
  approval_category text not null default 'installer_release',
  created_by      uuid references auth.users (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (channel, version)
);
create index if not exists cms_releases_status_idx on public.cms_download_releases (status, channel);

drop trigger if exists cms_releases_touch on public.cms_download_releases;
create trigger cms_releases_touch before update on public.cms_download_releases
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- cms_blog_posts: infrastructure for genuine future articles. Published rows
-- are publicly readable; drafts are never exposed.
-- ---------------------------------------------------------------------------
create table if not exists public.cms_blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null default '',
  description     text not null default '',
  author          text not null default 'LinkDit',
  body            text not null default '',
  cover_media_id  uuid references public.cms_media (id) on delete set null,
  cover_alt       text not null default '',
  canonical_url   text,
  seo_title       text,
  seo_description text,
  og_title        text,
  og_description  text,
  og_image        text,
  published_at    timestamptz,
  status          text not null default 'draft'
                    check (status in ('draft','submitted','in_review','approved','rejected','published','archived')),
  created_by      uuid references auth.users (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists cms_blog_status_idx on public.cms_blog_posts (status, published_at desc);

drop trigger if exists cms_blog_touch on public.cms_blog_posts;
create trigger cms_blog_touch before update on public.cms_blog_posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- cms_settings: controlled configuration. `is_secret` values are never read by
-- the public site or exposed to non-owners. AdSense/analytics IDs are public
-- by nature but still gated behind approval for changes.
-- ---------------------------------------------------------------------------
create table if not exists public.cms_settings (
  key               text primary key,
  label             text not null default '',
  "group"           text not null default 'seo'
                      check ("group" in ('analytics','ads','seo','branding','legal','security')),
  value             text not null default '',
  value_type        text not null default 'string'
                      check (value_type in ('string','boolean','number','json')),
  restricted        boolean not null default false,
  approval_category text,
  is_secret         boolean not null default false,
  updated_by        uuid references auth.users (id) on delete set null,
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- cms_submissions: the approval workflow. Status transitions happen ONLY
-- inside admin_review_submission(); clients cannot approve by updating a row.
-- ---------------------------------------------------------------------------
create table if not exists public.cms_submissions (
  id                  uuid primary key default gen_random_uuid(),
  category            text not null,
  entity_type         text not null
                        check (entity_type in ('content','download_release','blog_post','site_setting','role_change','auth_security')),
  entity_id           uuid not null,
  title               text not null default '',
  status              text not null default 'submitted'
                        check (status in ('submitted','in_review','approved','rejected','published')),
  submitted_by        uuid references auth.users (id) on delete set null,
  submitted_by_email  text,
  submitted_at        timestamptz not null default now(),
  reviewed_by         uuid references auth.users (id) on delete set null,
  reviewed_by_email   text,
  reviewed_at         timestamptz,
  decision_reason     text,
  version_id          uuid,
  diff                jsonb
);
create index if not exists cms_submissions_status_idx on public.cms_submissions (status, submitted_at desc);
create index if not exists cms_submissions_entity_idx on public.cms_submissions (entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- cms_audit_logs: append-only history. UPDATE/DELETE are blocked by trigger.
-- Never store secrets, tokens or password material here.
-- ---------------------------------------------------------------------------
create table if not exists public.cms_audit_logs (
  id                uuid primary key default gen_random_uuid(),
  actor_id          uuid references auth.users (id) on delete set null,
  actor_email       text,
  action            text not null,
  entity_type       text,
  entity_id         uuid,
  entity_key        text,
  version_id        uuid,
  approval_category text,
  decision          text,
  reason            text,
  diff              jsonb,
  created_at        timestamptz not null default now()
);
create index if not exists cms_audit_created_idx on public.cms_audit_logs (created_at desc);
create index if not exists cms_audit_entity_idx on public.cms_audit_logs (entity_type, entity_id);

-- Append-only guard.
create or replace function public.block_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'Audit logs are append-only and cannot be modified or deleted.';
end $$;

drop trigger if exists cms_audit_no_update on public.cms_audit_logs;
create trigger cms_audit_no_update before update or delete on public.cms_audit_logs
  for each row execute function public.block_audit_mutation();
