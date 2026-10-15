-- ===========================================================================
-- 0003_policy.sql — Approval-category policy table, decision helpers, auditing
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- approval_category_policies: which roles may submit / approve each restricted
-- category. Mirrors APPROVAL_CATEGORIES in src/admin/lib/permissions.ts.
-- ---------------------------------------------------------------------------
create table if not exists public.approval_category_policies (
  category        text primary key,
  label           text not null,
  editor_roles    text[] not null default '{}',
  approver_roles  text[] not null default '{}'
);

insert into public.approval_category_policies (category, label, editor_roles, approver_roles) values
  ('legal_page',         'Legal pages (Privacy, Terms, License, EULA, Copyright)',              array['owner','administrator'], array['owner']),
  ('adsense_settings',   'AdSense configuration & publisher ID',                                array['owner'],                 array['owner']),
  ('analytics_settings', 'Analytics configuration & tracking IDs',                              array['owner','administrator'], array['owner']),
  ('installer_release',  'Installer releases (version, size, checksum, hosting)',               array['owner','administrator'], array['owner','reviewer']),
  ('role_permission',    'Roles & permissions',                                                 array['owner'],                 array['owner']),
  ('auth_security',      'Authentication & security settings',                                  array['owner'],                 array['owner']),
  ('critical_seo',       'Critical SEO / indexing configuration',                               array['owner','administrator'], array['owner'])
on conflict (category) do nothing;

create or replace function public.can_submit_category(cat text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select public.current_admin_role() = any(p.editor_roles)
       from public.approval_category_policies p where p.category = cat),
    false);
$$;

create or replace function public.can_approve_category(cat text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select public.current_admin_role() = any(p.approver_roles)
       from public.approval_category_policies p where p.category = cat),
    false);
$$;

grant execute on function public.can_submit_category(text) to authenticated;
grant execute on function public.can_approve_category(text) to authenticated;

-- ---------------------------------------------------------------------------
-- write_audit(): central append-only audit helper. Never records secrets.
-- ---------------------------------------------------------------------------
create or replace function public.write_audit(
  p_action            text,
  p_entity_type       text default null,
  p_entity_id         uuid default null,
  p_entity_key        text default null,
  p_version_id        uuid default null,
  p_approval_category text default null,
  p_decision          text default null,
  p_reason            text default null,
  p_diff              jsonb default null
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_email text;
begin
  select email into v_email from public.admin_users where user_id = auth.uid();
  insert into public.cms_audit_logs (
    actor_id, actor_email, action, entity_type, entity_id, entity_key,
    version_id, approval_category, decision, reason, diff
  ) values (
    auth.uid(), v_email, p_action, p_entity_type, p_entity_id, p_entity_key,
    p_version_id, p_approval_category, p_decision, p_reason, p_diff
  );
end $$;

-- ---------------------------------------------------------------------------
-- validate helpers shared by the RPCs.
-- ---------------------------------------------------------------------------
create or replace function public.is_valid_slug(s text)
returns boolean language sql immutable as $$
  select s ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(s) <= 80;
$$;

create or replace function public.is_valid_sha256(s text)
returns boolean language sql immutable as $$
  select s ~ '^[A-Fa-f0-9]{64}$';
$$;

-- Approved hosts for externally hosted installers.
create or replace function public.is_approved_download_url(u text)
returns boolean language plpgsql immutable as $$
declare
  host text;
begin
  if u is null or length(u) = 0 then return false; end if;
  -- Extract host without depending on url parsing extensions.
  host := lower(regexp_replace(u, '^https?://([^/:?#]+).*$', '\1'));
  if host = lower(u) then return false; end if; -- no scheme matched
  return host in (
    'www.linkdit.online','linkdit.online','github.com',
    'objects.githubusercontent.com','github-releases.githubusercontent.com'
  );
end $$;
