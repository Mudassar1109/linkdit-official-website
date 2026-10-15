/**
 * Admin data-access layer.
 *
 * Read operations use RLS-scoped table selects. Every WRITE goes through a
 * SECURITY DEFINER database function (RPC) so the server — never the client —
 * decides authorisation, approval state, auditing and versioning. The client
 * can never mark a submission "approved" by patching a status column, because
 * status changes are only ever performed inside these functions.
 */
import { requireSupabase, BackendNotConfiguredError } from './supabase';
import type {
  AdminUser,
  AuditLogEntry,
  BlogPost,
  ContentRecord,
  ContentVersion,
  DownloadRelease,
  MediaAsset,
  PublishedContent,
  SiteSetting,
  Submission,
} from '../types';
import type { ApprovalCategory, Role } from './permissions';

function unwrap<T>(data: unknown, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  return data as T;
}

export { BackendNotConfiguredError };

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

export async function listContent(): Promise<ContentRecord[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('cms_content')
    .select('*')
    .order('section', { ascending: true })
    .order('key', { ascending: true });
  return unwrap<ContentRecord[]>(data, error);
}

export async function listContentVersions(contentId: string): Promise<ContentVersion[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('cms_content_versions')
    .select('*')
    .eq('content_id', contentId)
    .order('version_no', { ascending: false });
  return unwrap<ContentVersion[]>(data, error);
}

export interface SaveContentInput {
  key: string;
  section: string;
  classification: 'ordinary' | 'restricted';
  approval_category: ApprovalCategory | null;
  value: string;
  value_type: ContentRecord['value_type'];
}

export async function saveContentDraft(input: SaveContentInput): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_save_content', {
    p_key: input.key,
    p_section: input.section,
    p_classification: input.classification,
    p_approval_category: input.approval_category,
    p_value: input.value,
    p_value_type: input.value_type,
  });
  if (error) throw new Error(error.message);
}

export async function publishContent(
  key: string,
  versionId: string | null,
  opts: { ownerDirect?: boolean; reason?: string } = {},
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_publish_content', {
    p_key: key,
    p_version_id: versionId,
    p_owner_direct: Boolean(opts.ownerDirect),
    p_reason: opts.reason ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function rollbackContent(key: string, versionId: string, reason: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_rollback_content', {
    p_key: key,
    p_version_id: versionId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Submissions / approvals                                             */
/* ------------------------------------------------------------------ */

export async function listSubmissions(): Promise<Submission[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('cms_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });
  return unwrap<Submission[]>(data, error);
}

export async function submitForApproval(input: {
  category: ApprovalCategory;
  entity_type: Submission['entity_type'];
  entity_id: string;
  title: string;
  version_id: string | null;
  diff?: { before: unknown; after: unknown } | null;
}): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_submit_for_approval', {
    p_category: input.category,
    p_entity_type: input.entity_type,
    p_entity_id: input.entity_id,
    p_title: input.title,
    p_version_id: input.version_id,
    p_diff: input.diff ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function reviewSubmission(
  submissionId: string,
  decision: 'approved' | 'rejected',
  reason: string,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_review_submission', {
    p_submission_id: submissionId,
    p_decision: decision,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

export async function listMedia(): Promise<MediaAsset[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('cms_media')
    .select('*')
    .order('created_at', { ascending: false });
  return unwrap<MediaAsset[]>(data, error);
}

export async function uploadMedia(
  file: File,
  meta: { purpose: MediaAsset['purpose']; alt_text: string; sanitizedPath: string },
): Promise<MediaAsset> {
  const sb = requireSupabase();
  const bucket = 'cms-media';
  const { error: upErr } = await sb.storage
    .from(bucket)
    .upload(meta.sanitizedPath, file, { upsert: false, contentType: file.type });
  if (upErr) throw new Error(upErr.message);

  const { data: pub } = sb.storage.from(bucket).getPublicUrl(meta.sanitizedPath);

  const { error } = await sb.rpc('admin_register_media', {
    p_path: meta.sanitizedPath,
    p_public_url: pub?.publicUrl ?? null,
    p_alt_text: meta.alt_text,
    p_mime_type: file.type,
    p_size_bytes: file.size,
    p_purpose: meta.purpose,
  });
  if (error) throw new Error(error.message);

  return {
    id: '',
    path: meta.sanitizedPath,
    public_url: pub?.publicUrl ?? null,
    alt_text: meta.alt_text,
    mime_type: file.type,
    size_bytes: file.size,
    width: null,
    height: null,
    purpose: meta.purpose,
    status: 'draft',
    uploaded_by: null,
    created_at: new Date().toISOString(),
  };
}

export async function deleteMedia(id: string, path: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_delete_media', { p_id: id });
  if (error) throw new Error(error.message);
  const { error: sErr } = await sb.storage.from('cms-media').remove([path]);
  if (sErr) throw new Error(sErr.message);
}

export async function setMediaStatus(id: string, status: MediaAsset['status']): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_set_media_status', { p_id: id, p_status: status });
  if (error) throw new Error(error.message);
}

export async function updateMediaAlt(asset: MediaAsset, altText: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_register_media', {
    p_path: asset.path,
    p_public_url: asset.public_url,
    p_alt_text: altText,
    p_mime_type: asset.mime_type,
    p_size_bytes: asset.size_bytes,
    p_purpose: asset.purpose,
  });
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Downloads / releases                                                */
/* ------------------------------------------------------------------ */

export async function listReleases(): Promise<DownloadRelease[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('cms_download_releases')
    .select('*')
    .order('created_at', { ascending: false });
  return unwrap<DownloadRelease[]>(data, error);
}

export type ReleaseInput = Omit<
  DownloadRelease,
  'id' | 'status' | 'created_by' | 'created_at' | 'updated_at'
>;

export async function saveRelease(input: ReleaseInput): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_save_release', { p_payload: input });
  if (error) throw new Error(error.message);
}

export async function publishRelease(
  releaseId: string,
  opts: { ownerDirect?: boolean; reason?: string } = {},
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_publish_release', {
    p_release_id: releaseId,
    p_owner_direct: Boolean(opts.ownerDirect),
    p_reason: opts.reason ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function rollbackRelease(releaseId: string, reason: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_rollback_release', {
    p_release_id: releaseId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export async function listPosts(): Promise<BlogPost[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('cms_blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  return unwrap<BlogPost[]>(data, error);
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'created_by' | 'created_at' | 'updated_at'>;

export async function savePost(input: BlogPostInput): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_save_post', { p_payload: input });
  if (error) throw new Error(error.message);
}

export async function setPostPublished(postId: string, publish: boolean, reason?: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_set_post_published', {
    p_post_id: postId,
    p_publish: publish,
    p_reason: reason ?? null,
  });
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export async function listSettings(): Promise<SiteSetting[]> {
  const sb = requireSupabase();
  const { data, error } = await sb.from('cms_settings').select('*').order('group').order('key');
  return unwrap<SiteSetting[]>(data, error);
}

export async function updateSetting(
  key: string,
  value: string,
  opts: { ownerDirect?: boolean; reason?: string } = {},
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_update_setting', {
    p_key: key,
    p_value: value,
    p_owner_direct: Boolean(opts.ownerDirect),
    p_reason: opts.reason ?? null,
  });
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Administrators                                                      */
/* ------------------------------------------------------------------ */

export async function listAdminUsers(): Promise<AdminUser[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: true });
  return unwrap<AdminUser[]>(data, error);
}

export async function setUserRole(userId: string, role: Role, reason: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_set_role', {
    p_user_id: userId,
    p_role: role,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
}

export async function setUserActive(userId: string, active: boolean, reason: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_set_user_active', {
    p_user_id: userId,
    p_active: active,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
}

export async function inviteAdmin(email: string, role: Role, reason: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc('admin_invite_user', {
    p_email: email,
    p_role: role,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Audit logs                                                          */
/* ------------------------------------------------------------------ */

export async function listAuditLogs(limit = 200): Promise<AuditLogEntry[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('cms_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return unwrap<AuditLogEntry[]>(data, error);
}

/* ------------------------------------------------------------------ */
/* Public published content (called by the public site, anon key)      */
/* ------------------------------------------------------------------ */

export async function fetchPublishedContent(keys: string[]): Promise<PublishedContent[]> {
  const sb = requireSupabase();
  const { data, error } = await sb.rpc('public_published_content', { p_keys: keys });
  if (error) throw new Error(error.message);
  return (data as PublishedContent[]) ?? [];
}
