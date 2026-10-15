/**
 * Roles, permissions and the documented role-permission matrix.
 *
 * IMPORTANT: This file drives *UI visibility only*. It is a convenience layer
 * so the interface can hide controls a user cannot use. It is NOT a security
 * boundary. Every privileged operation is additionally authorised server-side
 * by Postgres Row Level Security policies and SECURITY DEFINER functions
 * (see /supabase/migrations). A user who tampers with client state still
 * cannot perform an operation the database rejects.
 */

export type Role = 'owner' | 'administrator' | 'editor' | 'contributor' | 'reviewer';

export const ROLES: Role[] = ['owner', 'administrator', 'editor', 'contributor', 'reviewer'];

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner / Super Admin',
  administrator: 'Administrator',
  editor: 'Editor',
  contributor: 'Contributor',
  reviewer: 'Reviewer',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: 'Full control, manages administrators, approves restricted changes, emergency rollback.',
  administrator: 'Manages ordinary content, media, permitted download metadata and reports.',
  editor: 'Edits and previews permitted content; submits restricted changes for approval.',
  contributor: 'Creates and edits own drafts, uploads authorised media, submits for review.',
  reviewer: 'Reviews submissions and approves or rejects eligible changes with a reason.',
};

export type Permission =
  | 'dashboard.view'
  | 'content.view'
  | 'content.edit'
  | 'content.publish'
  | 'design.edit'
  | 'media.view'
  | 'media.upload'
  | 'media.delete'
  | 'downloads.view'
  | 'downloads.edit'
  | 'downloads.publish'
  | 'blog.view'
  | 'blog.edit'
  | 'blog.publish'
  | 'seo.view'
  | 'seo.edit'
  | 'analytics.view'
  | 'analytics.edit'
  | 'approvals.view'
  | 'approvals.review'
  | 'users.view'
  | 'users.manage'
  | 'audit.view'
  | 'settings.view'
  | 'settings.edit'
  | 'security.manage'
  | 'rollback.execute';

const P: Record<Role, Permission[]> = {
  owner: [
    'dashboard.view',
    'content.view', 'content.edit', 'content.publish', 'design.edit',
    'media.view', 'media.upload', 'media.delete',
    'downloads.view', 'downloads.edit', 'downloads.publish',
    'blog.view', 'blog.edit', 'blog.publish',
    'seo.view', 'seo.edit',
    'analytics.view', 'analytics.edit',
    'approvals.view', 'approvals.review',
    'users.view', 'users.manage',
    'audit.view',
    'settings.view', 'settings.edit', 'security.manage',
    'rollback.execute',
  ],
  administrator: [
    'dashboard.view',
    'content.view', 'content.edit', 'content.publish', 'design.edit',
    'media.view', 'media.upload', 'media.delete',
    'downloads.view', 'downloads.edit',
    'blog.view', 'blog.edit', 'blog.publish',
    'seo.view', 'seo.edit',
    'analytics.view',
    'approvals.view',
    'audit.view',
    'settings.view',
    'rollback.execute',
  ],
  editor: [
    'dashboard.view',
    'content.view', 'content.edit',
    'media.view', 'media.upload',
    'downloads.view',
    'blog.view', 'blog.edit',
    'seo.view',
    'approvals.view',
  ],
  contributor: [
    'dashboard.view',
    'content.view', 'content.edit',
    'media.view', 'media.upload',
    'blog.view', 'blog.edit',
    'approvals.view',
  ],
  reviewer: [
    'dashboard.view',
    'content.view',
    'downloads.view',
    'blog.view',
    'seo.view',
    'approvals.view', 'approvals.review',
    'audit.view',
  ],
};

export const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = Object.fromEntries(
  (Object.keys(P) as Role[]).map((role) => [role, new Set(P[role])]),
) as unknown as Record<Role, ReadonlySet<Permission>>;

export function roleHasPermission(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

/** Full human-readable matrix, used by the Users page and docs. */
export function permissionMatrix(): { permission: Permission; roles: Role[] }[] {
  const all: Permission[] = [
    'dashboard.view',
    'content.view', 'content.edit', 'content.publish', 'design.edit',
    'media.view', 'media.upload', 'media.delete',
    'downloads.view', 'downloads.edit', 'downloads.publish',
    'blog.view', 'blog.edit', 'blog.publish',
    'seo.view', 'seo.edit',
    'analytics.view', 'analytics.edit',
    'approvals.view', 'approvals.review',
    'users.view', 'users.manage',
    'audit.view',
    'settings.view', 'settings.edit', 'security.manage',
    'rollback.execute',
  ];
  return all.map((permission) => ({
    permission,
    roles: ROLES.filter((r) => ROLE_PERMISSIONS[r].has(permission)),
  }));
}

/* ------------------------------------------------------------------------- */
/* Approval workflow categories                                               */
/* ------------------------------------------------------------------------- */

export type ApprovalCategory =
  | 'legal_page'
  | 'adsense_settings'
  | 'analytics_settings'
  | 'installer_release'
  | 'role_permission'
  | 'auth_security'
  | 'critical_seo';

export interface ApprovalCategoryPolicy {
  category: ApprovalCategory;
  label: string;
  restricted: true;
  /** Roles allowed to edit / submit a change in this category. */
  editorRoles: Role[];
  /** Roles allowed to approve a submission in this category. */
  approverRoles: Role[];
}

/**
 * Categories that can NEVER be published instantly: they always require a
 * recorded approval, unless an Owner performs the change directly with an
 * explicit confirmation and a recorded reason (see the RPC layer).
 */
export const APPROVAL_CATEGORIES: Record<ApprovalCategory, ApprovalCategoryPolicy> = {
  legal_page: {
    category: 'legal_page',
    label: 'Legal pages (Privacy, Terms, License, EULA, Copyright)',
    restricted: true,
    editorRoles: ['owner', 'administrator'],
    approverRoles: ['owner'],
  },
  adsense_settings: {
    category: 'adsense_settings',
    label: 'AdSense configuration & publisher ID',
    restricted: true,
    editorRoles: ['owner'],
    approverRoles: ['owner'],
  },
  analytics_settings: {
    category: 'analytics_settings',
    label: 'Analytics configuration & tracking IDs',
    restricted: true,
    editorRoles: ['owner', 'administrator'],
    approverRoles: ['owner'],
  },
  installer_release: {
    category: 'installer_release',
    label: 'Installer releases (version, size, checksum, hosting)',
    restricted: true,
    editorRoles: ['owner', 'administrator'],
    approverRoles: ['owner', 'reviewer'],
  },
  role_permission: {
    category: 'role_permission',
    label: 'Roles & permissions',
    restricted: true,
    editorRoles: ['owner'],
    approverRoles: ['owner'],
  },
  auth_security: {
    category: 'auth_security',
    label: 'Authentication & security settings',
    restricted: true,
    editorRoles: ['owner'],
    approverRoles: ['owner'],
  },
  critical_seo: {
    category: 'critical_seo',
    label: 'Critical SEO / indexing configuration (robots, sitemap, canonical, noindex)',
    restricted: true,
    editorRoles: ['owner', 'administrator'],
    approverRoles: ['owner'],
  },
};

export function canApproveCategory(role: Role | null | undefined, category: ApprovalCategory): boolean {
  if (!role) return false;
  return APPROVAL_CATEGORIES[category].approverRoles.includes(role);
}

export function canSubmitCategory(role: Role | null | undefined, category: ApprovalCategory): boolean {
  if (!role) return false;
  return APPROVAL_CATEGORIES[category].editorRoles.includes(role);
}

export function isOwner(role: Role | null | undefined): boolean {
  return role === 'owner';
}
