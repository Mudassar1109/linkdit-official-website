import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS, roleHasPermission, type Role } from '../lib/permissions';
import { useAsync, useDocumentTitle } from '../lib/hooks';
import * as api from '../lib/api';
import type { AdminUser } from '../types';
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
  Table,
  Td,
  Th,
} from '../components/ui';

type Pending =
  | { kind: 'role'; user: AdminUser; next: Role }
  | { kind: 'active'; user: AdminUser; next: boolean }
  | null;

const UsersPage: React.FC = () => {
  useDocumentTitle('Users & Roles');
  const { role, user } = useAuth();
  const canManage = roleHasPermission(role, 'users.manage');

  const { data, loading, error, reload } = useAsync(() => api.listAdminUsers(), []);
  const [pending, setPending] = useState<Pending>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('editor');
  const [inviteReason, setInviteReason] = useState('');

  const runPending = async () => {
    if (!pending) return;
    if (!reason.trim()) return setMsg({ tone: 'error', text: 'A reason is required.' });
    setBusy(true);
    setMsg(null);
    try {
      if (pending.kind === 'role') {
        await api.setUserRole(pending.user.user_id, pending.next, reason);
        setMsg({ tone: 'success', text: `Role updated for ${pending.user.email}.` });
      } else {
        await api.setUserActive(pending.user.user_id, pending.next, reason);
        setMsg({ tone: 'success', text: `${pending.next ? 'Activated' : 'Deactivated'} ${pending.user.email}.` });
      }
      setPending(null);
      setReason('');
      reload();
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Operation failed.' });
    } finally {
      setBusy(false);
    }
  };

  const runInvite = async () => {
    setMsg(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inviteEmail)) {
      return setMsg({ tone: 'error', text: 'Enter a valid email address.' });
    }
    if (!inviteReason.trim()) return setMsg({ tone: 'error', text: 'A reason is required.' });
    setBusy(true);
    try {
      await api.inviteAdmin(inviteEmail.trim().toLowerCase(), inviteRole, inviteReason);
      setMsg({ tone: 'success', text: `Invitation recorded for ${inviteEmail}.` });
      setInviteOpen(false);
      setInviteEmail('');
      setInviteReason('');
      reload();
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Invite failed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Users & Roles"
        description="Administrator accounts and their assigned roles. Role changes require a reason and are audited."
        actions={
          canManage ? (
            <Button variant="primary" onClick={() => setInviteOpen((v) => !v)}>
              {inviteOpen ? 'Close' : 'Invite admin'}
            </Button>
          ) : undefined
        }
      />

      <Alert tone="warning">
        The initial Owner is provisioned once through the secure database bootstrap function; it is never created from
        this screen. You cannot change your own role or deactivate your own account here.
      </Alert>

      {error && (
        <Alert tone="error">
          {error === 'Backend not configured.'
            ? 'Backend not configured. User management requires Supabase to be set up.'
            : `Could not load administrators: ${error}`}
        </Alert>
      )}
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

      {inviteOpen && canManage && (
        <Panel className="p-5">
          <h3 className="text-sm font-semibold text-white">Invite administrator</h3>
          <p className="mt-1 text-xs text-slate-500">
            The account is created in Supabase Auth; access only becomes active once the invitation is accepted and the
            role is recorded.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Email" required>
              <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </Field>
            <Field label="Role">
              <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as Role)}>
                {ROLES.filter((r) => r !== 'owner').map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Reason" required>
              <Input value={inviteReason} onChange={(e) => setInviteReason(e.target.value)} />
            </Field>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="primary" loading={busy} onClick={runInvite}>
              Send invitation
            </Button>
          </div>
        </Panel>
      )}

      {loading ? (
        <LoadingBlock />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No administrators" description="Administrator accounts appear here once provisioned." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Account</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Added</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => {
              const isSelf = u.user_id === user?.id;
              return (
                <tr key={u.user_id}>
                  <Td>
                    <div className="text-slate-200">
                      {u.display_name ?? u.email} {isSelf && <span className="text-[11px] text-cyan-400">(you)</span>}
                    </div>
                    <Mono>{u.email}</Mono>
                  </Td>
                  <Td>
                    {canManage && !isSelf ? (
                      <Select
                        value={u.role}
                        onChange={(e) => setPending({ kind: 'role', user: u, next: e.target.value as Role })}
                        aria-label={`Role for ${u.email}`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <span>{ROLE_LABELS[u.role]}</span>
                    )}
                  </Td>
                  <Td>
                    <span className={u.is_active ? 'text-emerald-400' : 'text-rose-400'}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </Td>
                  <Td>
                    <Mono>{new Date(u.created_at).toLocaleDateString()}</Mono>
                  </Td>
                  <Td className="text-right">
                    {canManage && !isSelf ? (
                      <Button
                        size="sm"
                        variant={u.is_active ? 'danger' : 'secondary'}
                        onClick={() => setPending({ kind: 'active', user: u, next: !u.is_active })}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-600">—</span>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Panel className="p-5">
        <h3 className="text-sm font-semibold text-white">Roles</h3>
        <div className="mt-3 space-y-1.5">
          {ROLES.map((r) => (
            <div key={r} className="flex flex-wrap gap-x-2 text-xs">
              <span className="font-medium text-slate-200">{ROLE_LABELS[r]}:</span>
              <span className="text-slate-400">{ROLE_DESCRIPTIONS[r]}</span>
            </div>
          ))}
        </div>
      </Panel>

      <ConfirmDialog
        open={pending !== null}
        title={
          pending?.kind === 'role'
            ? 'Change role'
            : pending?.kind === 'active' && pending.next
              ? 'Activate account'
              : 'Deactivate account'
        }
        message={
          pending?.kind === 'role'
            ? `Change ${pending.user.email} from ${ROLE_LABELS[pending.user.role]} to ${ROLE_LABELS[pending.next]}? Provide a reason.`
            : pending?.user
              ? `${pending.next ? 'Activate' : 'Deactivate'} ${pending.user.email}? Provide a reason.`
              : ''
        }
        confirmLabel="Confirm"
        destructive={pending?.kind === 'active' && !pending.next}
        loading={busy}
        reason={{ required: true, value: reason, onChange: setReason }}
        onCancel={() => {
          setPending(null);
          setReason('');
        }}
        onConfirm={runPending}
      />
    </div>
  );
};

export default UsersPage;
