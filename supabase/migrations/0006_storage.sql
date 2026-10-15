-- ===========================================================================
-- 0006_storage.sql — Storage bucket + access policies for CMS media
-- ===========================================================================
-- A single public-read bucket holds brand and content imagery. Uploads,
-- overwrites and deletes require an authenticated administrator with the
-- media.* permission. Binary installers are intentionally NOT stored here —
-- see the release-management notes; installers keep their existing hosting.
--
-- Trade-off: objects in a public bucket are reachable by URL. Object paths
-- are randomised and only administrators can create them; unpublished assets
-- are never referenced by the public site. For stricter isolation, add a
-- second private "draft" bucket and copy objects on publish.
-- ===========================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  8388608, -- 8 MB
  array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','image/x-icon','image/vnd.microsoft.icon']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- storage.objects policies for the cms-media bucket.
-- ---------------------------------------------------------------------------
drop policy if exists cms_media_storage_read on storage.objects;
create policy cms_media_storage_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'cms-media');

drop policy if exists cms_media_storage_insert on storage.objects;
create policy cms_media_storage_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cms-media' and public.has_permission('media.upload'));

drop policy if exists cms_media_storage_update on storage.objects;
create policy cms_media_storage_update on storage.objects
  for update to authenticated
  using (bucket_id = 'cms-media' and public.has_permission('media.upload'))
  with check (bucket_id = 'cms-media' and public.has_permission('media.upload'));

drop policy if exists cms_media_storage_delete on storage.objects;
create policy cms_media_storage_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'cms-media' and public.has_permission('media.delete'));
