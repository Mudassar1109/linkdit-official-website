import React from 'react';
import { SettingsEditor } from '../components/SettingsEditor';
import { Alert, Mono, Panel, SectionHeader } from '../components/ui';
import { useDocumentTitle } from '../lib/hooks';

const EVENTS = [
  { name: 'page_view', where: 'Every route load and SPA navigation', status: 'Active' },
  { name: 'cta_click', where: 'Header, home hero, footer and feature CTAs', status: 'Active' },
  { name: 'download_installer', where: 'Installer download links, with version/file type', status: 'Active' },
];

const AnalyticsPage: React.FC = () => {
  useDocumentTitle('Analytics & Ads');

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics & Ads"
        description="Configure the existing Google Analytics and Google AdSense integrations and review tracked events."
      />

      <Alert tone="info">
        The existing analytics client and the AdSense publisher <code className="text-cyan-300">ca-pub-126320063770723</code>{' '}
        are preserved exactly. These screens expose only the identifiers already present in the public site — no secret
        keys — and changes require an Owner confirmation.
      </Alert>

      <SettingsEditor
        groups={['analytics', 'ads']}
        title="Integration settings"
        description="Measurement ID, AdSense publisher ID and enable flags."
        notice={
          <Alert tone="warning">
            Visitor counts and conversion reporting are only shown once a real analytics backend is configured and
            verified. This console does not display fabricated metrics.
          </Alert>
        }
      />

      <Panel className="p-5">
        <h3 className="text-sm font-semibold text-white">Tracked events</h3>
        <p className="mt-1 text-xs text-slate-500">
          Conversion events already emitted by the public site. Data collection depends on the configured Google tag.
        </p>
        <div className="mt-3 space-y-2">
          {EVENTS.map((e) => (
            <div key={e.name} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#1e2a44] bg-[#0b1220] px-3.5 py-2.5">
              <div className="min-w-0">
                <Mono className="text-cyan-300">{e.name}</Mono>
                <div className="text-[11px] text-slate-500">{e.where}</div>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-300">
                {e.status}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-md border border-[#1e2a44] bg-[#0b1220] px-3.5 py-3 text-xs text-slate-400">
          <strong className="text-slate-300">Reporting:</strong> No data available in this console. Analytics dashboard
          data is read from Google, not from this application, so nothing is displayed here until a verified reporting
          integration is connected.
        </div>
      </Panel>
    </div>
  );
};

export default AnalyticsPage;
