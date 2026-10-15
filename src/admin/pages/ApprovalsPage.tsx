import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { roleHasPermission, canApproveCategory, APPROVAL_CATEGORIES, type ApprovalCategory } from '../lib/permissions';
import { useAsync, useDocumentTitle } from '../lib/hooks';
import * as api from '../lib/api';
import type { Submission } from '../types';
import {
  Alert,
  Button,
  ConfirmDialog,
  EmptyState,
  LoadingBlock,
  Mono,
  Panel,
  SectionHeader,
  Select,
  StatusBadge,
  Table,
  Td,
  Th,
} from '../components/ui';

const ApprovalsPage: React.FC = () => {
  useDocumentTitle('Approvals');
  const { role, user } = useAuth();
  const canReview = roleHasPermission(role, 'approvals.review');

  const { data, loading, error, reload } = useAsync(() => api.listSubmissions(), []);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [decision, setDecision] = useState<null | { sub: Submission; approve: boolean }>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);

  const submissions = data ?? [];
  const filtered = submissions.filter((s) => {
    if (statusFilter === 'pending') return s.status === 'submitted' || s.status === 'in_review';
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  const runDecision = async () => {
    if (!decision) return;
    setBusy(true);
    setMsg(null);
    try {
      await api.reviewSubmission(decision.sub.id, decision.approve ? 'approved' : 'rejected', reason);
      setMsg({ tone: 'success', text: decision.approve ? 'Submission approved.' : 'Submission rejected.' });
      setDecision(null);
      setReason('');
      reload();
    } catch (e) {
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Review failed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Approvals"
        description="Review restricted changes. You cannot approve your own submissions."
        actions={
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="published">Published</option>
            <option value="all">All</option>
          </Select>
        }
      />

      {error && (
        <Alert tone="error">
          {error === 'Backend not configured.'
            ? 'Backend not configured. The approval queue requires Supabase to be set up.'
            : `Could not load submissions: ${error}`}
        </Alert>
      )}
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

      {loading ? (
        <LoadingBlock />
      ) : filtered.length === 0 ? (
        <EmptyState title="Nothing to review" description="There are no submissions matching this filter." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Submitted</Th>
              <Th className="text-right">Decision</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const isOwn = s.submitted_by && s.submitted_by === user?.id;
              const mayApprove = canReview && canApproveCategory(role, s.category as ApprovalCategory) && !isOwn &&
                (s.status === 'submitted' || s.status === 'in_review');
              return (
                <tr key={s.id}>
                  <Td>
                    <div className="text-slate-200">{s.title || '—'}</div>
                    <Mono className="text-[10px]">{s.submitted_by_email ?? 'unknown'}</Mono>
                  </Td>
                  <Td>{APPROVAL_CATEGORIES[s.category as ApprovalCategory]?.label ?? s.category}</Td>
                  <Td>{s.entity_type}</Td>
                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>
                  <Td>
                    <Mono>{new Date(s.submitted_at).toLocaleString()}</Mono>
                  </Td>
                  <Td className="text-right">
                    {isOwn && (s.status === 'submitted' || s.status === 'in_review') ? (
                      <span className="text-[11px] text-slate-500">Your submission</span>
                    ) : mayApprove ? (
                      <div className="flex justify-end gap-1.5">
                        <Button size="sm" variant="primary" onClick={() => setDecision({ sub: s, approve: true })}>
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDecision({ sub: s, approve: false })}>
                          Reject
                        </Button>
                      </div>
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

      <ConfirmDialog
        open={decision !== null}
        title={decision?.approve ? 'Approve submission' : 'Reject submission'}
        message={
          decision?.approve
            ? `Approve "${decision?.sub.title}"? The change becomes eligible for publication.`
            : `Reject "${decision?.sub.title}"? A reason is required and shown to the submitter.`
        }
        confirmLabel={decision?.approve ? 'Approve' : 'Reject'}
        destructive={!decision?.approve}
        loading={busy}
        reason={{
          required: !decision?.approve,
          label: decision?.approve ? 'Note (optional)' : 'Rejection reason',
          value: reason,
          onChange: setReason,
        }}
        onCancel={() => {
          setDecision(null);
          setReason('');
        }}
        onConfirm={runDecision}
      />
    </div>
  );
};

export default ApprovalsPage;
