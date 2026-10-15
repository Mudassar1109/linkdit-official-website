import React from 'react';
import { SettingsEditor } from '../components/SettingsEditor';
import { Alert, Panel, SectionHeader } from '../components/ui';
import { useDocumentTitle } from '../lib/hooks';

const SeoPage: React.FC = () => {
  useDocumentTitle('SEO');

  return (
    <div className="space-y-6">
      <SectionHeader
        title="SEO"
        description="Page titles, meta descriptions, canonical base, robots policy and sitemap inclusion."
      />

      <Alert tone="warning">
        Critical SEO and indexing settings are restricted and require an Owner change with a recorded reason. Existing
        defaults (titles, descriptions, canonical URLs, robots.txt and sitemap) are preserved when no override exists.
        Private admin pages are never added to the public sitemap.
      </Alert>

      <SettingsEditor
        groups={['seo']}
        title="SEO settings"
        description="Overrides apply on top of the code-defined defaults; absent values fall back to those defaults."
      />

      <Panel className="p-5">
        <h3 className="text-sm font-semibold text-white">Current public SEO surface</h3>
        <ul className="mt-3 space-y-2 text-xs text-slate-400">
          <li>• Titles &amp; descriptions: defined per route in <code className="text-cyan-300">src/config.ts</code> and applied by the SEO component.</li>
          <li>• Canonical URLs, Open Graph and Twitter card tags: applied per route.</li>
          <li>• Structured data: SoftwareApplication &amp; WebSite JSON-LD in <code className="text-cyan-300">index.html</code>, kept intact.</li>
          <li>• <code className="text-cyan-300">robots.txt</code> and <code className="text-cyan-300">sitemap.xml</code> remain in <code className="text-cyan-300">public/</code>; <code className="text-cyan-300">/admin</code> is disallowed and marked noindex.</li>
        </ul>
      </Panel>
    </div>
  );
};

export default SeoPage;
