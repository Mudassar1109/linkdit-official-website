import React from 'react';
import { SettingsEditor } from '../components/SettingsEditor';
import { Alert, Panel, SectionHeader } from '../components/ui';
import { useDocumentTitle } from '../lib/hooks';

const DesignPage: React.FC = () => {
  useDocumentTitle('Design');

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Design & Branding"
        description="Logo, favicon and app icon references, and approved accent configuration."
      />

      <Alert tone="warning">
        The current logo, favicon and public assets are preserved. Replacing branding requires an explicit, reasoned
        Owner change and is recorded in the audit log — it is never changed silently.
      </Alert>

      <Panel className="p-5">
        <h3 className="text-sm font-semibold text-white">Current brand assets</h3>
        <div className="mt-3 flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-1.5">
            <img src="/icon-128.png?v=20260918" alt="Current logo" className="h-14 w-14 rounded-lg object-contain ring-1 ring-[#2a3a5c]" />
            <span className="text-[11px] text-slate-500">Logo</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <img src="/favicon.ico?v=20260918" alt="Current favicon" className="h-10 w-10 object-contain ring-1 ring-[#2a3a5c]" />
            <span className="text-[11px] text-slate-500">Favicon</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <img src="/app-icon-1024.png?v=20260918" alt="Current app icon" className="h-14 w-14 rounded-lg object-contain ring-1 ring-[#2a3a5c]" />
            <span className="text-[11px] text-slate-500">Social / app icon</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Public asset URLs (<code className="text-cyan-300">/icon-128.png</code>,{' '}
          <code className="text-cyan-300">/favicon.ico</code>, etc.) continue to work unchanged. New media can be
          uploaded under <strong>Media &amp; Branding</strong>.
        </p>
      </Panel>

      <SettingsEditor groups={['branding']} title="Branding settings" description="Paths to approved brand assets." />
    </div>
  );
};

export default DesignPage;
