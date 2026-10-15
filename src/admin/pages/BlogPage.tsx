import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { roleHasPermission } from '../lib/permissions';
import { useAsync, useDocumentTitle, useUnsavedWarning } from '../lib/hooks';
import * as api from '../lib/api';
import { slugify, validateSlug } from '../lib/validation';
import type { BlogPost } from '../types';
import {
  Alert,
  Button,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  LoadingBlock,
  Mono,
  Panel,
  SectionHeader,
  Select,
  StatusBadge,
  Table,
  Td,
  Textarea,
  Th,
} from '../components/ui';

interface PostForm {
  slug: string;
  title: string;
  description: string;
  author: string;
  body: string;
  cover_media_id: string;
  cover_alt: string;
  canonical_url: string;
  seo_title: string;
  seo_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

const EMPTY: PostForm = {
  slug: '',
  title: '',
  description: '',
  author: 'LinkDit',
  body: '',
  cover_media_id: '',
  cover_alt: '',
  canonical_url: '',
  seo_title: '',
  seo_description: '',
  og_title: '',
  og_description: '',
  og_image: '',
};

const BlogPage: React.FC = () => {
  useDocumentTitle('Blog');
  const { role } = useAuth();
  const canEdit = roleHasPermission(role, 'blog.edit');
  const canPublish = roleHasPermission(role, 'blog.publish');
  const canViewMedia = roleHasPermission(role, 'media.view');

  const { data, loading, error, reload } = useAsync(() => api.listPosts(), []);
  const media = useAsync(() => (canViewMedia ? api.listMedia() : Promise.resolve([])), [canViewMedia]);
  const [form, setForm] = useState<PostForm | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [confirm, setConfirm] = useState<null | { post: BlogPost; publish: boolean }>(null);
  const [reason, setReason] = useState('');
  const [preview, setPreview] = useState(false);

  const dirty = form !== null;
  useUnsavedWarning(dirty);

  const mediaOptions = (media.data ?? []).filter((m) => m.status === 'published');

  const save = async () => {
    if (!form) return;
    setMsg(null);
    const slugCheck = validateSlug(form.slug);
    if (!slugCheck.ok) return setMsg({ tone: 'error', text: slugCheck.error ?? 'Invalid slug.' });
    if (!form.title.trim()) return setMsg({ tone: 'error', text: 'Title is required.' });

    setBusy(true);
    try {
      await api.savePost({
        ...form,
        cover_media_id: form.cover_media_id || null,
        canonical_url: form.canonical_url || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        og_title: form.og_title || null,
        og_description: form.og_description || null,
        og_image: form.og_image || null,
        status: 'draft',
        published_at: null,
      });
      setMsg({ tone: 'success', text: 'Draft saved.' });
      setForm(null);
      reload();
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Save failed.' });
    } finally {
      setBusy(false);
    }
  };

  const runConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    setMsg(null);
    try {
      await api.setPostPublished(confirm.post.id, confirm.publish, reason);
      setMsg({ tone: 'success', text: confirm.publish ? 'Post published.' : 'Post unpublished.' });
      setConfirm(null);
      setReason('');
      reload();
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Operation failed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Blog"
        description="Infrastructure for genuine articles. The public blog stays empty until real posts are published."
        actions={
          canEdit ? (
            <Button variant="primary" onClick={() => setForm({ ...EMPTY })}>
              New post
            </Button>
          ) : undefined
        }
      />

      <Alert tone="info">
        No sample posts, placeholder text or fabricated dates exist here. Drafts are never reachable by unauthenticated
        visitors, and no public article route is created for unpublished content.
      </Alert>

      {error && (
        <Alert tone="error">
          {error === 'Backend not configured.'
            ? 'Backend not configured. Blog management requires Supabase to be set up.'
            : `Could not load posts: ${error}`}
        </Alert>
      )}
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

      {form && (
        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Post draft</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setPreview((p) => !p)}>
                {preview ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>

          {preview ? (
            <article className="mt-4 max-w-2xl space-y-3">
              <h1 className="text-xl font-bold text-white">{form.title || 'Untitled'}</h1>
              <p className="text-sm text-slate-400">{form.description}</p>
              <Mono>by {form.author} · draft preview</Mono>
              <div className="whitespace-pre-wrap rounded-md border border-[#1e2a44] bg-[#0b1220] p-4 text-sm text-slate-300">
                {form.body}
              </div>
            </article>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Title" required>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm({ ...form, title, slug: form.slug || slugify(title) });
                  }}
                />
              </Field>
              <Field label="Slug" required hint="Lowercase letters, numbers and hyphens.">
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="font-mono" />
              </Field>
              <Field label="Author">
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </Field>
              <Field label="Cover image">
                <Select value={form.cover_media_id} onChange={(e) => setForm({ ...form, cover_media_id: e.target.value })}>
                  <option value="">None</option>
                  {mediaOptions.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.path}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Cover alt text">
                <Input value={form.cover_alt} onChange={(e) => setForm({ ...form, cover_alt: e.target.value })} />
              </Field>
              <Field label="Canonical URL">
                <Input value={form.canonical_url} onChange={(e) => setForm({ ...form, canonical_url: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Body" hint="Plain text or Markdown. Scripts are not permitted in generated pages.">
                  <Textarea rows={10} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
                </Field>
              </div>
              <Field label="SEO title">
                <Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
              </Field>
              <Field label="SEO description">
                <Input value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
              </Field>
              <Field label="OG title">
                <Input value={form.og_title} onChange={(e) => setForm({ ...form, og_title: e.target.value })} />
              </Field>
              <Field label="OG image URL">
                <Input value={form.og_image} onChange={(e) => setForm({ ...form, og_image: e.target.value })} />
              </Field>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setForm(null)} disabled={busy}>
              Discard
            </Button>
            <Button variant="primary" loading={busy} onClick={save}>
              Save draft
            </Button>
          </div>
        </Panel>
      )}

      {loading ? (
        <LoadingBlock />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="No blog posts"
          description="The blog is intentionally empty. When you create genuine articles they will appear here and become eligible for publication."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Slug</Th>
              <Th>Status</Th>
              <Th>Published</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <Td>{p.title || '—'}</Td>
                <Td>
                  <Mono>{p.slug}</Mono>
                </Td>
                <Td>
                  <StatusBadge status={p.status} />
                </Td>
                <Td>
                  <Mono>{p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}</Mono>
                </Td>
                <Td className="text-right">
                  {canPublish && (
                    <Button
                      size="sm"
                      variant={p.status === 'published' ? 'ghost' : 'primary'}
                      onClick={() => setConfirm({ post: p, publish: p.status !== 'published' })}
                    >
                      {p.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.publish ? 'Publish post' : 'Unpublish post'}
        message={
          confirm?.publish
            ? `Publish "${confirm?.post.title}"? It will become publicly readable and eligible for the sitemap only after publication.`
            : `Unpublish "${confirm?.post.title}"? It will no longer be publicly readable.`
        }
        confirmLabel={confirm?.publish ? 'Publish' : 'Unpublish'}
        destructive={!confirm?.publish}
        loading={busy}
        onCancel={() => {
          setConfirm(null);
          setReason('');
        }}
        onConfirm={runConfirm}
      />
    </div>
  );
};

export default BlogPage;
