/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Public (publishable) Supabase project URL. Safe to expose to the browser.
   * Example: https://xxxxxxxxxxxxxxxxxxxx.supabase.co
   */
  readonly VITE_SUPABASE_URL?: string;
  /**
   * Public (publishable / anon) Supabase key. Safe to expose to the browser
   * ONLY because Row Level Security is enabled on every table.
   * NEVER put the service_role key here.
   */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
