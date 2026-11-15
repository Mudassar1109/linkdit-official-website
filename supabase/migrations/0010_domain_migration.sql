-- ---------------------------------------------------------------------------
-- 0010_domain_migration.sql
--
-- Source-controlled defaults for the website domain migration:
--     linkdit.online  ->  typodocs.online   (canonical)
--     www.linkdit.online -> www.typodocs.online (secondary)
--
-- Like 0009, this migration is additive and non-destructive:
--
--   * No schema, policy, RLS, role, grant or storage changes.
--   * The download host allowlist is EXTENDED, never narrowed: the legacy
--     linkdit.online hosts stay allowed while the old domain is still
--     connected, so no existing installer record is invalidated.
--   * The CMS canonical base is only rewritten while it still points at the
--     old domain. Anything an administrator changed by hand is left alone.
--   * Idempotent: safe to run more than once.
--
-- Applying this against a LIVE Supabase project is NOT part of the website
-- migration and requires explicit approval. Live CMS values should be
-- updated through the admin console (restricted categories go through the
-- approval workflow).
-- ---------------------------------------------------------------------------

-- 1. Approved hosts for externally hosted installers -------------------------
--    The new domain is added alongside the legacy hosts (not replacing them).
create or replace function public.is_approved_download_url(u text)
returns boolean language plpgsql immutable as $$
declare
  host text;
  v text := btrim(coalesce(u, ''));
begin
  if length(v) = 0 then return false; end if;

  -- Site-hosted installers: relative path strictly under /downloads/ with a
  -- single filename (no subdirectories, no traversal).
  if v ~ '^/downloads/[A-Za-z0-9._-]+$' then
    return true;
  end if;

  -- Externally hosted installers must be https on an approved host.
  host := lower(regexp_replace(v, '^https://([^/:?#]+).*$', '\1'));
  if host = lower(v) then return false; end if; -- no https scheme matched
  return host in (
    'www.typodocs.online','typodocs.online',
    'www.linkdit.online','linkdit.online','github.com',
    'objects.githubusercontent.com','github-releases.githubusercontent.com'
  );
end $$;

-- 2. CMS canonical base URL ---------------------------------------------------
--    Only rewritten while it still carries the old domain.
update public.cms_settings
   set value = 'https://typodocs.online'
 where key = 'seo.canonical_base'
   and value in ('https://www.linkdit.online', 'https://linkdit.online');

-- 3. Legal/content drafts that still name the old domain ---------------------
--    Only untouched seed drafts are rewritten; published or edited content is
--    left alone so no administrator's wording is overwritten.
update public.cms_content
   set value = replace(replace(value, 'www.linkdit.online', 'typodocs.online'),
                       'linkdit.online', 'typodocs.online')
 where status = 'draft'
   and key in ('legal.privacy.body', 'legal.terms.body', 'legal.license.body',
               'legal.eula.body', 'legal.copyright.body')
   and value like '%linkdit.online%';
