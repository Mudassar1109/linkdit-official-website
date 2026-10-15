import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { roleHasPermission, isOwner } from '../lib/permissions';
import { useAsync, useDocumentTitle } from '../lib/hooks';
import * as api from '../lib/api';
import { validateExternalUrl, validateSha256 } from '../lib/validation';
import type { DownloadRelease } from '../types';
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

interface ReleaseForm {
  version: string;
  channel: DownloadRelease['channel'];
  title: string;
  release_date: string;
  release_notes: string;
  installer_url: string;
  filename: string;
  file_size: string;
  sha256: string;
  min_windows: string;
  format: DownloadRelease['format'];
}

const EMPTY_FORM: ReleaseForm = {
  version: '',
  channel: 'stable',
  title: '',
  release_date: '',
  release_notes: '',
  installer_url: '/downloads/',
  filename: '',
  file_size: '',
  sha256: '',
  min_windows: 'Windows 10/11 (64-bit)',
  format: '.exe',
};

const DownloadsPage: React.FC = () => {
  useDocumentTitle('Downloads');
  const { role } = useAuth();
  const canEdit = roleHasPermission(role, 'downloads.edit');
  const canPublish = roleHasPermission(role, 'downloads.publish');
  const owner = isOwner(role);

  const { data, loading, error, reload } = useAsync(() => api.listReleases(), []);
  const [form, setForm] = useState<ReleaseForm | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [confirm, setConfirm] = useState<null | { kind: 'publish' | 'direct' | 'rollback' | 'submit'; rel: DownloadRelease }>(null);
  const [reason, setReason] = useState('');

  const startNew = () => {
    setForm({ ...EMPTY_FORM });
    setMsg(null);
  };

  const saveForm = async () => {
    if (!form) return;
    setMsg(null);
    const urlCheck = validateExternalUrl(form.installer_url, { allowRelative: true });
    if (!urlCheck.ok) return setMsg({ tone: 'error', text: urlCheck.error ?? 'Invalid URL.' });
    if (!form.version.trim()) return setMsg({ tone: 'error', text: 'Version is required.' });
    if (!form.filename.trim()) return setMsg({ tone: 'error', text: 'Filename is required.' });
    const shaCheck = validateSha256(form.sha256);
    if (!shaCheck.ok) return setMsg({ tone: 'error', text: shaCheck.error ?? 'Invalid checksum.' });

    setBusy(true);
    try {
      await api.saveRelease({
        version: form.version.trim(),
        channel: form.channel,
        title: form.title,
        release_date: form.release_date || null,
        release_notes: form.release_notes,
        installer_url: form.installer_url.trim(),
        filename: form.filename.trim(),
        file_size: form.file_size,
        sha256: form.sha256.trim().toUpperCase(),
        min_windows: form.min_windows,
        format: form.format,
        is_available: false,
        is_current: false,
        approval_category: 'installer_release',
      });
      setMsg({ tone: 'success', text: 'Release saved as a draft. Submit it for approval before publishing.' });
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
      if (confirm.kind === 'submit') {
        await api.submitForApproval({
          category: 'installer_release',
          entity_type: 'download_release',
          entity_id: confirm.rel.id,
          title: `${confirm.rel.version} (${confirm.rel.channel})`,
          version_id: null,
          diff: null,
        });
        setMsg({ tone: 'info', text: 'Release submitted for approval.' });
      } else if (confirm.kind === 'publish') {
        await api.publishRelease(confirm.rel.id, {});
        setMsg({ tone: 'success', text: `Published ${confirm.rel.version}.` });
      } else if (confirm.kind === 'direct') {
        if (!reason.trim()) throw new Error('A reason is required.');
        await api.publishRelease(confirm.rel.id, { ownerDirect: true, reason });
        setMsg({ tone: 'success', text: `Published ${confirm.rel.version} directly (reason recorded).` });
      } else if (confirm.kind === 'rollback') {
        if (!reason.trim()) throw new Error('A reason is required.');
        await api.rollbackRelease(confirm.rel.id, reason);
        setMsg({ tone: 'success', text: `Current release pointer restored to ${confirm.rel.version}.` });
      }
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
        title="Downloads & Releases"
        description="Release metadata only. Installers keep their existing verified hosting; nothing is deleted by editing a form."
        actions={
          canEdit ? (
            <Button variant="primary" onClick={startNew}>
              New release
            </Button>
          ) : undefined
        }
      />

      <Alert tone="warning">
        A new installer release must be approved by an authorised reviewer or Owner before it can be published. The
        current installer is never removed or replaced by editing metadata.
      </Alert>

      {error && (
        <Alert tone="error">
          {error === 'Backend not configured.'
            ? 'Backend not configured. Release management requires Supabase to be set up.'
            : `Could not load releases: ${error}`}
        </Alert>
      )}
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

      {form && (
        <Panel className="p-5">
          <h3 className="text-sm font-semibold text-white">{form.version ? `Edit ${form.version}` : 'New release'}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Version" required hint="e.g. 0.1.2">
              <Input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
            </Field>
            <Field label="Channel">
              <Select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as ReleaseForm['channel'] })}>
                <option value="stable">stable</option>
                <option value="beta">beta</option>
                <option value="legacy">legacy</option>
              </Select>
            </Field>
            <Field label="Title">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Release date">
              <Input type="date" value={form.release_date ?? ''} onChange={(e) => setForm({ ...form, release_date: e.target.value })} />
            </Field>
            <Field label="Installer URL" required hint="Relative path (/downloads/…) or an approved host (GitHub Releases).">
              <Input value={form.installer_url} onChange={(e) => setForm({ ...form, installer_url: e.target.value })} />
            </Field>
            <Field label="Filename" required>
              <Input value={form.filename} onChange={(e) => setForm({ ...form, filename: e.target.value })} />
            </Field>
            <Field label="File size" hint="e.g. 5.98 MB">
              <Input value={form.file_size} onChange={(e) => setForm({ ...form, file_size: e.target.value })} />
            </Field>
            <Field label="Format">
              <Select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value as ReleaseForm['format'] })}>
                <option value=".exe">.exe</option>
                <option value=".msi">.msi</option>
                <option value=".msix">.msix</option>
                <option value=".zip">.zip</option>
              </Select>
            </Field>
            <Field label="SHA-256" required hint="64 hexadecimal characters.">
              <Input value={form.sha256} onChange={(e) => setForm({ ...form, sha256: e.target.value })} className="font-mono" />
            </Field>
            <Field label="Minimum Windows">
              <Input value={form.min_windows} onChange={(e) => setForm({ ...form, min_windows: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Release notes">
                <Textarea rows={4} value={form.release_notes} onChange={(e) => setForm({ ...form, release_notes: e.target.value })} />
              </Field>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setForm(null)} disabled={busy}>
              Cancel
            </Button>
            <Button variant="primary" loading={busy} onClick={saveForm}>
              Save draft
            </Button>
          </div>
        </Panel>
      )}

      {loading ? (
        <LoadingBlock />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No releases recorded" description="Create a release to manage its metadata and citation." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Version</Th>
              <Th>Channel</Th>
              <Th>Format</Th>
              <Th>Status</Th>
              <Th>Current</Th>
              <Th>SHA-256</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id}>
                <Td>
                  <span className="font-mono text-xs text-slate-200">{r.version}</span>
                  <div className="text-[11px] text-slate-500">{r.release_date ?? '—'}</div>
                </Td>
                <Td>{r.channel}</Td>
                <Td>{r.format}</Td>
                <Td>
                  <StatusBadge status={r.status} />
                </Td>
                <Td>{r.is_current && r.status === 'published' ? <span className="text-emerald-400">Yes</span> : '—'}</Td>
                <Td>
                  <Mono className="text-[10px]">{r.sha256.slice(0, 16)}…</Mono>
                </Td>
                <Td className="text-right">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {canEdit && r.status !== 'published' && r.status !== 'submitted' && (
                      <Button size="sm" variant="gold" onClick={() => setConfirm({ kind: 'submit', rel: r })}>
                        Submit
                      </Button>
                    )}
                    {canPublish && r.status === 'approved' && (
                      <Button size="sm" variant="primary" onClick={() => setConfirm({ kind: 'publish', rel: r })}>
                        Publish
                      </Button>
                    )}
                    {canPublish && owner && r.status !== 'published' && (
                      <Button size="sm" variant="danger" onClick={() => setConfirm({ kind: 'direct', rel: r })}>
                        Direct
                      </Button>
                    )}
                    {roleHasPermission(role, 'rollback.execute') && r.status === 'published' && (
                      <Button size="sm" variant="ghost" onClick={() => setConfirm({ kind: 'rollback', rel: r })}>
                        Set current
                      </Button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmDialog
        open={confirm !== null}
        title={
          confirm?.kind === 'submit'
            ? 'Submit release for approval'
            : confirm?.kind === 'direct'
              ? 'Publish release directly'
              : confirm?.kind === 'rollback'
                ? 'Restore current release'
                : 'Publish release'
        }
        message={
          confirm?.kind === 'submit'
            ? `Submit ${confirm.rel.version} to a reviewer? It will not be public until approved and published.`
            : confirm?.kind === 'direct'
              ? 'This bypasses the approval queue and is recorded in the audit log. Provide a reason. The installer file is not downloaded or deleted.'
              : confirm?.kind === 'rollback'
                ? `Point the "current release" at ${confirm?.rel.version}? Provide a reason.`
                : `Publish ${confirm?.rel.version} and make it the current ${confirm?.rel.channel} release?`
        }
        confirmLabel={confirm?.kind === 'submit' ? 'Submit' : confirm?.kind === 'rollback' ? 'Restore' : 'Publish'}
        destructive={confirm?.kind === 'direct' || confirm?.kind === 'rollback'}
        loading={busy}
        reason={
          confirm && (confirm.kind === 'direct' || confirm.kind === 'rollback')
            ? { required: true, value: reason, onChange: setReason }
            : undefined
        }
        onCancel={() => {
          setConfirm(null);
          setReason('');
        }}
        onConfirm={runConfirm}
      />
    </div>
  );
};

export default DownloadsPage;
