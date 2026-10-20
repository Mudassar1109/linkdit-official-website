-- ===========================================================================
-- 0005_functions.sql — Authoritative, server-side privileged operations
-- ===========================================================================
-- Every function is SECURITY DEFINER and performs its OWN permission checks.
-- The client cannot bypass approval by writing a status column, because no
-- client write policies exist and, for example, admin_review_submission()
-- refuses self-approval and checks can_approve_category() server-side.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- CONTENT: save a draft (creates an immutable version + audit entry)
-- ---------------------------------------------------------------------------
create or replace function public.admin_save_content(
  p_key text,
  p_section text,
  p_classification text,
  p_approval_category text,
  p_value text,
  p_value_type text
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_before text;
  v_id uuid;
  v_next int;
  v_version_id uuid;
begin
  if not public.has_permission('content.edit') then
    raise exception 'Not authorized to edit content.';
  end if;
  if p_key is null or p_key !~ '^[a-z0-9_.-]{1,120}$' then
    raise exception 'Invalid content key.';
  end if;
  if p_value_type not in ('text','html','json','url') then
    raise exception 'Invalid value type.';
  end if;
  if p_classification not in ('ordinary','restricted') then
    raise exception 'Invalid classification.';
  end if;
  if p_classification = 'restricted'
     and (p_approval_category is null or not public.can_submit_category(p_approval_category)) then
    raise exception 'You may not submit this restricted category.';
  end if;

  select value into v_before from public.cms_content where key = p_key;

  insert into public.cms_content (key, section, classification, approval_category, value, value_type, status, updated_by)
  values (p_key, coalesce(p_section,'general'), p_classification, p_approval_category, coalesce(p_value,''), p_value_type, 'draft', auth.uid())
  on conflict (key) do update set
    section = excluded.section,
    classification = excluded.classification,
    approval_category = excluded.approval_category,
    value = excluded.value,
    value_type = excluded.value_type,
    status = case when public.cms_content.status = 'published' then 'draft' else public.cms_content.status end,
    updated_by = auth.uid(),
    updated_at = now()
  returning id into v_id;

  select coalesce(max(version_no),0) + 1 into v_next
    from public.cms_content_versions where content_id = v_id;

  insert into public.cms_content_versions (content_id, content_key, version_no, value, value_type, status, created_by)
  values (v_id, p_key, v_next, coalesce(p_value,''), p_value_type, 'draft', auth.uid())
  returning id into v_version_id;

  perform public.write_audit('content.save', 'content', v_id, p_key, v_version_id,
    p_approval_category, null, null,
    jsonb_build_object('before', v_before, 'after', p_value));
end $$;

-- ---------------------------------------------------------------------------
-- CONTENT: publish (ordinary instantly; restricted requires approval or an
-- explicit, reasoned owner override)
-- ---------------------------------------------------------------------------
create or replace function public.admin_publish_content(
  p_key text,
  p_version_id uuid,
  p_owner_direct boolean,
  p_reason text
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_content public.cms_content;
  v_ver public.cms_content_versions;
begin
  if not public.has_permission('content.publish') then
    raise exception 'Not authorized to publish content.';
  end if;

  select * into v_content from public.cms_content where key = p_key;
  if not found then raise exception 'Unknown content key.'; end if;

  if p_version_id is not null then
    select * into v_ver from public.cms_content_versions
      where id = p_version_id and content_id = v_content.id;
  else
    select * into v_ver from public.cms_content_versions
      where content_id = v_content.id order by version_no desc limit 1;
  end if;
  if v_ver.id is null then raise exception 'No version available to publish.'; end if;

  if v_content.classification = 'restricted' then
    if p_owner_direct then
      if not public.is_owner() then
        raise exception 'Only an owner may publish restricted content directly.';
      end if;
      if p_reason is null or length(btrim(p_reason)) = 0 then
        raise exception 'A reason is required for a direct restricted publication.';
      end if;
    else
      if not exists (
        select 1 from public.cms_submissions
        where entity_type = 'content' and entity_id = v_content.id
          and category = coalesce(v_content.approval_category, 'legal_page')
          and status = 'approved'
      ) then
        raise exception 'This restricted change requires an approved submission.';
      end if;
    end if;
  end if;

  update public.cms_content
    set value = v_ver.value, value_type = v_ver.value_type, status = 'published',
        published_version_id = v_ver.id, updated_by = auth.uid(), updated_at = now()
    where id = v_content.id;

  update public.cms_content_versions
    set status = 'published', published_at = now()
    where id = v_ver.id;

  update public.cms_submissions set status = 'published'
    where entity_type = 'content' and entity_id = v_content.id and status = 'approved';

  perform public.write_audit('content.publish', 'content', v_content.id, p_key, v_ver.id,
    v_content.approval_category, 'published', p_reason,
    jsonb_build_object('before', v_content.value, 'after', v_ver.value));
end $$;

-- ---------------------------------------------------------------------------
-- CONTENT: rollback to a previous version (creates a new published version)
-- ---------------------------------------------------------------------------
create or replace function public.admin_rollback_content(
  p_key text,
  p_version_id uuid,
  p_reason text
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_content public.cms_content;
  v_ver public.cms_content_versions;
  v_next int;
  v_new_id uuid;
begin
  if not public.has_permission('rollback.execute') then
    raise exception 'Not authorized to roll back content.';
  end if;
  if p_reason is null or length(btrim(p_reason)) = 0 then
    raise exception 'A reason is required to roll back.';
  end if;

  select * into v_content from public.cms_content where key = p_key;
  if not found then raise exception 'Unknown content key.'; end if;
  select * into v_ver from public.cms_content_versions
    where id = p_version_id and content_id = v_content.id;
  if not found then raise exception 'Unknown version.'; end if;

  select coalesce(max(version_no),0) + 1 into v_next
    from public.cms_content_versions where content_id = v_content.id;

  insert into public.cms_content_versions (content_id, content_key, version_no, value, value_type, status, created_by, published_at)
  values (v_content.id, p_key, v_next, v_ver.value, v_ver.value_type, 'published', auth.uid(), now())
  returning id into v_new_id;

  update public.cms_content
    set value = v_ver.value, value_type = v_ver.value_type, status = 'published',
        published_version_id = v_new_id, updated_by = auth.uid(), updated_at = now()
    where id = v_content.id;

  perform public.write_audit('content.rollback', 'content', v_content.id, p_key, v_new_id,
    v_content.approval_category, 'published', p_reason,
    jsonb_build_object('before', v_content.value, 'after', v_ver.value));
end $$;

-- ---------------------------------------------------------------------------
-- APPROVALS: submit for approval
-- ---------------------------------------------------------------------------
create or replace function public.admin_submit_for_approval(
  p_category text,
  p_entity_type text,
  p_entity_id uuid,
  p_title text,
  p_version_id uuid,
  p_diff jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
  v_email text;
begin
  if not public.can_submit_category(p_category) then
    raise exception 'You may not submit for this category.';
  end if;
  if p_entity_type not in ('content','download_release','blog_post','site_setting','role_change','auth_security') then
    raise exception 'Invalid entity type.';
  end if;

  select email into v_email from public.admin_users where user_id = auth.uid();

  insert into public.cms_submissions
    (category, entity_type, entity_id, title, status, submitted_by, submitted_by_email, version_id, diff)
  values
    (p_category, p_entity_type, p_entity_id, coalesce(p_title,''), 'submitted', auth.uid(), v_email, p_version_id, p_diff)
  returning id into v_id;

  if p_entity_type = 'content' then
    update public.cms_content set status = 'submitted', updated_at = now() where id = p_entity_id;
  elsif p_entity_type = 'download_release' then
    update public.cms_download_releases set status = 'submitted', updated_at = now() where id = p_entity_id;
  end if;

  perform public.write_audit('approval.submit', p_entity_type, p_entity_id, null, p_version_id,
    p_category, 'submitted', null, p_diff);
  return v_id;
end $$;

-- ---------------------------------------------------------------------------
-- APPROVALS: review (approve / reject). No self-approval. Server-side only.
-- ---------------------------------------------------------------------------
create or replace function public.admin_review_submission(
  p_submission_id uuid,
  p_decision text,
  p_reason text
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_sub public.cms_submissions;
  v_email text;
begin
  select * into v_sub from public.cms_submissions where id = p_submission_id;
  if not found then raise exception 'Unknown submission.'; end if;

  if not public.can_approve_category(v_sub.category) then
    raise exception 'You are not authorized to review this category.';
  end if;
  if v_sub.submitted_by = auth.uid() then
    raise exception 'You cannot review your own submission.';
  end if;
  if v_sub.status not in ('submitted','in_review') then
    raise exception 'This submission has already been decided.';
  end if;
  if p_decision not in ('approved','rejected') then
    raise exception 'Decision must be approved or rejected.';
  end if;
  if p_decision = 'rejected' and (p_reason is null or length(btrim(p_reason)) = 0) then
    raise exception 'A reason is required when rejecting.';
  end if;

  select email into v_email from public.admin_users where user_id = auth.uid();

  update public.cms_submissions
    set status = p_decision, reviewed_by = auth.uid(), reviewed_by_email = v_email,
        reviewed_at = now(), decision_reason = p_reason
    where id = p_submission_id;

  if v_sub.entity_type = 'content' then
    update public.cms_content set status = p_decision, updated_at = now() where id = v_sub.entity_id;
  elsif v_sub.entity_type = 'download_release' then
    update public.cms_download_releases set status = p_decision, updated_at = now() where id = v_sub.entity_id;
  end if;

  perform public.write_audit('approval.review', v_sub.entity_type, v_sub.entity_id, null,
    v_sub.version_id, v_sub.category, p_decision, p_reason, null);
end $$;

-- ---------------------------------------------------------------------------
-- RELEASES
-- ---------------------------------------------------------------------------
create or replace function public.admin_save_release(p_payload jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_version text := p_payload->>'version';
  v_channel text := coalesce(p_payload->>'channel','stable');
  v_url text := p_payload->>'installer_url';
  v_sha text := p_payload->>'sha256';
  v_format text := coalesce(p_payload->>'format','.exe');
  v_id uuid;
begin
  if not public.has_permission('downloads.edit') then
    raise exception 'Not authorized to edit releases.';
  end if;
  if v_version is null or length(btrim(v_version)) = 0 then raise exception 'Version is required.'; end if;
  if v_channel not in ('stable','beta','legacy') then raise exception 'Invalid channel.'; end if;
  if v_format not in ('.exe','.msi','.msix','.zip') then raise exception 'Invalid format.'; end if;
  if not public.is_approved_download_url(v_url) then
    raise exception 'Installer URL must use https on an approved host.';
  end if;
  if not public.is_valid_sha256(v_sha) then
    raise exception 'SHA-256 must be 64 hexadecimal characters.';
  end if;

  insert into public.cms_download_releases
    (version, channel, title, release_date, release_notes, installer_url, filename,
     file_size, sha256, min_windows, format, is_available, is_current, status, created_by)
  values
    (v_version, v_channel, coalesce(p_payload->>'title',''), nullif(p_payload->>'release_date','')::date,
     coalesce(p_payload->>'release_notes',''), v_url, coalesce(p_payload->>'filename',''),
     coalesce(p_payload->>'file_size',''), v_sha, coalesce(p_payload->>'min_windows','Windows 10/11 (64-bit)'),
     v_format, false, false, 'draft', auth.uid())
  on conflict (channel, version) do update set
    title = excluded.title, release_date = excluded.release_date, release_notes = excluded.release_notes,
    installer_url = excluded.installer_url, filename = excluded.filename, file_size = excluded.file_size,
    sha256 = excluded.sha256, min_windows = excluded.min_windows, format = excluded.format,
    status = 'draft', updated_at = now()
  returning id into v_id;

  perform public.write_audit('release.save', 'download_release', v_id, v_version, null,
    'installer_release', null, null, jsonb_build_object('after', p_payload));
  return v_id;
end $$;

create or replace function public.admin_publish_release(
  p_release_id uuid,
  p_owner_direct boolean,
  p_reason text
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_rel public.cms_download_releases;
begin
  if not public.has_permission('downloads.publish') and not public.can_approve_category('installer_release') then
    raise exception 'Not authorized to publish releases.';
  end if;

  select * into v_rel from public.cms_download_releases where id = p_release_id;
  if not found then raise exception 'Unknown release.'; end if;

  if p_owner_direct then
    if not public.is_owner() then raise exception 'Only an owner may publish a release directly.'; end if;
    if p_reason is null or length(btrim(p_reason)) = 0 then
      raise exception 'A reason is required for a direct release publication.';
    end if;
  else
    if v_rel.status <> 'approved' then
      raise exception 'This release must be approved before publishing.';
    end if;
  end if;

  -- Roll the "current" pointer within the channel.
  update public.cms_download_releases
    set is_current = false
    where channel = v_rel.channel and id <> v_rel.id;

  update public.cms_download_releases
    set status = 'published', is_available = true, is_current = true, updated_at = now()
    where id = v_rel.id;

  update public.cms_submissions set status = 'published'
    where entity_type = 'download_release' and entity_id = v_rel.id and status = 'approved';

  perform public.write_audit('release.publish', 'download_release', v_rel.id, v_rel.version, null,
    'installer_release', 'published', p_reason, null);
end $$;

create or replace function public.admin_rollback_release(
  p_release_id uuid,
  p_reason text
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_rel public.cms_download_releases;
begin
  if not public.has_permission('rollback.execute') then
    raise exception 'Not authorized to roll back releases.';
  end if;
  if p_reason is null or length(btrim(p_reason)) = 0 then
    raise exception 'A reason is required to roll back.';
  end if;
  select * into v_rel from public.cms_download_releases where id = p_release_id;
  if not found then raise exception 'Unknown release.'; end if;

  update public.cms_download_releases set is_current = false where channel = v_rel.channel;
  update public.cms_download_releases set is_current = true, updated_at = now() where id = v_rel.id;

  perform public.write_audit('release.rollback', 'download_release', v_rel.id, v_rel.version, null,
    'installer_release', 'published', p_reason, null);
end $$;

-- ---------------------------------------------------------------------------
-- BLOG
-- ---------------------------------------------------------------------------
create or replace function public.admin_save_post(p_payload jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_slug text := p_payload->>'slug';
  v_id uuid;
begin
  if not public.has_permission('blog.edit') then raise exception 'Not authorized to edit posts.'; end if;
  if v_slug is null or not public.is_valid_slug(v_slug) then
    raise exception 'Slug must be lowercase letters, numbers and single hyphens.';
  end if;

  insert into public.cms_blog_posts
    (slug, title, description, author, body, cover_media_id, cover_alt, canonical_url,
     seo_title, seo_description, og_title, og_description, og_image, status, created_by)
  values
    (v_slug, coalesce(p_payload->>'title',''), coalesce(p_payload->>'description',''),
     coalesce(p_payload->>'author','Typodocs'), coalesce(p_payload->>'body',''),
     nullif(p_payload->>'cover_media_id','')::uuid, coalesce(p_payload->>'cover_alt',''),
     nullif(p_payload->>'canonical_url',''), nullif(p_payload->>'seo_title',''),
     nullif(p_payload->>'seo_description',''), nullif(p_payload->>'og_title',''),
     nullif(p_payload->>'og_description',''), nullif(p_payload->>'og_image',''), 'draft', auth.uid())
  on conflict (slug) do update set
    title = excluded.title, description = excluded.description, author = excluded.author,
    body = excluded.body, cover_media_id = excluded.cover_media_id, cover_alt = excluded.cover_alt,
    canonical_url = excluded.canonical_url, seo_title = excluded.seo_title,
    seo_description = excluded.seo_description, og_title = excluded.og_title,
    og_description = excluded.og_description, og_image = excluded.og_image, updated_at = now()
  returning id into v_id;

  perform public.write_audit('post.save', 'blog_post', v_id, v_slug, null, null, null, null,
    jsonb_build_object('after', p_payload));
  return v_id;
end $$;

create or replace function public.admin_set_post_published(
  p_post_id uuid,
  p_publish boolean,
  p_reason text
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_post public.cms_blog_posts;
begin
  if not public.has_permission('blog.publish') then raise exception 'Not authorized to publish posts.'; end if;
  select * into v_post from public.cms_blog_posts where id = p_post_id;
  if not found then raise exception 'Unknown post.'; end if;

  update public.cms_blog_posts
    set status = case when p_publish then 'published' else 'draft' end,
        published_at = case when p_publish then coalesce(published_at, now()) else null end,
        updated_at = now()
    where id = p_post_id;

  perform public.write_audit(case when p_publish then 'post.publish' else 'post.unpublish' end,
    'blog_post', v_post.id, v_post.slug, null, null, null, p_reason, null);
end $$;

-- ---------------------------------------------------------------------------
-- SETTINGS (restricted settings: owner confirmation + reason required)
-- ---------------------------------------------------------------------------
create or replace function public.admin_update_setting(
  p_key text,
  p_value text,
  p_owner_direct boolean,
  p_reason text
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_set public.cms_settings;
  v_entity uuid := md5(p_key)::uuid;
begin
  if not public.has_permission('settings.edit') then
    raise exception 'Not authorized to edit settings.';
  end if;

  select * into v_set from public.cms_settings where key = p_key;
  if not found then raise exception 'Unknown setting.'; end if;

  if v_set.restricted then
    if p_owner_direct then
      if not public.is_owner() then raise exception 'Only an owner may change this setting directly.'; end if;
      if p_reason is null or length(btrim(p_reason)) = 0 then
        raise exception 'A reason is required for this change.';
      end if;
    else
      if not exists (
        select 1 from public.cms_submissions
        where entity_type = 'site_setting' and entity_id = v_entity
          and category = coalesce(v_set.approval_category,'critical_seo') and status = 'approved'
      ) then
        raise exception 'This setting is restricted and requires approval or an owner override.';
      end if;
    end if;
  end if;

  update public.cms_settings
    set value = p_value, updated_by = auth.uid(), updated_at = now()
    where key = p_key;

  perform public.write_audit('setting.update', 'site_setting', v_entity, p_key, null,
    v_set.approval_category, null, p_reason,
    jsonb_build_object('before', case when v_set.is_secret then '***' else v_set.value end,
                       'after',  case when v_set.is_secret then '***' else p_value end));
end $$;

-- ---------------------------------------------------------------------------
-- MEDIA
-- ---------------------------------------------------------------------------
create or replace function public.admin_register_media(
  p_path text, p_public_url text, p_alt_text text, p_mime_type text, p_size_bytes bigint, p_purpose text
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not public.has_permission('media.upload') then raise exception 'Not authorized to upload media.'; end if;
  if p_path is null or p_path !~ '^[A-Za-z0-9/_.-]{1,200}$' then raise exception 'Invalid storage path.'; end if;
  if p_purpose not in ('logo','favicon','banner','feature','screenshot','blog-cover','general') then
    raise exception 'Invalid media purpose.';
  end if;

  insert into public.cms_media (path, public_url, alt_text, mime_type, size_bytes, purpose, status, uploaded_by)
  values (p_path, p_public_url, coalesce(p_alt_text,''), p_mime_type, greatest(coalesce(p_size_bytes,0),0),
          p_purpose, 'published', auth.uid())
  on conflict (path) do update set
    public_url = excluded.public_url, alt_text = excluded.alt_text, mime_type = excluded.mime_type,
    size_bytes = excluded.size_bytes, purpose = excluded.purpose
  returning id into v_id;

  perform public.write_audit('media.register', 'media', v_id, p_path, null, null, null, null, null);
  return v_id;
end $$;

create or replace function public.admin_set_media_status(p_id uuid, p_status text)
returns void language plpgsql security definer set search_path = public as $$
declare v_media public.cms_media;
begin
  if not public.has_permission('media.upload') then raise exception 'Not authorized.'; end if;
  if p_status not in ('draft','published','archived') then raise exception 'Invalid status.'; end if;
  select * into v_media from public.cms_media where id = p_id;
  if not found then raise exception 'Unknown media.'; end if;
  update public.cms_media set status = p_status where id = p_id;
  perform public.write_audit('media.status', 'media', v_media.id, v_media.path, null, null, p_status, null, null);
end $$;

-- ---------------------------------------------------------------------------
-- ADMINISTRATORS (owner-only)
-- ---------------------------------------------------------------------------
create or replace function public.admin_set_role(p_user_id uuid, p_role text, p_reason text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'Only an owner may change roles.'; end if;
  if p_role not in ('owner','administrator','editor','contributor','reviewer') then
    raise exception 'Invalid role.';
  end if;
  if p_reason is null or length(btrim(p_reason)) = 0 then
    raise exception 'A reason is required for a role change.';
  end if;
  if not exists (select 1 from public.admin_users where user_id = p_user_id) then
    raise exception 'Unknown administrator.';
  end if;

  update public.admin_users set role = p_role, updated_at = now() where user_id = p_user_id;
  perform public.write_audit('admin.role_change', 'role_change', p_user_id, null, null,
    'role_permission', p_role, p_reason, null);
end $$;

create or replace function public.admin_set_user_active(p_user_id uuid, p_active boolean, p_reason text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'Only an owner may activate or deactivate administrators.'; end if;
  if p_reason is null or length(btrim(p_reason)) = 0 then raise exception 'A reason is required.'; end if;
  update public.admin_users set is_active = p_active, updated_at = now() where user_id = p_user_id;
  perform public.write_audit('admin.active_change', 'role_change', p_user_id, null, null,
    'role_permission', case when p_active then 'active' else 'inactive' end, p_reason, null);
end $$;

create or replace function public.admin_invite_user(p_email text, p_role text, p_reason text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  if not public.is_owner() then raise exception 'Only an owner may add administrators.'; end if;
  if p_role not in ('owner','administrator','editor','contributor','reviewer') then
    raise exception 'Invalid role.';
  end if;
  if p_reason is null or length(btrim(p_reason)) = 0 then raise exception 'A reason is required.'; end if;

  select id into v_user_id from auth.users where lower(email) = lower(p_email) limit 1;
  if v_user_id is null then
    raise exception 'No auth user exists for that email. Create the account first (no public signup).';
  end if;

  insert into public.admin_users (user_id, email, role, display_name, is_active)
  values (v_user_id, p_email, p_role, null, true)
  on conflict (user_id) do update set role = excluded.role, is_active = true, updated_at = now();

  perform public.write_audit('admin.invite', 'role_change', v_user_id, p_email, null,
    'role_permission', p_role, p_reason, null);
  return v_user_id;
end $$;

-- ---------------------------------------------------------------------------
-- PUBLIC READ ENDPOINTS (published, non-secret content only)
-- ---------------------------------------------------------------------------
drop function if exists public.public_published_content(text[]);
create function public.public_published_content(p_keys text[])
returns table (key text, value text, value_type text, updated_at timestamptz)
language sql stable security definer set search_path = public as $$
  select c.key, c.value, c.value_type, c.updated_at
  from public.cms_content c
  where c.status = 'published' and c.key = any(p_keys);
$$;

drop function if exists public.public_site_settings();
create function public.public_site_settings()
returns table (key text, value text, value_type text)
language sql stable security definer set search_path = public as $$
  select s.key, s.value, s.value_type
  from public.cms_settings s
  where s.is_secret = false and s."group" in ('analytics','ads','seo','branding');
$$;

grant execute on function public.public_published_content(text[]) to anon, authenticated;
grant execute on function public.public_site_settings() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Lock down the administrative RPCs to authenticated users only.
-- (Functions still verify permissions internally.)
-- ---------------------------------------------------------------------------
do $$
declare fn text;
begin
  foreach fn in array array[
    'admin_save_content(text,text,text,text,text,text)',
    'admin_publish_content(text,uuid,boolean,text)',
    'admin_rollback_content(text,uuid,text)',
    'admin_submit_for_approval(text,text,uuid,text,uuid,jsonb)',
    'admin_review_submission(uuid,text,text)',
    'admin_save_release(jsonb)',
    'admin_publish_release(uuid,boolean,text)',
    'admin_rollback_release(uuid,text)',
    'admin_save_post(jsonb)',
    'admin_set_post_published(uuid,boolean,text)',
    'admin_update_setting(text,text,boolean,text)',
    'admin_register_media(text,text,text,text,bigint,text)',
    'admin_set_media_status(uuid,text)',
    'admin_set_role(uuid,text,text)',
    'admin_set_user_active(uuid,boolean,text)',
    'admin_invite_user(text,text,text)'
  ] loop
    execute format('revoke all on function public.%s from public, anon', fn);
    execute format('grant execute on function public.%s to authenticated', fn);
  end loop;
end $$;
