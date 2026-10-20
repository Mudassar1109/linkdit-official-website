# Typodocs — Admin CMS backend (Supabase)

This directory contains the complete, reproducible database backend for the
private `/admin` console. It is designed so that the **public website keeps
working with zero configuration** and the CMS is layered on top, opt-in.

> Nothing here is required for the public site to build or run. If the two
> `VITE_SUPABASE_*` variables are absent, `/admin` shows a "backend not
> configured" screen and every public route behaves exactly as before.

---

## 1. What is enforced where

| Concern | Where it is enforced |
| --- | --- |
| Authentication | Supabase Auth (email/password). **There is no public sign-up.** |
| Authorisation | Postgres **Row Level Security** + `SECURITY DEFINER` functions. |
| Roles & permissions | `admin_users.role` + `role_permissions` matrix, checked server-side. |
| Approval workflow | `cms_submissions` + `can_submit_category()` / `can_approve_category()`. |
| Audit trail | `cms_audit_logs` — append-only, written by triggers/functions. |
| Media | Supabase Storage bucket `cms-media` (public read, admin-only write). |
| Versioning | `cms_content_versions` — every publish is a new immutable version. |

The client (`src/admin/lib/permissions.ts`) only **hides** controls; it is never
the security boundary. A tampered browser still cannot perform a privileged
operation because the database rejects it.

---

## 2. Roles

| Role | Purpose |
| --- | --- |
| `owner` | Full control, manages admins, approves restricted changes, emergency rollback. |
| `administrator` | Ordinary content, media, permitted download metadata, analytics. |
| `editor` | Edits and previews permitted content; submits restricted changes. |
| `contributor` | Own drafts, authorised media uploads, submits for review. |
| `reviewer` | Reviews and approves/rejects eligible submissions with a reason. |

**Restricted categories** (always require approval, or an explicit Owner
confirmation with a recorded reason):

- `legal_page` — Privacy, Terms, License, EULA, Copyright
- `adsense_settings` — AdSense configuration & publisher ID
- `analytics_settings` — Analytics configuration & tracking IDs
- `installer_release` — installer version, size, checksum, hosting
- `role_permission` — roles & permissions
- `auth_security` — authentication & security settings
- `critical_seo` — robots, sitemap, canonical, noindex

---

## 3. One-time setup

### 3.1 Create the project

1. Create a project at <https://app.supabase.com>.
2. Note the **Project URL** and the **anon public key** (Settings → API).
   Never put the `service_role` key in the frontend.

### 3.2 Apply the migrations

Run the files in `supabase/migrations/` **in order** against the project —
either:

- **Dashboard:** SQL Editor → paste & run each file `0001_…` → `0007_…`, or
- **Supabase CLI:**

  ```bash
  supabase link --project-ref <your-project-ref>
  supabase db push
  ```

Order matters: `0001_core` defines the helper functions the later files use.

| File | Contents |
| --- | --- |
| `0001_core.sql` | `admin_users`, role↔permission matrix, helper functions, guard trigger, owner bootstrap. |
| `0002_cms.sql` | `cms_content`, versions, media, releases, blog, settings, submissions, audit log. |
| `0003_policy.sql` | Approval-category policies, `can_submit/approve_category`, `write_audit`, validators. |
| `0004_rls.sql` | Enables RLS and defines every policy + grants. |
| `0005_functions.sql` | All `admin_*` RPCs and the public `public_published_content`/`public_site_settings`. |
| `0006_storage.sql` | Creates the `cms-media` bucket with admin-only write policies. |
| `0007_seed.sql` | Settings registry + content baselines (as drafts). **Blog is intentionally not seeded.** |

### 3.3 Create the first Owner

1. Authentication → Users → **Add user** → create the owner's email/password
   (email confirmed).
2. In the SQL Editor run exactly once:

   ```sql
   select public.admin_bootstrap_owner('owner@example.com');
   ```

   This refuses to run if an owner already exists and can only ever create an
   owner — never any other role. It is revoked from `anon`/`authenticated`, so
   it cannot be called from the browser or with the anon key.

All further administrators are added from **/admin → Users** by the Owner.

### 3.4 Configure the frontend

Set the following environment variables (see `.env.example`):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>
```

Locally these live in `.env.local`; on Vercel set them in
**Project → Settings → Environment Variables** for the Production (and
Preview) environments, then redeploy. Only the **anon** key belongs here.

---

## 4. Accessing the console

- URL: `https://www.linkdit.online/admin`
- `/admin` and `/admin/*` are `noindex` (meta at runtime **and**
  `X-Robots-Tag` header on Vercel) and disallowed in `robots.txt`.
- The admin bundle is code-split: the Supabase client is **only** downloaded by
  visitors of `/admin`, never on public pages.

---

## 5. Verifying RLS (do this before trusting the backend)

Sign in as a non-owner (e.g. an `editor`) and confirm the database rejects
privileged calls even if the UI is bypassed. Example from the SQL editor while
impersonating a user, or from the browser console with the anon key + a user
session:

```sql
-- As an editor, this must FAIL (only owners may change roles):
select public.admin_set_role('<some-user-uuid>', 'owner', 'attempt');
```

Expected failures (raise exceptions / return no rows):

- an `editor` inserting directly into `cms_content` (RLS denies).
- a non-reviewer calling `admin_review_submission` for a restricted category.
- anyone calling `admin_bootstrap_owner` after the first owner exists.
- an unauthenticated `anon` caller reading `cms_submissions` or `cms_audit_logs`.
- a reviewer approving **their own** submission (blocked by policy).

Writes must go through the RPCs; direct table writes are denied by RLS.

---

## 6. Deploy

1. Ensure the two env vars are set on Vercel.
2. Deploy as usual (the repo builds with `vite build && tsx scripts/prerender.ts`).
3. `vercel.json` already rewrites `/admin` and `/admin/*` to the SPA shell and
   adds the `noindex` / framing / referrer headers.

### Rollback / recovery

- **Content:** every publish creates an immutable `cms_content_versions` row.
  Use **Content → version history → restore** (Owner/direct with a reason) to
  point a key back at a prior version. Nothing is overwritten destructively.
- **Releases:** the previous release is never deleted; re-point "current" with
  a recorded reason (`admin_rollback_release`).
- **Database:** take Supabase automated backups before running new migrations.
  Migrations are additive; to undo an environment, restore the project backup.
- **Emergency:** an Owner can always publish directly with a reason; the action
  is written to `cms_audit_logs`.

---

## 7. Notes & guarantees

- No service-role key is ever shipped to the browser.
- No sample blog posts, placeholder articles or fabricated metrics exist.
  The public blog stays empty until genuine content is published.
- The public site reads static defaults from `src/config.ts` /
  `src/data/websiteData.ts`; CMS values are overlaid only when present and
  published. Missing/unconfigured Supabase means static content is served.
- Existing SEO, AdSense (`ca-pub-126320063770723`), analytics and download
  hosting continue to work unchanged.
