export function env(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function firstEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = env(name);
    if (value) return value;
  }
  return undefined;
}

export function supabaseUrl(): string | undefined {
  return firstEnv('SUPABASE_URL', 'VITE_SUPABASE_URL');
}

export function supabaseAnonKey(): string | undefined {
  return firstEnv('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');
}

export function serviceRoleKey(): string | undefined {
  return env('SUPABASE_SERVICE_ROLE_KEY');
}

export function siteUrl(): string {
  const configured = firstEnv('APP_URL', 'SITE_URL', 'PUBLIC_SITE_URL') ?? 'https://www.typodocs.online';
  return configured.replace(/\/+$/, '');
}

export function isProduction(): boolean {
  return env('VERCEL_ENV') === 'production' || env('NODE_ENV') === 'production';
}
