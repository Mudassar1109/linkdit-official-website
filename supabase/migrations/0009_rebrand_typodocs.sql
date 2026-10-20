-- ---------------------------------------------------------------------------
-- 0009_rebrand_typodocs.sql
--
-- Source-controlled rebrand defaults: LinkDit Pad -> Typodocs.
--
-- This migration ONLY touches values THIS project seeded in 0007_seed.sql and
-- the author default in 0002_cms.sql. It is written to be additive and
-- non-destructive:
--
--   * No schema, policy, RLS, role, grant or storage changes.
--   * No published content is altered: content rows are updated only while
--     they are still the untouched seed draft.
--   * Idempotent: safe to run more than once.
--
-- Applying this against a LIVE Supabase project is NOT part of the website
-- rebrand and requires explicit approval. Live CMS values must be updated
-- through the admin console (restricted categories go through approval).
-- ---------------------------------------------------------------------------

-- 1. CMS settings seeded with the old product name --------------------------
update public.cms_settings
   set value = 'Typodocs'
 where key = 'seo.default_title_prefix'
   and value = 'LinkDit Pad';

update public.cms_settings
   set value = replace(value, 'LinkDit Pad', 'Typodocs')
 where key = 'seo.default_description'
   and value like 'LinkDit Pad is a fast%';

-- 2. Content baselines seeded with the old product name ---------------------
--    Only the untouched seed drafts are rewritten; anything edited or
--    published by an administrator is left alone.
update public.cms_content
   set value = replace(value, 'LinkDit Pad', 'Typodocs')
 where status = 'draft'
   and key in ('home.hero.body', 'page.support.intro', 'page.download.summary', 'home.hero.title')
   and value like '%LinkDit Pad%';

-- 3. Blog author default (column default from 0002_cms.sql) -----------------
alter table public.cms_blog_posts
  alter column author set default 'Typodocs';
