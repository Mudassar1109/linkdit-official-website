-- ===========================================================================
-- 0001_core.sql — Administrators, role-permission matrix, helper functions
-- ===========================================================================
-- Safe to run once on a fresh database. Idempotent where practical.
-- This migration defines the authoritative, protected role assignments and
-- the permission matrix used by every RLS policy and RPC function.
-- ===========================================================================

-- gen_random_uuid() is built into PostgreSQL 13+ (Supabase). No extension
-- dependency beyond that keeps this migration portable.

-- ---------------------------------------------------------------------------
-- admin_users: authoritative administrator accounts and their roles.
-- This table is NEVER publicly writable. Rows are created through the
-- bootstrap function or the owner-only admin_invite_user() RPC.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  email        text not null,
  role         text not null check (role in ('owner','administrator','editor','contributor','reviewer')),
  display_name text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create unique index if not exists admin_users_email_lower_idx on public.admin_users (lower(email));
create index if not exists admin_users_role_idx on public.admin_users (role);

-- ---------------------------------------------------------------------------
-- admin_role_permissions: the documented role-permission matrix, in the DB so
-- that both RLS and RPC functions enforce exactly the same rule set.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_role_permissions (
  role       text not null,
  permission text not null,
  primary key (role, permission)
);

insert into public.admin_role_permissions (role, permission) values
  -- Owner / Super Admin
  ('owner','dashboard.view'),('owner','content.view'),('owner','content.edit'),('owner','content.publish'),
  ('owner','design.edit'),('owner','media.view'),('owner','media.upload'),('owner','media.delete'),
  ('owner','downloads.view'),('owner','downloads.edit'),('owner','downloads.publish'),
  ('owner','blog.view'),('owner','blog.edit'),('owner','blog.publish'),
  ('owner','seo.view'),('owner','seo.edit'),('owner','analytics.view'),('owner','analytics.edit'),
  ('owner','approvals.view'),('owner','approvals.review'),('owner','users.view'),('owner','users.manage'),
  ('owner','audit.view'),('owner','settings.view'),('owner','settings.edit'),('owner','security.manage'),
  ('owner','rollback.execute'),
  -- Administrator
  ('administrator','dashboard.view'),('administrator','content.view'),('administrator','content.edit'),
  ('administrator','content.publish'),('administrator','design.edit'),('administrator','media.view'),
  ('administrator','media.upload'),('administrator','media.delete'),('administrator','downloads.view'),
  ('administrator','downloads.edit'),('administrator','blog.view'),('administrator','blog.edit'),
  ('administrator','blog.publish'),('administrator','seo.view'),('administrator','seo.edit'),
  ('administrator','analytics.view'),('administrator','approvals.view'),('administrator','audit.view'),
  ('administrator','settings.view'),('administrator','rollback.execute'),
  -- Editor
  ('editor','dashboard.view'),('editor','content.view'),('editor','content.edit'),('editor','media.view'),
  ('editor','media.upload'),('editor','downloads.view'),('editor','blog.view'),('editor','blog.edit'),
  ('editor','seo.view'),('editor','approvals.view'),
  -- Contributor
  ('contributor','dashboard.view'),('contributor','content.view'),('contributor','content.edit'),
  ('contributor','media.view'),('contributor','media.upload'),('contributor','blog.view'),
  ('contributor','blog.edit'),('contributor','approvals.view'),
  -- Reviewer
  ('reviewer','dashboard.view'),('reviewer','content.view'),('reviewer','downloads.view'),
  ('reviewer','blog.view'),('reviewer','seo.view'),('reviewer','approvals.view'),
  ('reviewer','approvals.review'),('reviewer','audit.view')
on conflict (role, permission) do nothing;

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists admin_users_touch on public.admin_users;
create trigger admin_users_touch before update on public.admin_users
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Helper functions. SECURITY DEFINER so they can read admin_users regardless
-- of the caller's RLS, but they only ever expose a boolean/role string.
-- ---------------------------------------------------------------------------
create or replace function public.current_admin_role()
returns text language sql stable security definer set search_path = public as $$
  select au.role
  from public.admin_users au
  where au.user_id = auth.uid() and au.is_active
  limit 1;
$$;

create or replace function public.is_current_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.is_active
  );
$$;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_admin_role() = 'owner', false);
$$;

create or replace function public.has_permission(perm text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.admin_users au
    join public.admin_role_permissions rp on rp.role = au.role
    where au.user_id = auth.uid()
      and au.is_active
      and rp.permission = perm
  );
$$;

grant execute on function public.current_admin_role() to authenticated, anon;
grant execute on function public.is_current_admin() to authenticated, anon;
grant execute on function public.is_owner() to authenticated, anon;
grant execute on function public.has_permission(text) to authenticated, anon;

-- ---------------------------------------------------------------------------
-- Guard trigger: only an owner may change roles or delete administrators, and
-- the final owner can never be demoted or removed. Direct SQL by the service
-- role still passes through here, so accidental lock-out is prevented.
-- ---------------------------------------------------------------------------
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

  if tg_op = 'DELETE' or (tg_op = 'UPDATE' and old.role = 'owner' and new.role <> 'owner') then
    select count(*) into owner_count from public.admin_users where role = 'owner' and is_active;
    if owner_count <= 1 then
      raise exception 'The last active owner cannot be demoted or removed.';
    end if;
  end if;

  return coalesce(new, old);
end $$;

drop trigger if exists admin_users_guard on public.admin_users;
create trigger admin_users_guard before update or delete on public.admin_users
  for each row execute function public.guard_admin_users();

-- ---------------------------------------------------------------------------
-- Bootstrap: create the FIRST owner for an existing auth user.
-- Refuses to run if an owner already exists, and can only ever create an
-- owner (never any other role). Run this once from the Supabase SQL editor
-- after creating the account in Authentication > Users.
-- ---------------------------------------------------------------------------
create or replace function public.admin_bootstrap_owner(p_email text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
begin
  if exists (select 1 from public.admin_users where role = 'owner') then
    raise exception 'An owner already exists; bootstrap is disabled.';
  end if;

  select id into v_user_id from auth.users where lower(email) = lower(p_email) limit 1;
  if v_user_id is null then
    raise exception 'No auth user found for %. Create the user first in Authentication > Users.', p_email;
  end if;

  insert into public.admin_users (user_id, email, role, display_name, is_active)
  values (v_user_id, p_email, 'owner', 'Owner', true)
  on conflict (user_id) do update set role = 'owner', is_active = true, email = excluded.email;
end $$;

-- Only trusted server contexts (service_role / postgres) should call bootstrap.
revoke all on function public.admin_bootstrap_owner(text) from public, anon, authenticated;
