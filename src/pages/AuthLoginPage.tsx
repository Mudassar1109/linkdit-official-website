import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, ShieldCheck, TriangleAlert } from 'lucide-react';
import {
  buildGoogleAuthorizeUrl,
  DEEP_LINK_REDIRECT_URI,
  isSupabaseConfigured,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from '../lib/supabaseAuth';
import { APP_NAME, PRODUCT_NAME, SITE_URL } from '../config';

export const AuthLoginPage: React.FC = () => {
  const [codeChallenge, setCodeChallenge] = useState<string | null>(null);
  const [codeChallengeMethod, setCodeChallengeMethod] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [returnedCode, setReturnedCode] = useState<string | null>(null);
  const [returnedState, setReturnedState] = useState<string | null>(null);
  const [returnedError, setReturnedError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Sign in — ${PRODUCT_NAME}`;
    const params = new URLSearchParams(window.location.search);
    setCodeChallenge(params.get('code_challenge'));
    setCodeChallengeMethod(params.get('code_challenge_method'));
    setState(params.get('state'));
    setSource(params.get('from'));
    setReturnedCode(params.get('code'));
    setReturnedState(params.get('state'));
    setReturnedError(params.get('error') ? params.get('error_description') ?? params.get('error') : null);
  }, []);

  const ready =
    Boolean(codeChallenge) &&
    Boolean(state) &&
    isSupabaseConfigured();

  const authorizeUrl =
    ready && codeChallenge && state
      ? buildGoogleAuthorizeUrl({
          codeChallenge,
          codeChallengeMethod: codeChallengeMethod || 'S256',
          state,
        })
      : null;

  return (
    <div className="min-h-screen bg-paper dark:bg-ink-950 text-ink dark:text-paper flex items-center justify-center px-4 font-sans">
      <section className="w-full max-w-md text-center space-y-6">
        <div className="w-14 h-14 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-ink-850 text-accent-deep dark:text-blue-300 flex items-center justify-center mx-auto shadow-sm">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/45">
            {APP_NAME} · Desktop sign-in
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Sign in to {PRODUCT_NAME}
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper/60">
            Authenticate with your Google account to link this desktop device.
            Your documents stay local either way.
          </p>
        </div>

        {returnedError && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-left flex items-start gap-2.5">
            <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-danger" />
            <div className="text-sm">
              <p className="font-medium">Google couldn't complete the sign-in</p>
              <p className="text-ink-soft dark:text-paper/60">{returnedError}</p>
            </div>
          </div>
        )}

        {(returnedCode || returnedError) && !ready && (
          <div className="rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-ink-850 px-4 py-3 text-left text-sm space-y-2">
            <p className="text-ink-soft dark:text-paper/60">
              Your browser redirected back here instead of into the desktop app. This usually means
              the <code className="font-mono text-xs">{DEEP_LINK_REDIRECT_URI}</code> handler is not
              registered on this device.
            </p>
            {returnedCode && (
              <a
                href={`${DEEP_LINK_REDIRECT_URI}?code=${encodeURIComponent(returnedCode)}&state=${encodeURIComponent(returnedState ?? '')}`}
                className="inline-flex items-center gap-2 rounded-lg bg-ink dark:bg-paper text-paper dark:text-ink px-4 py-2 text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Open LinkDit Pad
              </a>
            )}
          </div>
        )}

        {!returnedError && authorizeUrl && (
          <a
            href={authorizeUrl}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-ink-850 hover:bg-surface-strong dark:hover:bg-ink-800 transition-colors px-4 py-3 text-sm font-semibold shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.98 10.98 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
              />
            </svg>
            Continue with Google
          </a>
        )}

        {!ready && !returnedCode && !returnedError && (
          <div className="rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-ink-850 px-4 py-3 text-left text-sm flex items-start gap-2.5">
            <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-muted" />
            <p className="text-ink-soft dark:text-paper/60">
              This sign-in link is incomplete or account sign-in is not published yet. Open LinkDit
              Pad and choose <strong>Sign in</strong> from the account button in the top-right
              corner.
            </p>
          </div>
        )}

        {isSupabaseConfigured() && (
          <p className="text-xs text-ink-mute dark:text-paper/45 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Powered by Supabase Auth · {source === 'linkdit-pad' ? 'requested by LinkDit Pad' : 'browser link'}
          </p>
        )}

        <div>
          <a
            href={`${SITE_URL}/download`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep dark:text-blue-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to the {PRODUCT_NAME} download page
          </a>
        </div>

        {isSupabaseConfigured() && SUPABASE_URL && (
          <p className="text-[11px] text-ink-mute dark:text-paper/40 break-all">
            Supabase: {SUPABASE_URL} · key: {SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.slice(0, 8)}…` : 'missing'}
          </p>
        )}
      </section>
    </div>
  );
};