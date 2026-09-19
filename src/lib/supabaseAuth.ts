// Supabase-driven sign-in relay for the LinkDit Pad desktop app.
//
// The desktop generates the PKCE pair and only ever sends the *challenge*
// (never the verifier) to this page. This page simply renders a plain
// "Continue with Google" link that hands the challenge/state straight to
// Supabase Auth, which then redirects back into the app via the
// `linkditpad://auth/callback` custom scheme.

export const SUPABASE_URL = ((import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '').trim();
export const SUPABASE_ANON_KEY = ((import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '').trim();
export const DEEP_LINK_REDIRECT_URI = 'linkditpad://auth/callback';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('https://')
  );
}

export interface AuthorizeInput {
  codeChallenge: string;
  codeChallengeMethod: string;
  state: string;
}

export function buildGoogleAuthorizeUrl(input: AuthorizeInput): string {
  const params = new URLSearchParams({
    redirect_to: DEEP_LINK_REDIRECT_URI,
    response_type: 'code',
    scope: 'email profile openid',
    provider: 'google',
    flow_type: 'pkce',
    code_challenge: input.codeChallenge,
    code_challenge_method: input.codeChallengeMethod,
    state: input.state,
  });
  return `${SUPABASE_URL}/auth/v1/authorize?${params.toString()}`;
}