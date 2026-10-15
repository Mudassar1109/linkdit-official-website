import type { Role, ApprovalCategory } from './lib/permissions';

export type ContentStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'published' | 'archived';

/** An administrator account, projected from auth.users + admin_users. */
export interface AdminUser {
  user_id: string;
  email: string;
  role: Role;
  display_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** A CMS-managed content record keyed by a stable, namespaced key. */
export interface ContentRecord {
  id: string;
  /** e.g. `home.hero.title`, `page.download.summary`, `legal.privacy.body` */
  key: string;
  /** Logical grouping: 'home' | 'page' | 'legal' | 'global' | 'faq' | 'feature' ... */
  section: string;
  /** 'restricted' records always require approval before publication. */
  classification: 'ordinary' | 'restricted';
  approval_category: ApprovalCategory | null;
  value: string;
  value_type: 'text' | 'html' | 'json' | 'url';
  status: ContentStatus;
  published_version_id: string | null;
  updated_by: string | null;
  updated_at: string;
  created_at: string;
}

export interface ContentVersion {
  id: string;
  content_id: string;
  content_key: string;
  version_no: number;
  value: string;
  value_type: ContentRecord['value_type'];
  status: ContentStatus;
  created_by: string | null;
  created_at: string;
  published_at: string | null;
}

export interface MediaAsset {
  id: string;
  path: string;
  public_url: string | null;
  alt_text: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  purpose: 'logo' | 'favicon' | 'banner' | 'feature' | 'screenshot' | 'blog-cover' | 'general';
  status: 'draft' | 'published';
  uploaded_by: string | null;
  created_at: string;
}

export interface DownloadRelease {
  id: string;
  version: string;
  channel: 'stable' | 'beta' | 'legacy';
  title: string;
  release_date: string | null;
  release_notes: string;
  installer_url: string;
  filename: string;
  file_size: string;
  sha256: string;
  min_windows: string;
  format: '.exe' | '.msi' | '.msix' | '.zip';
  is_available: boolean;
  is_current: boolean;
  status: ContentStatus;
  approval_category: ApprovalCategory | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  body: string;
  cover_media_id: string | null;
  cover_alt: string;
  canonical_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  published_at: string | null;
  status: ContentStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type SettingValueType = 'string' | 'boolean' | 'number' | 'json';

export interface SiteSetting {
  key: string;
  label: string;
  group: 'analytics' | 'ads' | 'seo' | 'branding' | 'legal' | 'security';
  value: string;
  value_type: SettingValueType;
  /** restricted settings require approval unless an Owner confirms directly. */
  restricted: boolean;
  approval_category: ApprovalCategory | null;
  is_secret: boolean;
  updated_by: string | null;
  updated_at: string;
}

export interface Submission {
  id: string;
  category: ApprovalCategory;
  entity_type: 'content' | 'download_release' | 'blog_post' | 'site_setting' | 'role_change' | 'auth_security';
  entity_id: string;
  title: string;
  status: Extract<ContentStatus, 'submitted' | 'in_review' | 'approved' | 'rejected' | 'published'>;
  submitted_by: string | null;
  submitted_by_email: string | null;
  submitted_at: string;
  reviewed_by: string | null;
  reviewed_by_email: string | null;
  reviewed_at: string | null;
  decision_reason: string | null;
  version_id: string | null;
  diff: { before: unknown; after: unknown } | null;
}

export interface AuditLogEntry {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  entity_key: string | null;
  version_id: string | null;
  approval_category: ApprovalCategory | null;
  decision: string | null;
  reason: string | null;
  diff: { before: unknown; after: unknown } | null;
  created_at: string;
}

/** Shape returned by the public published-content endpoint. */
export interface PublishedContent {
  key: string;
  value: string;
  value_type: ContentRecord['value_type'];
  updated_at: string;
}
