import React from 'react';
import { SettingsEditor } from '../components/SettingsEditor';
import { Alert, Mono, Panel, SectionHeader, Table, Td, Th } from '../components/ui';
import { useDocumentTitle } from '../lib/hooks';
import { ROLES, ROLE_LABELS, permissionMatrix } from '../lib/permissions';

const SettingsPage: React.FC = () => {
  useDocumentTitle('Settings');
  const matrix = permissionMatrix();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Settings"
        description="Legal configuration, security policy and the role-permission matrix."
      />

      <Alert tone="warning">
        Legal, URL, indexing and security settings are restricted. Changing them requires an Owner confirmation with a
        recorded reason, or an approved submission. Legal pages are never altered silently.
      </Alert>

      <SettingsEditor
        groups={['legal', 'security']}
        title="Legal & security settings"
        description="Official contact email, legal last-updated date and approval policy."
      />

      <Panel className="p-5">
        <h3 className="text-sm font-semibold text-white">Role-permission matrix</h3>
        <p className="mt-1 text-xs text-slate-500">
          Enforced in the database by Row Level Security and server-side functions — the UI only mirrors it.
        </p>
        <div className="mt-4">
          <Table>
            <thead>
              <tr>
                <Th>Permission</Th>
                {ROLES.map((r) => (
                  <Th key={r} className="text-center">
                    {ROLE_LABELS[r].split(' ')[0]}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.permission}>
                  <Td>
                    <Mono>{row.permission}</Mono>
                  </Td>
                  {ROLES.map((r) => (
                    <Td key={r} className="text-center">
                      {row.roles.includes(r) ? (
                        <span className="text-emerald-400">✓</span>
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Panel>
    </div>
  );
};

export default SettingsPage;
