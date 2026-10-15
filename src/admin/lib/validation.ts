/**
 * Input validation and sanitisation helpers shared by the admin UI.
 *
 * These mirror (and do not replace) server-side validation in the database
 * functions. Client checks give fast feedback; the database is authoritative.
 */

/** Hosts allowed for externally hosted installer downloads. */
export const APPROVED_DOWNLOAD_HOSTS = [
  'www.linkdit.online',
  'linkdit.online',
  'github.com',
  'objects.githubusercontent.com',
  'github-releases.githubusercontent.com',
] as const;

const SAFE_PROTOCOLS = new Set(['http:', 'https:']);

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

/** A URL is only accepted when it is http(s) and on an approved host. */
export function validateExternalUrl(
  raw: string,
  opts: { allowRelative?: boolean; hosts?: readonly string[] } = {},
): ValidationResult {
  const value = raw.trim();
  if (!value) return { ok: false, error: 'URL is required.' };

  if (opts.allowRelative && value.startsWith('/')) {
    // Only same-site rooted paths; reject protocol-relative and traversal.
    if (value.startsWith('//')) return { ok: false, error: 'Protocol-relative URLs are not allowed.' };
    if (value.includes('..')) return { ok: false, error: 'Path traversal is not allowed.' };
    return { ok: true };
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, error: 'Enter a valid absolute URL.' };
  }
  if (!SAFE_PROTOCOLS.has(parsed.protocol)) {
    return { ok: false, error: 'Only http and https URLs are allowed.' };
  }
  const hosts = opts.hosts ?? APPROVED_DOWNLOAD_HOSTS;
  if (!hosts.includes(parsed.hostname)) {
    return { ok: false, error: `Host "${parsed.hostname}" is not on the approved list.` };
  }
  return { ok: true };
}

/** URL-safe slug: lowercase alphanumerics and single hyphens. */
export function validateSlug(raw: string): ValidationResult {
  const value = raw.trim();
  if (!value) return { ok: false, error: 'Slug is required.' };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return { ok: false, error: 'Use lowercase letters, numbers and single hyphens only.' };
  }
  if (value.length > 80) return { ok: false, error: 'Slug is too long (max 80).' };
  return { ok: true };
}

/** 64 hex characters (with or without surrounding whitespace). */
export function validateSha256(raw: string): ValidationResult {
  const value = raw.trim();
  if (!/^[a-fA-F0-9]{64}$/.test(value)) {
    return { ok: false, error: 'SHA-256 must be exactly 64 hexadecimal characters.' };
  }
  return { ok: true };
}

const IMAGE_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
};

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

/**
 * Validate an image upload. Executables and unsupported formats are rejected.
 * SVG is allowed for logo/favicon only and is treated as untrusted markup.
 */
export function validateImageFile(file: File, opts: { allowSvg?: boolean } = {}): ValidationResult {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) {
    return { ok: false, error: `Unsupported image type "${file.type || 'unknown'}".` };
  }
  if (ext === 'svg' && !opts.allowSvg) {
    return { ok: false, error: 'SVG uploads are not allowed for this asset.' };
  }
  if (file.size <= 0) return { ok: false, error: 'File is empty.' };
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'Image exceeds the 8 MB limit.' };
  }
  return { ok: true };
}

/** Strip directories and unsafe characters so a filename is storage-safe. */
export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  const cleaned = base
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+/, '')
    .slice(0, 120);
  return cleaned || 'file';
}

/** Convert a title to a candidate slug (still run validateSlug afterwards). */
export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

/* ------------------------------------------------------------------------- */
/* Rich text sanitisation (defence-in-depth, mirrors server allowlist)        */
/* ------------------------------------------------------------------------- */

/**
 * Very small allowlist sanitiser for the constrained rich-text fields the CMS
 * exposes (banners, simple legal/description bodies). It intentionally drops
 * every element and attribute that could execute script. Real publication is
 * still sanitised server-side; this prevents obviously unsafe HTML from being
 * previewed in the admin UI.
 */
export function sanitizeBasicHtml(input: string): string {
  if (!input) return '';
  let html = input;

  // Remove script/style/iframe/object/embed blocks entirely.
  html = html.replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  html = html.replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*\/?>/gi, '');

  // Drop inline event handlers and javascript: URLs.
  html = html.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
  html = html.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
  html = html.replace(/\son\w+\s*=\s*[^\s>]+/gi, '');
  html = html.replace(/(href|src)\s*=\s*"(?:\s*javascript:)[^"]*"/gi, '$1="#"');
  html = html.replace(/(href|src)\s*=\s*'(?:\s*javascript:)[^']*'/gi, "$1='#'");

  return html;
}

/** True when a field looks like it contains markup we should not store raw. */
export function containsDangerousMarkup(input: string): boolean {
  return /<\s*(script|iframe|object|embed|style|link|meta)|\son\w+\s*=/i.test(input);
}
