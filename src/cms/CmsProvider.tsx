import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCmsContent,
  fetchCmsSettings,
  isCmsConfigured,
  type CmsContentRow,
} from './client';

/**
 * Optional, additive CMS layer for the PUBLIC site.
 *
 * Design guarantees:
 * - **Opt-in and non-breaking.** Until a page reads from this context, rendering
 *   is byte-for-byte identical to the static site. When Supabase is not
 *   configured everything is a no-op.
 * - **Static-first.** `useCmsValue()` returns the caller's static fallback until
 *   (and unless) a published override arrives, so there is never a flash of
 *   empty content and the site is fully functional offline.
 * - **Read-only & published-only.** It can only ever read rows the database
 *   exposes through `public_published_content` (status = 'published').
 *
 * To adopt it on a public page later:
 *
 *   <CmsProvider keys={['home.hero.title', 'page.download.summary']}>
 *     <App />
 *   </CmsProvider>
 *
 *   const title = useCmsValue('home.hero.title', STATIC_HERO_TITLE);
 *
 * The public site currently keeps reading its static configuration directly
 * (config.ts / data/websiteData.ts); this provider is wired and ready.
 */

interface CmsState {
  /** True once content loading has settled (immediately true when unconfigured). */
  ready: boolean;
  values: Record<string, string>;
  settings: Record<string, string>;
}

const EMPTY: CmsState = { ready: !isCmsConfigured, values: {}, settings: {} };

const CmsContext = createContext<CmsState>(EMPTY);

export const CmsProvider: React.FC<{ keys?: string[]; children: React.ReactNode }> = ({
  keys = [],
  children,
}) => {
  const [state, setState] = useState<CmsState>(EMPTY);
  const keySignature = keys.join('|');

  useEffect(() => {
    if (!isCmsConfigured) return;
    let alive = true;

    (async () => {
      const [content, settings] = await Promise.all([
        fetchCmsContent(keySignature ? keySignature.split('|') : []),
        fetchCmsSettings(),
      ]);
      if (!alive) return;

      const values: Record<string, string> = {};
      for (const row of content as CmsContentRow[]) values[row.key] = row.value;

      const settingMap: Record<string, string> = {};
      for (const s of settings) settingMap[s.key] = s.value;

      setState({ ready: true, values, settings: settingMap });
    })().catch(() => {
      if (alive) setState({ ready: true, values: {}, settings: {} });
    });

    return () => {
      alive = false;
    };
  }, [keySignature]);

  const value = useMemo(() => state, [state]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
};

/**
 * Return the published value for `key`, or `fallback` when it is unavailable.
 * Always returns a usable string, never undefined.
 */
export function useCmsValue(key: string, fallback: string): string {
  const { values } = useContext(CmsContext);
  return values[key] ?? fallback;
}

/** Return a published setting value, or `fallback` when unavailable. */
export function useCmsSetting(key: string, fallback: string): string {
  const { settings } = useContext(CmsContext);
  return settings[key] ?? fallback;
}

/** True once CMS content has settled (immediately true when unconfigured). */
export function useCmsReady(): boolean {
  return useContext(CmsContext).ready;
}
