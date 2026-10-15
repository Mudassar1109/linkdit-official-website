-- ===========================================================================
-- 0008_fixes.sql — Additive correctness fixes
-- ===========================================================================
-- 1) is_approved_download_url(): accept the site's OWN relative installer
--    locations ("/downloads/<file>"). The live download page links to
--    `/downloads/<filename>` (see src/pages/DownloadPage.tsx), so without this
--    the CMS could not manage the current release at all. Absolute URLs must
--    still be https and on an approved host.
-- 2) guard_admin_users(): also refuse to deactivate the LAST active owner,
--    preventing an accidental no-owner lock-out (previously only DELETE and
--    role demotion were protected).
-- 3) admin_set_user_active(): reject unknown administrators explicitly.
-- ===========================================================================

-- 1) ------------------------------------------------------------------------
create or replace function public.is_approved_download_url(u text)
returns boolean language plpgsql immutable as $$
declare
  host text;
  v text := btrim(coalesce(u, ''));
begin
  if length(v) = 0 then return false; end if;

  -- Site-hosted installers: relative path strictly under /downloads/ with a
  -- single filename (no subdirectories, no traversal).
  if v ~ '^/downloads/[A-Za-z0-9._-]+$' then
    return true;
  end if;

  -- Externally hosted installers must be https on an approved host.
  host := lower(regexp_replace(v, '^https://([^/:?#]+).*$', '\1'));
  if host = lower(v) then return false; end if; -- no https scheme matched
  return host in (
    'www.linkdit.online','linkdit.online','github.com',
    'objects.githubusercontent.com','github-releases.githubusercontent.com'
  );
end $$;

-- 2) ------------------------------------------------------------------------
create or replace function public.guard_admin_users()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  owner_count int;
begin
  -- Service-role / migration context (no JWT) is trusted.
  if auth.uid() is null then
    return coalesce(new, old);
  end if;

  if not public.is_owner() then
    if tg_op = 'DELETE' then
      raise exception 'Only an owner may remove administrators.';
    end if;
    if new.role is distinct from old.role then
      raise exception 'Only an owner may change administrator roles.';
    end if;
    if new.is_active is distinct from old.is_active then
      raise exception 'Only an owner may activate or deactivate administrators.';
    end if;
  end if;

  -- Protect the last active owner from being removed, demoted OR deactivated.
  if tg_op = 'DELETE'
     or (tg_op = 'UPDATE' and old.role = 'owner' and old.is_active
         and (new.role <> 'owner' or new.is_active = false)) then
    select count(*) into owner_count from public.admin_users where role = 'owner' and is_active;
    if owner_count <= 1 then
      raise exception 'The last active owner cannot be demoted, deactivated or removed.';
    end if;
  end if;

  return coalesce(new, old);
end $$;

-- 3) ------------------------------------------------------------------------
create or replace function public.admin_set_user_active(p_user_id uuid, p_active boolean, p_reason text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'Only an owner may activate or deactivate administrators.'; end if;
  if p_reason is null or length(btrim(p_reason)) = 0 then raise exception 'A reason is required.'; end if;
  if not exists (select 1 from public.admin_users where user_id = p_user_id) then
    raise exception 'Unknown administrator.';
  end if;
  update public.admin_users set is_active = p_active, updated_at = now() where user_id = p_user_id;
  perform public.write_audit('admin.active_change', 'role_change', p_user_id, null, null,
    'role_permission', case when p_active then 'active' else 'inactive' end, p_reason, null);
end $$;

revoke all on function public.admin_set_user_active(uuid,boolean,text) from public, anon;
grant execute on function public.admin_set_user_active(uuid,boolean,text) to authenticated;

-- 4) ------------------------------------------------------------------------
-- admin_delete_media(): there is intentionally NO client DELETE privilege or
-- policy on cms_media, so the UI cannot delete a media row with a table write.
-- This SECURITY DEFINER RPC performs the permission check and removes the
-- metadata row (the caller removes the Storage object separately, which is
-- gated by the cms-media DELETE storage policy).
create or replace function public.admin_delete_media(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_media public.cms_media;
begin
  if not public.has_permission('media.delete') then
    raise exception 'Not authorized to delete media.';
  end if;
  select * into v_media from public.cms_media where id = p_id;
  if not found then raise exception 'Unknown media.'; end if;
  delete from public.cms_media where id = p_id;
  perform public.write_audit('media.delete', 'media', v_media.id, v_media.path, null, null, null, null, null);
end $$;

revoke all on function public.admin_delete_media(uuid) from public, anon;
grant execute on function public.admin_delete_media(uuid) to authenticated;
