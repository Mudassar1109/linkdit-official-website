// Local backend verification for the LinkDit Pad admin/Supabase layer.
//
// Runs the real SQL migrations against an embedded PostgreSQL (PGlite, WASM) so
// the schema, RLS policies, permission matrix, approval workflow, guards and
// public read endpoints can be exercised WITHOUT Docker or a Supabase project.
//
// It is NOT a substitute for testing against a real Supabase instance (auth,
// storage APIs, JWT issuance), but it does execute the actual migration SQL.
//
// Run: npm run test:backend

import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const migrationsDir = join(root, 'supabase', 'migrations');
const shimPath = join(root, 'supabase', 'tests', '_shim.sql');

// ---------------------------------------------------------------------------
// Tiny test harness
// ---------------------------------------------------------------------------
const results = [];
let currentGroup = '(root)';
function group(name) { currentGroup = name; }
async function test(name, fn) {
  try {
    await fn();
    results.push({ group: currentGroup, name, ok: true });
  } catch (e) {
    results.push({ group: currentGroup, name, ok: false, err: e && e.message ? e.message : String(e) });
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed'); }
function eq(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`${msg || 'eq'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ---------------------------------------------------------------------------
// Fixed identities
// ---------------------------------------------------------------------------
const U = {
  owner:   '00000000-0000-0000-0000-000000000001',
  admin:   '00000000-0000-0000-0000-000000000002',
  editor:  '00000000-0000-0000-0000-000000000003',
  contrib: '00000000-0000-0000-0000-000000000004',
  reviewer:'00000000-0000-0000-0000-000000000005',
  outsider:'00000000-0000-0000-0000-000000000006',
};
const EMAIL = {
  owner: 'owner@test.local',
  admin: 'admin@test.local',
  editor: 'editor@test.local',
  contrib: 'contrib@test.local',
  reviewer: 'reviewer@test.local',
  outsider: 'outsider@test.local',
};
const SHA = 'a'.repeat(64);

const db = new PGlite();

async function q(sql, params) { return db.query(sql, params); }
async function exec(sql) { return db.exec(sql); }

// Run `fn` inside a transaction as `role` with a JWT sub claim; commit on
// success, rollback on error.
async function asDb(role, sub, fn) {
  await exec('begin');
  if (role && role !== 'postgres') await exec(`set local role ${role}`);
  if (sub) {
    await q("select set_config('request.jwt.claims', $1, true)", [
      JSON.stringify({ sub, role: role === 'anon' ? 'anon' : 'authenticated' }),
    ]);
  }
  try {
    const r = await fn();
    await exec('commit');
    return r;
  } catch (e) {
    await exec('rollback');
    throw e;
  }
}
const asUser = (id, fn) => asDb('authenticated', id, fn);
const asAnon = (fn) => asDb('anon', null, fn);
const asOwner = (fn) => asUser(U.owner, fn);
const asPg = (fn) => fn();

async function expectError(fn, substr) {
  let err = null;
  try { await fn(); } catch (e) { err = e; }
  assert(err, `expected error${substr ? ` containing "${substr}"` : ''} but call succeeded`);
  if (substr) {
    const msg = String(err.message).toLowerCase();
    assert(msg.includes(substr.toLowerCase()), `expected error containing "${substr}" but got "${err.message}"`);
  }
  return err;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  // --- Load shim + migrations -------------------------------------------------
  group('migrations');
  await exec(readFileSync(shimPath, 'utf8'));

  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    await test(`applies ${f}`, async () => {
      await exec(readFileSync(join(migrationsDir, f), 'utf8'));
    });
  }

  // --- Seed identities --------------------------------------------------------
  group('setup');
  await test('seed auth.users', async () => {
    for (const k of Object.keys(U)) {
      await q('insert into auth.users (id, email) values ($1,$2)', [U[k], EMAIL[k]]);
    }
  });
  await test('bootstrap refuses unknown email (no owner yet)', async () => {
    await expectError(() => q('select public.admin_bootstrap_owner($1)', ['nobody@test.local']), 'No auth user found');
  });
  await test('bootstrap first owner', async () => {
    await q('select public.admin_bootstrap_owner($1)', [EMAIL.owner]);
    const r = await q("select role from public.admin_users where user_id = $1", [U.owner]);
    eq(r.rows[0]?.role, 'owner', 'owner role');
  });
  await test('bootstrap refuses when an owner already exists', async () => {
    await expectError(() => q('select public.admin_bootstrap_owner($1)', [EMAIL.admin]), 'already exists');
  });
  await test('owner invites admin/editor/contributor/reviewer', async () => {
    await asOwner(async () => {
      await q('select public.admin_invite_user($1,$2,$3)', [EMAIL.admin, 'administrator', 'seed']);
      await q('select public.admin_invite_user($1,$2,$3)', [EMAIL.editor, 'editor', 'seed']);
      await q('select public.admin_invite_user($1,$2,$3)', [EMAIL.contrib, 'contributor', 'seed']);
      await q('select public.admin_invite_user($1,$2,$3)', [EMAIL.reviewer, 'reviewer', 'seed']);
    });
    const r = await q('select count(*)::int as n from public.admin_users');
    eq(r.rows[0].n, 5, 'admin count');
  });
  await test('non-owner cannot invite', async () => {
    await expectError(
      () => asUser(U.admin, () => q('select public.admin_invite_user($1,$2,$3)', [EMAIL.outsider, 'editor', 'x'])),
      'Only an owner',
    );
  });

  // --- Permission matrix ------------------------------------------------------
  group('permissions');
  await test('editor has content.edit but not content.publish', async () => {
    const r = await asUser(U.editor, () => q(
      "select public.has_permission('content.edit') as edit, public.has_permission('content.publish') as pub"));
    eq(r.rows[0].edit, true, 'editor content.edit');
    eq(r.rows[0].pub, false, 'editor content.publish');
  });
  await test('administrator has content.publish', async () => {
    const r = await asUser(U.admin, () => q("select public.has_permission('content.publish') as pub"));
    eq(r.rows[0].pub, true, 'admin content.publish');
  });
  await test('outsider is not an admin', async () => {
    const r = await asUser(U.outsider, () => q('select public.is_current_admin() as a'));
    eq(r.rows[0].a, false, 'outsider is_current_admin');
  });
  await test('can_submit_category(legal_page): admin yes, editor no', async () => {
    const a = await asUser(U.admin, () => q("select public.can_submit_category('legal_page') as x"));
    const e = await asUser(U.editor, () => q("select public.can_submit_category('legal_page') as x"));
    eq(a.rows[0].x, true, 'admin can submit legal');
    eq(e.rows[0].x, false, 'editor cannot submit legal');
  });

  // --- Content workflow -------------------------------------------------------
  group('content workflow');
  await test('editor saves ordinary content as draft (+version +audit)', async () => {
    await asUser(U.editor, () => q(
      "select public.admin_save_content('test.hero','home','ordinary',null,'Hello','text')"));
    const c = await q("select status from public.cms_content where key='test.hero'");
    eq(c.rows[0].status, 'draft', 'status draft');
    const v = await q("select count(*)::int as n from public.cms_content_versions v join public.cms_content c on c.id=v.content_id where c.key='test.hero'");
    eq(v.rows[0].n, 1, 'version count');
    const a = await q("select count(*)::int as n from public.cms_audit_logs where action='content.save' and entity_key='test.hero'");
    eq(a.rows[0].n, 1, 'audit count');
  });
  await test('editor cannot publish (lacks content.publish)', async () => {
    await expectError(
      () => asUser(U.editor, () => q("select public.admin_publish_content('test.hero',null,false,null)")),
      'Not authorized to publish');
  });
  await test('administrator saves and publishes ordinary content', async () => {
    await asUser(U.admin, () => q(
      "select public.admin_save_content('test.hero','home','ordinary',null,'Hello v2','text')"));
    const vid = (await q("select v.id from public.cms_content_versions v join public.cms_content c on c.id=v.content_id where c.key='test.hero' order by v.version_no desc limit 1")).rows[0].id;
    await asUser(U.admin, () => q('select public.admin_publish_content($1,$2,false,$3)', ['test.hero', vid, null]));
    const c = await q("select status, value from public.cms_content where key='test.hero'");
    eq(c.rows[0].status, 'published', 'status published');
    eq(c.rows[0].value, 'Hello v2', 'value');
  });
  await test('anon sees published content via public endpoint but not drafts', async () => {
    const pub = await asAnon(() => q("select * from public.public_published_content(array['test.hero'])"));
    eq(pub.rows.length, 1, 'published visible');
    const draft = await asAnon(() => q("select * from public.public_published_content(array['legal.privacy.body'])"));
    eq(draft.rows.length, 0, 'draft hidden');
  });
  await test('editor cannot submit restricted legal_page', async () => {
    await expectError(
      () => asUser(U.editor, () => q("select public.admin_save_content('legal.privacy.body','legal','restricted','legal_page','<p>x</p>','html')")),
      'may not submit this restricted category');
  });

  // restricted content: admin saves + submits, owner approves, admin publishes
  let privacyContentId;
  let privacyVersionId;
  let privacySubId;
  await test('administrator saves restricted legal_page draft', async () => {
    await asUser(U.admin, () => q("select public.admin_save_content('legal.privacy.body','legal','restricted','legal_page','<p>privacy</p>','html')"));
    const r = await q("select id from public.cms_content where key='legal.privacy.body'");
    privacyContentId = r.rows[0].id;
    privacyVersionId = (await q('select id from public.cms_content_versions where content_id=$1 order by version_no desc limit 1', [privacyContentId])).rows[0].id;
  });
  await test('administrator submits for approval', async () => {
    const r = await asUser(U.admin, () => q(
      'select public.admin_submit_for_approval($1,$2,$3,$4,$5,$6) as id',
      ['legal_page', 'content', privacyContentId, 'Privacy', privacyVersionId, null]));
    privacySubId = r.rows[0].id;
    const c = await q('select status from public.cms_content where id=$1', [privacyContentId]);
    eq(c.rows[0].status, 'submitted', 'content submitted');
  });
  await test('reviewer cannot approve legal_page (owner-only category)', async () => {
    await expectError(
      () => asUser(U.reviewer, () => q('select public.admin_review_submission($1,$2,$3)', [privacySubId, 'approved', null])),
      'not authorized to review');
  });
  await test('owner approves legal_page submission', async () => {
    await asOwner(() => q('select public.admin_review_submission($1,$2,$3)', [privacySubId, 'approved', null]));
    const c = await q('select status from public.cms_content where id=$1', [privacyContentId]);
    eq(c.rows[0].status, 'approved', 'content approved');
  });
  await test('administrator publishes restricted content after approval', async () => {
    await asUser(U.admin, () => q('select public.admin_publish_content($1,$2,false,$3)', ['legal.privacy.body', privacyVersionId, null]));
    const c = await q("select status from public.cms_content where key='legal.privacy.body'");
    eq(c.rows[0].status, 'published', 'published');
  });
  await test('owner direct-publish of restricted content requires a reason', async () => {
    await asOwner(() => q("select public.admin_save_content('legal.terms.body','legal','restricted','legal_page','<p>terms</p>','html')"));
    await expectError(
      () => asOwner(() => q("select public.admin_publish_content('legal.terms.body',null,true,'')")),
      'A reason is required');
    await asOwner(() => q("select public.admin_publish_content('legal.terms.body',null,true,'emergency fix')"));
    const c = await q("select status from public.cms_content where key='legal.terms.body'");
    eq(c.rows[0].status, 'published', 'direct publish');
  });
  await test('rollback requires reason and creates a new published version', async () => {
    await expectError(
      () => asUser(U.admin, () => q("select public.admin_rollback_content('test.hero', $1, '')", [privacyVersionId])),
      'A reason is required');
    const first = (await q("select v.id from public.cms_content_versions v join public.cms_content c on c.id=v.content_id where c.key='test.hero' order by v.version_no asc limit 1")).rows[0].id;
    await asUser(U.admin, () => q("select public.admin_rollback_content('test.hero',$1,'restore')", [first]));
    const c = await q("select value, status from public.cms_content where key='test.hero'");
    eq(c.rows[0].status, 'published', 'published after rollback');
    eq(c.rows[0].value, 'Hello', 'rolled back value');
  });

  // --- Releases ---------------------------------------------------------------
  group('releases');
  let releaseId;
  await test('save release with site-relative /downloads URL (the real world case)', async () => {
    const r = await asUser(U.admin, () => q('select public.admin_save_release($1::jsonb) as id', [JSON.stringify({
      version: '0.1.2', channel: 'stable', title: '0.1.2', installer_url: '/downloads/LinkDit-Pad-0.1.2-x64-setup.exe',
      filename: 'LinkDit-Pad-0.1.2-x64-setup.exe', sha256: SHA, format: '.exe', file_size: '10 MB',
    })]));
    releaseId = r.rows[0].id;
    assert(releaseId, 'release id');
  });
  await test('reject unapproved host', async () => {
    await expectError(
      () => asUser(U.admin, () => q('select public.admin_save_release($1::jsonb)', [JSON.stringify({
        version: '0.0.9', installer_url: 'https://evil.example.com/x.exe', sha256: SHA, format: '.exe',
      })])),
      'approved host');
  });
  await test('reject plain http', async () => {
    await expectError(
      () => asUser(U.admin, () => q('select public.admin_save_release($1::jsonb)', [JSON.stringify({
        version: '0.0.8', installer_url: 'http://www.linkdit.online/x.exe', sha256: SHA, format: '.exe',
      })])),
      'approved host');
  });
  await test('reject invalid sha256', async () => {
    await expectError(
      () => asUser(U.admin, () => q('select public.admin_save_release($1::jsonb)', [JSON.stringify({
        version: '0.0.7', installer_url: '/downloads/x.exe', sha256: 'abc', format: '.exe',
      })])),
      'SHA-256');
  });
  await test('administrator cannot publish releases (lacks downloads.publish)', async () => {
    await expectError(
      () => asUser(U.admin, () => q('select public.admin_publish_release($1,false,null)', [releaseId])),
      'Not authorized to publish releases');
  });
  await test('a release approver cannot publish before approval', async () => {
    await expectError(
      () => asUser(U.reviewer, () => q('select public.admin_publish_release($1,false,null)', [releaseId])),
      'must be approved');
  });
  await test('owner submits release; owner cannot self-approve; reviewer approves', async () => {
    const sub = await asOwner(() => q(
      'select public.admin_submit_for_approval($1,$2,$3,$4,$5,$6) as id',
      ['installer_release', 'download_release', releaseId, '0.1.2', null, null]));
    const subId = sub.rows[0].id;
    await expectError(
      () => asOwner(() => q('select public.admin_review_submission($1,$2,$3)', [subId, 'approved', null])),
      'cannot review your own submission');
    await asUser(U.reviewer, () => q('select public.admin_review_submission($1,$2,$3)', [subId, 'approved', null]));
    const r = await q('select status from public.cms_download_releases where id=$1', [releaseId]);
    eq(r.rows[0].status, 'approved', 'release approved');
  });
  await test('reviewer publishes approved release (category approver)', async () => {
    await asUser(U.reviewer, () => q('select public.admin_publish_release($1,false,null)', [releaseId]));
    const r = await q('select status, is_available, is_current from public.cms_download_releases where id=$1', [releaseId]);
    eq(r.rows[0].status, 'published', 'published');
    eq(r.rows[0].is_available, true, 'available');
    eq(r.rows[0].is_current, true, 'current');
  });
  await test('anon sees only published+available releases', async () => {
    const r = await asAnon(() => q("select * from public.cms_download_releases where status='published'"));
    eq(r.rows.length, 1, 'one public release');
  });

  // --- Blog -------------------------------------------------------------------
  group('blog');
  let postId;
  await test('reject invalid slug', async () => {
    await expectError(
      () => asUser(U.editor, () => q('select public.admin_save_post($1::jsonb)', [JSON.stringify({ slug: 'Bad Slug!', title: 'x' })])),
      'Slug must be');
  });
  await test('editor saves draft post', async () => {
    const r = await asUser(U.editor, () => q('select public.admin_save_post($1::jsonb) as id', [JSON.stringify({ slug: 'first-post', title: 'First', body: 'Hi' })]));
    postId = r.rows[0].id;
    const c = await q("select status from public.cms_blog_posts where id=$1", [postId]);
    eq(c.rows[0].status, 'draft', 'draft');
  });
  await test('anon cannot see draft post', async () => {
    const r = await asAnon(() => q("select * from public.cms_blog_posts where slug='first-post'"));
    eq(r.rows.length, 0, 'draft hidden');
  });
  await test('editor cannot publish post (lacks blog.publish)', async () => {
    await expectError(
      () => asUser(U.editor, () => q('select public.admin_set_post_published($1,true,$2)', [postId, null])),
      'Not authorized to publish posts');
  });
  await test('administrator publishes post; anon can read it', async () => {
    await asUser(U.admin, () => q('select public.admin_set_post_published($1,true,$2)', [postId, 'go live']));
    const r = await asAnon(() => q("select * from public.cms_blog_posts where slug='first-post'"));
    eq(r.rows.length, 1, 'published visible');
  });

  // --- Settings ---------------------------------------------------------------
  group('settings');
  await test('editor cannot edit settings at all', async () => {
    await expectError(
      () => asUser(U.editor, () => q("select public.admin_update_setting('seo.default_title_prefix','x',false,null)")),
      'Not authorized to edit settings');
  });
  await test('owner edits a non-restricted setting without a reason', async () => {
    await asOwner(() => q("select public.admin_update_setting('seo.default_title_prefix','LinkDit Pad HQ',false,null)"));
    const r = await q("select value from public.cms_settings where key='seo.default_title_prefix'");
    eq(r.rows[0].value, 'LinkDit Pad HQ', 'value updated');
  });
  await test('restricted setting needs approval or owner override', async () => {
    await expectError(
      () => asOwner(() => q("select public.admin_update_setting('seo.default_description','x',false,null)")),
      'requires approval or an owner override');
  });
  await test('owner direct override of restricted setting requires reason', async () => {
    await expectError(
      () => asOwner(() => q("select public.admin_update_setting('seo.default_description','x',true,'')")),
      'A reason is required');
    await asOwner(() => q("select public.admin_update_setting('seo.default_description','new desc',true,'approved by owner')"));
    const r = await q("select value from public.cms_settings where key='seo.default_description'");
    eq(r.rows[0].value, 'new desc', 'value updated');
  });
  await test('secret setting value is masked in audit diff', async () => {
    await q("insert into public.cms_settings (key,label,\"group\",value,value_type,restricted,is_secret) values ('test.secret','Secret','security','orig','string',false,true) on conflict (key) do nothing");
    await asOwner(() => q("select public.admin_update_setting('test.secret','topsecret',false,null)"));
    const r = await q("select diff from public.cms_audit_logs where action='setting.update' and entity_key='test.secret' order by created_at desc limit 1");
    eq(r.rows[0].diff.after, '***', 'after masked');
    eq(r.rows[0].diff.before, '***', 'before masked');
  });
  await test('public_site_settings excludes secret values', async () => {
    const r = await asAnon(() => q('select * from public.public_site_settings()'));
    assert(r.rows.every((row) => row.key !== 'test.secret'), 'secret excluded from public settings');
  });

  // --- Media ------------------------------------------------------------------
  group('media');
  let mediaId;
  await test('editor registers media (has media.upload)', async () => {
    const r = await asUser(U.editor, () => q('select public.admin_register_media($1,$2,$3,$4,$5,$6) as id', [
      'cms-media/logo/abc.png', 'https://example.test/abc.png', 'Logo', 'image/png', 1234, 'logo',
    ]));
    mediaId = r.rows[0].id;
    assert(mediaId, 'media id');
  });
  await test('reject invalid media purpose', async () => {
    await expectError(
      () => asUser(U.editor, () => q('select public.admin_register_media($1,$2,$3,$4,$5,$6)', [
        'cms-media/x.png', null, '', 'image/png', 1, 'not-a-purpose',
      ])),
      'Invalid media purpose');
  });
  await test('media row cannot be deleted with a direct table write', async () => {
    await expectError(() => asUser(U.owner, () => q("delete from public.cms_media where id = $1", [mediaId])), 'permission denied');
  });
  await test('editor cannot delete media (no media.delete)', async () => {
    await expectError(
      () => asUser(U.editor, () => q('select public.admin_delete_media($1)', [mediaId])),
      'Not authorized to delete media');
  });
  await test('administrator can delete media via RPC', async () => {
    await asUser(U.admin, () => q('select public.admin_delete_media($1)', [mediaId]));
    const r = await q('select count(*)::int as n from public.cms_media where id=$1', [mediaId]);
    eq(r.rows[0].n, 0, 'media row removed');
  });
  await test('cms-media storage bucket exists and is public', async () => {
    const r = await q("select public from storage.buckets where id='cms-media'");
    eq(r.rows[0]?.public, true, 'bucket public');
  });

  // --- Roles & ownership guards ----------------------------------------------
  group('roles & guards');
  await test('non-owner cannot change roles via direct SQL', async () => {
    await expectError(
      () => asUser(U.editor, () => q("update public.admin_users set role='owner' where user_id=$1", [U.editor])),
      'permission denied');
  });
  await test('last active owner cannot be demoted', async () => {
    await expectError(
      () => asOwner(() => q("select public.admin_set_role($1,'editor','x')", [U.owner])),
      'last active owner cannot be demoted');
  });
  await test('last active owner cannot be deactivated', async () => {
    await expectError(
      () => asOwner(() => q('select public.admin_set_user_active($1,false,$2)', [U.owner, 'x'])),
      'last active owner cannot be demoted, deactivated');
  });
  await test('admin_set_user_active rejects unknown administrator', async () => {
    await expectError(
      () => asOwner(() => q('select public.admin_set_user_active($1,false,$2)', [U.outsider, 'x'])),
      'Unknown administrator');
  });
  await test('owner can promote a second owner, then demote is allowed', async () => {
    await asOwner(() => q("select public.admin_set_role($1,'owner','promote')", [U.admin]));
    eq((await q('select role from public.admin_users where user_id=$1', [U.admin])).rows[0].role, 'owner', 'promoted');
    await asOwner(() => q("select public.admin_set_role($1,'editor','demote')", [U.admin]));
    eq((await q('select role from public.admin_users where user_id=$1', [U.admin])).rows[0].role, 'editor', 'demoted');
  });

  // --- RLS / tenancy ----------------------------------------------------------
  group('rls');
  await test('anon has no SELECT privilege on admin_users', async () => {
    await expectError(() => asAnon(() => q('select * from public.admin_users')), 'permission denied');
  });
  await test('anon cannot read audit logs', async () => {
    await expectError(() => asAnon(() => q('select * from public.cms_audit_logs')), 'permission denied');
  });
  await test('editor sees only their own admin row (no users.view)', async () => {
    const r = await asUser(U.editor, () => q('select * from public.admin_users'));
    eq(r.rows.length, 1, 'own row only');
    eq(r.rows[0].user_id, U.editor, 'own id');
  });
  await test('owner sees all admin rows (users.view)', async () => {
    const r = await asOwner(() => q('select * from public.admin_users'));
    assert(r.rows.length >= 5, 'all rows');
  });

  // --- Audit append-only ------------------------------------------------------
  group('audit');
  await test('no client role may update/delete audit logs (privilege layer)', async () => {
    await expectError(() => asOwner(() => q("update public.cms_audit_logs set action='tampered'")), 'permission denied');
    await expectError(() => asOwner(() => q('delete from public.cms_audit_logs')), 'permission denied');
  });
  await test('append-only trigger blocks update even for the table owner', async () => {
    await expectError(() => q("update public.cms_audit_logs set action='tampered'"), 'append-only');
  });
  await test('append-only trigger blocks delete even for the table owner', async () => {
    await expectError(() => q('delete from public.cms_audit_logs'), 'append-only');
  });

  // --- Report -----------------------------------------------------------------
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log('\n=== LinkDit Pad backend verification ===\n');
  let lastGroup = null;
  for (const r of results) {
    if (r.group !== lastGroup) { console.log(`\n[${r.group}]`); lastGroup = r.group; }
    console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : `\n        -> ${r.err}`}`);
  }
  console.log(`\n${passed}/${results.length} passed, ${failed.length} failed\n`);
  return failed.length === 0 ? 0 : 1;
}

main()
  .then(async (code) => {
    await db.close();
    process.exit(code);
  })
  .catch(async (e) => {
    console.error('Fatal test error:', e);
    try { await db.close(); } catch { /* ignore */ }
    process.exit(2);
  });
