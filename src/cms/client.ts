import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Public-site Supabase access.
 *
 * This module is deliberately isolated from the admin client. The public site
 * must stay lean and must work with zero configuration, so:
 *
 * - `@supabase/supabase-js` is imported **dynamically** (value import). It is
 *   therefore emitted as its own chunk and is NEVER downloaded on public pages
 *   unless the CMS is configured *and* something actually requests content.
 *   The `import type` above is erased at build time.
 * - Only the publishable (anon) key is read. Never the service_role key.
 * - When the two VITE_SUPABASE_* variables are absent, `isCmsConfigured` is
 *   false, `getCmsClient()` resolves to `null`, and every consumer transparently
 *   falls back to the static content baked into the site.
 */
const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isCmsConfigured = Boolean(url && anonKey);

let cached: Promise<SupabaseClient | null> | null = null;

/** Lazily create (once) a read-only client, or resolve to null if unconfigured. */
export function getCmsClient(): Promise<SupabaseClient | null> {
  if (!isCmsConfigured) return Promise.resolve(null);
  if (!cached) {
    cached = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url as string, anonKey as string, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      }),
    );
  }
  return cached;
}

export interface CmsContentRow {
  key: string;
  value: string;
  value_type: 'text' | 'html' | 'json' | 'url';
  updated_at: string;
}

export interface CmsSettingRow {
  key: string;
  value: string;
  value_type: 'string' | 'boolean' | 'number' | 'json';
}

/** Fetch published content for a known set of keys. Returns [] when unconfigured. */
export async function fetchCmsContent(keys: string[]): Promise<CmsContentRow[]> {
  if (!isCmsConfigured || keys.length === 0) return [];
  const client = await getCmsClient();
  if (!client) return [];
  const { data, error } = await client.rpc('public_published_content', { p_keys: keys });
  if (error) return [];
  return (data as CmsContentRow[]) ?? [];
}

/** Fetch non-secret, publicly-readable settings. Returns [] when unconfigured. */
export async function fetchCmsSettings(): Promise<CmsSettingRow[]> {
  if (!isCmsConfigured) return [];
  const client = await getCmsClient();
  if (!client) return [];
  const { data, error } = await client.rpc('public_site_settings');
  if (error) return [];
  return (data as CmsSettingRow[]) ?? [];
}
