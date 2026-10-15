import React, { useMemo, useState } from 'react';
import { useAsync, useDocumentTitle } from '../lib/hooks';
import * as api from '../lib/api';
import {
  Alert,
  Button,
  EmptyState,
  Input,
  LoadingBlock,
  Mono,
  SectionHeader,
  Table,
  Td,
  Th,
} from '../components/ui';

const AuditLogsPage: React.FC = () => {
  useDocumentTitle('Audit Log');
  const [limit, setLimit] = useState(200);
  const { data, loading, error, reload } = useAsync(() => api.listAuditLogs(limit), [limit]);
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const list = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((l) =>
      [l.actor_email, l.action, l.entity_type, l.entity_key, l.decision, l.reason]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [data, query]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Audit Log"
        description="Append-only record of privileged actions. Entries cannot be edited or removed from the application."
        actions={
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-48"
              aria-label="Filter audit log"
            />
            <Button variant="secondary" onClick={reload} disabled={loading}>
              Refresh
            </Button>
          </div>
        }
      />

      <Alert tone="info">
        Every publish, approval, rejection, role change, release change and direct Owner action is recorded with the
        actor, timestamp and reason. This view is read-only by design.
      </Alert>

      {error && (
        <Alert tone="error">
          {error === 'Backend not configured.'
            ? 'Backend not configured. The audit log requires Supabase to be set up.'
            : `Could not load audit log: ${error}`}
        </Alert>
      )}

      {loading ? (
        <LoadingBlock />
      ) : rows.length === 0 ? (
        <EmptyState
          title={query ? 'No matching entries' : 'No activity recorded'}
          description={query ? 'Try a different filter.' : 'Privileged actions will be recorded here.'}
        />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Time</Th>
                <Th>Actor</Th>
                <Th>Action</Th>
                <Th>Entity</Th>
                <Th>Decision</Th>
                <Th>Reason</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <Td>
                    <Mono>{new Date(l.created_at).toLocaleString()}</Mono>
                  </Td>
                  <Td>
                    <Mono>{l.actor_email ?? l.actor_id ?? 'system'}</Mono>
                  </Td>
                  <Td>
                    <span className="font-mono text-xs text-cyan-300">{l.action}</span>
                  </Td>
                  <Td>
                    <span className="text-slate-300">{l.entity_type ?? '—'}</span>
                    {l.entity_key && <Mono className="block">{l.entity_key}</Mono>}
                  </Td>
                  <Td>{l.decision ?? '—'}</Td>
                  <Td>
                    <span className="text-slate-400">{l.reason ?? '—'}</span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {rows.length >= limit && (
            <div className="flex justify-center">
              <Button variant="secondary" onClick={() => setLimit((n) => n + 200)} disabled={loading}>
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuditLogsPage;
