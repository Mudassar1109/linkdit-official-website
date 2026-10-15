-- ===========================================================================
-- 0007_seed.sql — Non-destructive baseline for a fresh project
-- ===========================================================================
-- This seed:
--   * registers the settings keys the admin UI manages, initialised to the
--     CURRENT public values (analytics ID, AdSense ID, SEO defaults, branding,
--     legal contact) so nothing silently changes;
--   * registers baseline content keys as DRAFTS whose value mirrors the
--     existing static website. Because they are drafts, the public site keeps
--     serving its static defaults until an authorised admin explicitly
--     publishes. It never overwrites existing rows (ON CONFLICT DO NOTHING).
--
-- Do NOT run this against a database that already holds real content unless
-- you have reviewed the differences; it is safe (no updates) but pointless.
-- ===========================================================================

-- --- Settings registry -----------------------------------------------------
insert into public.cms_settings (key, label, "group", value, value_type, restricted, approval_category, is_secret) values
  ('analytics.enabled',            'Analytics enabled',        'analytics', 'true',                          'boolean', true,  'analytics_settings', false),
  ('analytics.ga_measurement_id',  'GA4 measurement ID',       'analytics', 'G-R2R4E9QFLM',                  'string',  true,  'analytics_settings', false),
  ('ads.adsense_enabled',          'AdSense enabled',          'ads',       'true',                          'boolean', true,  'adsense_settings',   false),
  ('ads.adsense_client',           'AdSense publisher ID',     'ads',       'ca-pub-126320063770723',        'string',  true,  'adsense_settings',   false),
  ('seo.default_title_prefix',     'Default title prefix',     'seo',       'LinkDit Pad',                   'string',  false, null,                 false),
  ('seo.default_description',      'Default meta description', 'seo',       'LinkDit Pad is a fast, offline-first Markdown and rich-text editor for Windows 10 and 11. Multi-tab editing, live word counts, local files only — no account, no telemetry.', 'string', true, 'critical_seo', false),
  ('seo.canonical_base',           'Canonical base URL',       'seo',       'https://www.linkdit.online',    'string',  true,  'critical_seo',       false),
  ('seo.robots_policy',            'Robots policy',            'seo',       'index,follow',                  'string',  true,  'critical_seo',       false),
  ('seo.sitemap_include_blog',     'Include published blog in sitemap', 'seo', 'false',                       'boolean', true,  'critical_seo',       false),
  ('branding.logo_path',           'Logo path',                'branding',  '/icon-128.png',                 'string',  true,  null,                 false),
  ('branding.favicon_path',        'Favicon path',             'branding',  '/favicon.ico',                  'string',  true,  null,                 false),
  ('branding.app_icon_path',       'Social/app icon path',     'branding',  '/app-icon-1024.png',            'string',  true,  null,                 false),
  ('legal.contact_email',          'Official contact email',   'legal',     'elahimudassasr1@gmail.com',     'string',  true,  null,                 false),
  ('legal.last_updated',           'Legal pages last updated', 'legal',     'September 2026',                'string',  true,  'legal_page',         false),
  ('security.require_approval',    'Require approval for restricted changes', 'security', 'true',            'boolean', true,  'auth_security',      false)
on conflict (key) do nothing;

-- --- Content baseline (drafts only; never auto-published) ------------------
insert into public.cms_content (key, section, classification, approval_category, value, value_type, status) values
  ('home.hero.eyebrow',        'home',   'ordinary',   null,          'v0.1.2 · Free for Windows 10 & 11', 'text', 'draft'),
  ('home.hero.title',          'home',   'ordinary',   null,          'A writing desk that stays out of your way.', 'text', 'draft'),
  ('home.hero.body',           'home',   'ordinary',   null,          'LinkDit Pad is a fast, offline-first Markdown and rich-text editor. Multi-tab editing, live word counts, and every document stays a plain file on your own computer.', 'text', 'draft'),
  ('home.final.title',         'home',   'ordinary',   null,          'Ready to write?', 'text', 'draft'),
  ('home.privacy.title',       'home',   'ordinary',   null,          'Private software shouldn''t be a luxury.', 'text', 'draft'),
  ('global.tagline',           'global', 'ordinary',   null,          'Write clearly. Write locally.', 'text', 'draft'),
  ('global.contact_email',     'global', 'ordinary',   null,          'elahimudassasr1@gmail.com', 'text', 'draft'),
  ('page.download.summary',    'page',   'ordinary',   null,          'Free, no account required, and free forever for personal, academic, and commercial use.', 'text', 'draft'),
  ('page.support.intro',       'page',   'ordinary',   null,          'Help for LinkDit Pad: installation, features, privacy, and licensing.', 'text', 'draft'),
  ('legal.privacy.body',       'legal',  'restricted', 'legal_page',  '', 'html', 'draft'),
  ('legal.terms.body',         'legal',  'restricted', 'legal_page',  '', 'html', 'draft'),
  ('legal.license.body',       'legal',  'restricted', 'legal_page',  '', 'html', 'draft'),
  ('legal.eula.body',          'legal',  'restricted', 'legal_page',  '', 'html', 'draft'),
  ('legal.copyright.body',     'legal',  'restricted', 'legal_page',  '', 'html', 'draft')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Blog is intentionally EMPTY. No sample posts, no placeholder articles.
-- Do not seed blog content. Real articles are created by authorised admins.
-- ---------------------------------------------------------------------------
