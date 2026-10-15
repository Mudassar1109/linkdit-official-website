import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { isOwner } from '../lib/permissions';
import { useAsync, useUnsavedWarning } from '../lib/hooks';
import * as api from '../lib/api';
import type { SiteSetting } from '../types';
import { Alert, Button, ConfirmDialog, EmptyState, Input, LoadingBlock, Mono, Panel, Select, StatusBadge } from './ui';

interface SettingsEditorProps {
  groups: SiteSetting['group'][];
  title: string;
  description?: string;
  /** Optional note rendered above the list (e.g. analytics not configured). */
  notice?: React.ReactNode;
}

export const SettingsEditor: React.FC<SettingsEditorProps> = ({ groups, title, description, notice }) => {
  const { role } = useAuth();
  const owner = isOwner(role);
  const { data, loading, error, reload } = useAsync(() => api.listSettings(), []);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [reasonFor, setReasonFor] = useState<SiteSetting | null>(null);
  const [reason, setReason] = useState('');

  const settings = (data ?? []).filter((s) => groups.includes(s.group));
  const dirty = Object.keys(edits).some((k) => {
    const s = settings.find((x) => x.key === k);
    return s ? edits[k] !== s.value : false;
  });
  useUnsavedWarning(dirty);

  const valueOf = (s: SiteSetting) => edits[s.key] ?? s.value;

  const save = async (s: SiteSetting, ownerDirect: boolean, reasonText: string) => {
    setBusyKey(s.key);
    setMsg(null);
    try {
      await api.updateSetting(s.key, valueOf(s), { ownerDirect, reason: reasonText });
      setEdits((e) => {
        const next = { ...e };
        delete next[s.key];
        return next;
      });
      setMsg({ tone: 'success', text: `Saved "${s.key}".` });
      setReasonFor(null);
      setReason('');
      reload();
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Save failed.' });
    } finally {
      setBusyKey(null);
    }
  };

  const onSaveClick = (s: SiteSetting) => {
    if (s.restricted) {
      if (!owner) {
        setMsg({ tone: 'info', text: 'This setting is restricted and can only be changed by an Owner.' });
        return;
      }
      setReasonFor(s);
    } else {
      void save(s, false, '');
    }
  };

  return (
    <Panel className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-200">
          {owner ? 'Owner override available' : 'Restricted settings are Owner-only'}
        </span>
      </div>

      {notice && <div className="mt-3">{notice}</div>}
      {msg && (
        <div className="mt-3">
          <Alert tone={msg.tone}>{msg.text}</Alert>
        </div>
      )}
      {error && (
        <div className="mt-3">
          <Alert tone="error">
            {error === 'Backend not configured.'
              ? 'Backend not configured. Settings are unavailable until Supabase is set up.'
              : `Could not load settings: ${error}`}
          </Alert>
        </div>
      )}

      {loading ? (
        <LoadingBlock />
      ) : settings.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No settings in this group" description="Run the seed migration to register baseline settings." />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {settings.map((s) => {
            const val = valueOf(s);
            const changed = val !== s.value;
            const id = `setting-${s.key}`;
            return (
              <div key={s.key} className="rounded-md border border-[#1e2a44] bg-[#0b1220] p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor={id} className="text-xs font-medium text-slate-200">
                    {s.label || s.key}
                  </label>
                  <div className="flex items-center gap-2">
                    {s.restricted && <StatusBadge status="restricted" />}
                    {changed && <span className="text-[11px] text-amber-300">Unsaved</span>}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-start gap-2">
                  <div className="min-w-[240px] flex-1">
                    {s.value_type === 'boolean' ? (
                      <Select
                        id={id}
                        value={val}
                        onChange={(e) => setEdits((prev) => ({ ...prev, [s.key]: e.target.value }))}
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </Select>
                    ) : s.value_type === 'json' ? (
                      <Input
                        id={id}
                        value={val}
                        onChange={(e) => setEdits((prev) => ({ ...prev, [s.key]: e.target.value }))}
                        className="font-mono"
                      />
                    ) : (
                      <Input id={id} value={val} onChange={(e) => setEdits((prev) => ({ ...prev, [s.key]: e.target.value }))} />
                    )}
                    <Mono className="mt-1 block">{s.key}</Mono>
                  </div>
                  <Button
                    size="sm"
                    variant={s.restricted ? 'gold' : 'secondary'}
                    disabled={!changed || busyKey === s.key}
                    loading={busyKey === s.key}
                    onClick={() => onSaveClick(s)}
                  >
                    {s.restricted ? 'Save (Owner)' : 'Save'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={reasonFor !== null}
        title="Confirm restricted change"
        message={`"${reasonFor?.label || reasonFor?.key}" affects analytics, ads, legal or indexing configuration. This change is recorded with your reason.`}
        confirmLabel="Save change"
        loading={busyKey !== null}
        reason={{ required: true, value: reason, onChange: setReason }}
        onCancel={() => {
          setReasonFor(null);
          setReason('');
        }}
        onConfirm={() => reasonFor && save(reasonFor, true, reason)}
      />
    </Panel>
  );
};
