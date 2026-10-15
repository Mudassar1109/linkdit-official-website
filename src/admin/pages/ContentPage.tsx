import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../lib/auth';
import { roleHasPermission, isOwner, APPROVAL_CATEGORIES, type ApprovalCategory } from '../lib/permissions';
import { useAsync, useDocumentTitle, useUnsavedWarning } from '../lib/hooks';
import * as api from '../lib/api';
import { containsDangerousMarkup, sanitizeBasicHtml } from '../lib/validation';
import type { ContentRecord, ContentVersion } from '../types';
import { Alert, Button, ConfirmDialog, EmptyState, Field, Input, LoadingBlock, Mono, Panel, SectionHeader, Select, StatusBadge, Table, Td, Textarea, Th, cx } from '../components/ui';

const CLASSIFICATIONS = ['ordinary', 'restricted'] as const;
const VALUE_TYPES = ['text', 'html', 'json', 'url'] as const;

const ContentPage: React.FC = () => {
  useDocumentTitle('Content');
  const { role } = useAuth();
  const canEdit = roleHasPermission(role, 'content.edit');
  const canPublish = roleHasPermission(role, 'content.publish');
  const canApprove = roleHasPermission(role, 'approvals.review');
  const canRollback = roleHasPermission(role, 'rollback.execute');

  const { data, loading, error, reload } = useAsync(() => api.listContent(), []);
  const [query, setQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const records = data ?? [];
  const sections = useMemo(() => Array.from(new Set(records.map((r) => r.section))).sort(), [records]);
  const filtered = records.filter((r) => {
    if (sectionFilter !== 'all' && r.section !== sectionFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return r.key.toLowerCase().includes(q) || r.section.toLowerCase().includes(q);
    }
    return true;
  });

  const selected = records.find((r) => r.key === selectedKey) ?? null;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Content"
        description="Homepage, page, legal and global content. Ordinary changes publish instantly; restricted changes require approval."
        actions={
          canEdit ? (
            <Button variant="primary" onClick={() => setShowNew(true)}>
              New field
            </Button>
          ) : undefined
        }
      />

      {error && (
        <Alert tone={error === 'Backend not configured.' ? 'error' : 'error'}>
          {error === 'Backend not configured.'
            ? 'Backend not configured. Content records are unavailable until Supabase is set up.'
            : `Could not load content: ${error}`}
        </Alert>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            placeholder="Search keys…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search content keys"
          />
        </div>
        <div className="w-48">
          <Select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} aria-label="Filter by section">
            <option value="all">All sections</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <Button variant="secondary" onClick={reload}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : records.length === 0 ? (
        <EmptyState
          title="No content records yet"
          description="Run the Supabase migrations and seed to register baseline fields, or create a field to begin."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Key</Th>
              <Th>Section</Th>
              <Th>Class</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className={cx('hover:bg-[#111d33]', selectedKey === r.key && 'bg-cyan-500/5')}>
                <Td>
                  <span className="font-mono text-xs text-slate-200">{r.key}</span>
                </Td>
                <Td>{r.section}</Td>
                <Td>
                  <StatusBadge status={r.classification} />
                </Td>
                <Td>
                  <StatusBadge status={r.status} />
                </Td>
                <Td>
                  <Mono>{new Date(r.updated_at).toLocaleDateString()}</Mono>
                </Td>
                <Td className="text-right">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedKey(r.key)}>
                    {canEdit ? 'Edit' : 'View'}
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selected && (
        <ContentEditor
          key={selected.id}
          record={selected}
          canEdit={canEdit}
          canPublish={canPublish}
          canApprove={canApprove}
          canRollback={canRollback}
          onChanged={reload}
          onClose={() => setSelectedKey(null)}
        />
      )}

      {showNew && <NewContentDialog onClose={() => setShowNew(false)} onCreated={reload} />}
    </div>
  );
};

/* ------------------------------------------------------------------------- */

interface EditorProps {
  record: ContentRecord;
  canEdit: boolean;
  canPublish: boolean;
  canApprove: boolean;
  canRollback: boolean;
  onChanged: () => void;
  onClose: () => void;
}

const ContentEditor: React.FC<EditorProps> = ({ record, canEdit, canPublish, canRollback, onChanged, onClose }) => {
  const { role } = useAuth();
  const owner = isOwner(role);
  const [value, setValue] = useState(record.value);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [confirm, setConfirm] = useState<null | { kind: 'publish' | 'submit' | 'direct' | 'rollback'; versionId?: string }>(null);
  const [reason, setReason] = useState('');
  const [versions, setVersions] = useState<ContentVersion[] | null>(null);

  const dirty = value !== record.value;
  useUnsavedWarning(dirty);

  useEffect(() => {
    setValue(record.value);
    setVersions(null);
  }, [record.id, record.value]);

  // Escape closes the editor overlay. Guarded so it never conflicts with the
  // confirmation dialog (which handles its own Escape) and never discards
  // unsaved edits.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirm === null && !dirty) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [confirm, dirty, onClose]);

  const isRestricted = record.classification === 'restricted';
  const category = (record.approval_category ?? (isRestricted ? 'legal_page' : null)) as ApprovalCategory | null;

  const loadVersions = async () => {
    try {
      setVersions(await api.listContentVersions(record.id));
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Could not load history.' });
    }
  };

  const saveDraft = async () => {
    if (containsDangerousMarkup(value) && record.value_type !== 'html') {
      setMsg({ tone: 'error', text: 'This field contains markup that is not allowed for its type.' });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await api.saveContentDraft({
        key: record.key,
        section: record.section,
        classification: record.classification,
        approval_category: record.approval_category,
        value: record.value_type === 'html' ? sanitizeBasicHtml(value) : value,
        value_type: record.value_type,
      });
      setMsg({ tone: 'success', text: 'Draft saved (new version created).' });
      onChanged();
      if (versions) await loadVersions();
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
      if (confirm.kind === 'publish') {
        await api.publishContent(record.key, null, {});
        setMsg({ tone: 'success', text: 'Published. The public site will serve this value.' });
      } else if (confirm.kind === 'direct') {
        if (!reason.trim()) throw new Error('A reason is required.');
        await api.publishContent(record.key, null, { ownerDirect: true, reason });
        setMsg({ tone: 'success', text: 'Published directly (recorded with reason).' });
      } else if (confirm.kind === 'submit') {
        if (!category) throw new Error('No approval category configured.');
        await api.submitForApproval({
          category,
          entity_type: 'content',
          entity_id: record.id,
          title: record.key,
          version_id: null,
          diff: { before: record.value, after: value },
        });
        setMsg({ tone: 'info', text: 'Submitted for approval. A reviewer will decide.' });
      } else if (confirm.kind === 'rollback' && confirm.versionId) {
        if (!reason.trim()) throw new Error('A reason is required.');
        await api.rollbackContent(record.key, confirm.versionId, reason);
        setMsg({ tone: 'success', text: 'Rolled back to the selected version.' });
      }
      setConfirm(null);
      setReason('');
      onChanged();
      if (versions) await loadVersions();
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Operation failed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${record.key}`}
    >
      {/* The editor is presented as an overlay so choosing a field is always
          visibly acknowledged. Previously it rendered inline beneath the
          (potentially long) content table, off-screen, which made the Edit
          button appear to do nothing. */}
      <Panel className="my-4 w-full max-w-3xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-sm text-white">{record.key}</h3>
            <StatusBadge status={record.classification} />
            <StatusBadge status={record.status} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {record.section} · {record.value_type}
            {isRestricted && category ? ` · requires approval: ${APPROVAL_CATEGORIES[category]?.label ?? category}` : ''}
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      {msg && (
        <div className="mt-3">
          <Alert tone={msg.tone === 'info' ? 'info' : msg.tone}>{msg.text}</Alert>
        </div>
      )}

      <div className="mt-4">
        <Field
          label="Value"
          hint={
            record.value_type === 'html'
              ? 'Limited HTML is allowed; scripts, iframes and event handlers are stripped before saving.'
              : 'Plain text. HTML tags are rejected for non-HTML fields.'
          }
        >
          <Textarea
            rows={record.value_type === 'text' ? 4 : 8}
            value={value}
            disabled={!canEdit}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {canEdit && (
          <Button variant="secondary" loading={busy} onClick={saveDraft} disabled={!dirty}>
            {dirty ? 'Save draft' : 'Saved'}
          </Button>
        )}
        {canPublish && !isRestricted && (
          <Button variant="primary" onClick={() => setConfirm({ kind: 'publish' })} disabled={dirty}>
            Publish
          </Button>
        )}
        {isRestricted && canEdit && (
          <Button variant="gold" onClick={() => setConfirm({ kind: 'submit' })} disabled={dirty}>
            Submit for approval
          </Button>
        )}
        {isRestricted && canPublish && owner && (
          <Button variant="danger" onClick={() => setConfirm({ kind: 'direct' })} disabled={dirty}>
            Publish directly (Owner)
          </Button>
        )}
        {dirty && <span className="self-center text-xs text-amber-300">Unsaved changes — save before publishing.</span>}
      </div>

      <div className="mt-6 border-t border-[#1e2a44] pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">Version history</h4>
          <Button size="sm" variant="ghost" onClick={loadVersions}>
            {versions ? 'Reload versions' : 'Load versions'}
          </Button>
        </div>
        {versions && versions.length === 0 && <p className="mt-2 text-xs text-slate-500">No versions recorded yet.</p>}
        {versions && versions.length > 0 && (
          <div className="mt-3">
            <Table>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th>Published</Th>
                  {canRollback && <Th className="text-right">Action</Th>}
                </tr>
              </thead>
              <tbody>
                {versions.map((v) => (
                  <tr key={v.id}>
                    <Td>{v.version_no}</Td>
                    <Td>
                      <StatusBadge status={v.status} />
                    </Td>
                    <Td>
                      <Mono>{new Date(v.created_at).toLocaleString()}</Mono>
                    </Td>
                    <Td>
                      <Mono>{v.published_at ? new Date(v.published_at).toLocaleString() : '—'}</Mono>
                    </Td>
                    {canRollback && (
                      <Td className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirm({ kind: 'rollback', versionId: v.id })}
                        >
                          Roll back
                        </Button>
                      </Td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm !== null}
        title={
          confirm?.kind === 'publish'
            ? 'Publish content'
            : confirm?.kind === 'direct'
              ? 'Publish restricted content directly'
              : confirm?.kind === 'submit'
                ? 'Submit for approval'
                : 'Roll back version'
        }
        message={
          confirm?.kind === 'publish'
            ? `Publish the latest saved version of "${record.key}" to the live site?`
            : confirm?.kind === 'direct'
              ? 'This bypasses the approval queue and is recorded in the audit log. Provide a reason.'
              : confirm?.kind === 'submit'
                ? 'Send the current draft to a reviewer. The content will not go live until approved and published.'
                : 'Restore this earlier version by creating a new published version. Provide a reason.'
        }
        confirmLabel={confirm?.kind === 'submit' ? 'Submit' : confirm?.kind === 'rollback' ? 'Roll back' : 'Publish'}
        destructive={confirm?.kind === 'rollback' || confirm?.kind === 'direct'}
        loading={busy}
        onCancel={() => {
          setConfirm(null);
          setReason('');
        }}
        onConfirm={runConfirm}
        reason={
          confirm && (confirm.kind === 'direct' || confirm.kind === 'rollback')
            ? { required: true, value: reason, onChange: setReason, hint: 'Stored in the append-only audit log.' }
            : undefined
        }
      />
      </Panel>
    </div>
  );
};

// The direct-publish control is only meaningful for an Owner; the server also
// enforces this, but the UI hides it from non-owners.

/* ------------------------------------------------------------------------- */

const NewContentDialog: React.FC<{ onClose: () => void; onCreated: () => void }> = ({ onClose, onCreated }) => {
  const [key, setKey] = useState('');
  const [section, setSection] = useState('home');
  const [classification, setClassification] = useState<(typeof CLASSIFICATIONS)[number]>('ordinary');
  const [valueType, setValueType] = useState<(typeof VALUE_TYPES)[number]>('text');
  const [category, setCategory] = useState<ApprovalCategory>('legal_page');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setError(null);
    if (!/^[a-z0-9_.-]{1,120}$/.test(key)) {
      setError('Key must be lowercase letters, numbers, dots, dashes or underscores.');
      return;
    }
    setBusy(true);
    try {
      await api.saveContentDraft({
        key,
        section,
        classification,
        approval_category: classification === 'restricted' ? category : null,
        value: '',
        value_type: valueType,
      });
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create field.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8">
      <Panel className="my-8 w-full max-w-md p-5">
        <h3 className="text-sm font-semibold text-white">New content field</h3>
        <div className="mt-4 space-y-4">
          <Field label="Key" required hint="e.g. home.hero.title">
            <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="section.field" />
          </Field>
          <Field label="Section">
            <Input value={section} onChange={(e) => setSection(e.target.value)} />
          </Field>
          <Field label="Classification">
            <Select value={classification} onChange={(e) => setClassification(e.target.value as typeof classification)}>
              {CLASSIFICATIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          {classification === 'restricted' && (
            <Field label="Approval category" required>
              <Select value={category} onChange={(e) => setCategory(e.target.value as ApprovalCategory)}>
                {(Object.keys(APPROVAL_CATEGORIES) as ApprovalCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {APPROVAL_CATEGORIES[c].label}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <Field label="Value type">
            <Select value={valueType} onChange={(e) => setValueType(e.target.value as typeof valueType)}>
              {VALUE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          {error && <Alert tone="error">{error}</Alert>}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="primary" onClick={create} loading={busy}>
            Create
          </Button>
        </div>
      </Panel>
    </div>
  );
};

export default ContentPage;
