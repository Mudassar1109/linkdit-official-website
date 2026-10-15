import React, { useRef, useState } from 'react';
import { useAuth } from '../lib/auth';
import { roleHasPermission } from '../lib/permissions';
import { useAsync, useDocumentTitle } from '../lib/hooks';
import * as api from '../lib/api';
import { safeFileName, validateImageFile } from '../lib/validation';
import type { MediaAsset } from '../types';
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
} from '../components/ui';

const PURPOSES: MediaAsset['purpose'][] = ['logo', 'favicon', 'banner', 'feature', 'screenshot', 'blog-cover', 'general'];

const MediaPage: React.FC = () => {
  useDocumentTitle('Media');
  const { role } = useAuth();
  const canUpload = roleHasPermission(role, 'media.upload');
  const canDelete = roleHasPermission(role, 'media.delete');

  const { data, loading, error, reload } = useAsync(() => api.listMedia(), []);
  const [purpose, setPurpose] = useState<MediaAsset['purpose']>('general');
  const [alt, setAlt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [toDelete, setToDelete] = useState<MediaAsset | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onUpload = async () => {
    setMsg(null);
    if (!file) {
      setMsg({ tone: 'error', text: 'Choose an image file.' });
      return;
    }
    const check = validateImageFile(file, { allowSvg: purpose === 'logo' || purpose === 'favicon' });
    if (!check.ok) {
      setMsg({ tone: 'error', text: check.error ?? 'Invalid file.' });
      return;
    }
    setBusy(true);
    try {
      const name = safeFileName(file.name);
      const path = `${purpose}/${Date.now()}-${name}`;
      await api.uploadMedia(file, { purpose, alt_text: alt.trim(), sanitizedPath: path });
      setMsg({ tone: 'success', text: 'Uploaded.' });
      setFile(null);
      setAlt('');
      if (fileRef.current) fileRef.current.value = '';
      reload();
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Upload failed.' });
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await api.deleteMedia(toDelete.id, toDelete.path);
      setMsg({ tone: 'success', text: 'Media deleted.' });
      setToDelete(null);
      reload();
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Delete failed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Media & Branding" description="Upload and manage approved imagery. Executables and unsupported formats are rejected." />

      {error && (
        <Alert tone="error">
          {error === 'Backend not configured.'
            ? 'Backend not configured. Media management requires Supabase Storage to be set up.'
            : `Could not load media: ${error}`}
        </Alert>
      )}
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

      {canUpload && (
        <Panel className="p-5">
          <h3 className="text-sm font-semibold text-white">Upload</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Field label="Image file" required hint="PNG, JPEG, WebP, GIF, ICO (max 8 MB). SVG only for logo/favicon.">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/x-icon,image/svg+xml"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-[#1b2942] file:px-3 file:py-2 file:text-xs file:text-slate-100"
              />
            </Field>
            <Field label="Purpose">
              <Select value={purpose} onChange={(e) => setPurpose(e.target.value as MediaAsset['purpose'])}>
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Alt text" hint="Required for accessibility.">
              <Input value={alt} onChange={(e) => setAlt(e.target.value)} />
            </Field>
          </div>
          <div className="mt-4">
            <Button variant="primary" loading={busy} onClick={onUpload}>
              Upload image
            </Button>
          </div>
        </Panel>
      )}

      {loading ? (
        <LoadingBlock />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No media yet" description="Uploaded images appear here with preview and alt text." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((m) => (
            <MediaCard
              key={m.id}
              asset={m}
              canDelete={canDelete}
              canEdit={canUpload}
              onDelete={() => setToDelete(m)}
              onChanged={reload}
              onError={(text) => setMsg({ tone: 'error', text })}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete media"
        message={`Delete "${toDelete?.path}"? This removes the object from storage and its metadata. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

interface CardProps {
  asset: MediaAsset;
  canDelete: boolean;
  canEdit: boolean;
  onDelete: () => void;
  onChanged: () => void;
  onError: (text: string) => void;
}

const MediaCard: React.FC<CardProps> = ({ asset, canDelete, canEdit, onDelete, onChanged, onError }) => {
  const [alt, setAlt] = useState(asset.alt_text);
  const [busy, setBusy] = useState(false);
  const url = asset.public_url ?? `/storage/${asset.path}`;

  const saveAlt = async () => {
    setBusy(true);
    try {
      await api.updateMediaAlt(asset, alt);
      onChanged();
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Could not save alt text.');
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (status: MediaAsset['status']) => {
    setBusy(true);
    try {
      await api.setMediaStatus(asset.id, status);
      onChanged();
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Could not update status.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel className="overflow-hidden">
      <div className="flex h-36 items-center justify-center bg-[#0b1220] p-3">
        <img src={url} alt={asset.alt_text} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="space-y-2 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={asset.status} />
          <Mono>{asset.purpose}</Mono>
        </div>
        <Mono className="block truncate">{asset.path}</Mono>
        <Field label="Alt text">
          <Input value={alt} onChange={(e) => setAlt(e.target.value)} disabled={!canEdit} />
        </Field>
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Button size="sm" variant="secondary" disabled={busy || alt === asset.alt_text} onClick={saveAlt}>
              Save alt
            </Button>
          )}
          {canEdit && asset.status !== 'published' && (
            <Button size="sm" variant="secondary" disabled={busy} onClick={() => setStatus('published')}>
              Publish
            </Button>
          )}
          {canEdit && asset.status === 'published' && (
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setStatus('draft')}>
              Unpublish
            </Button>
          )}
          {canDelete && (
            <Button size="sm" variant="danger" disabled={busy} onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </Panel>
  );
};

export default MediaPage;
