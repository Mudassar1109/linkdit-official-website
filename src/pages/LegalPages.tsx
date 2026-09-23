import React, { useState } from 'react';
import { PageId } from '../types';
import { CONTACT_EMAIL, DOMAIN_NAME, PRODUCT_NAME } from '../data/websiteData';
import { CheckCircle } from 'lucide-react';

interface LegalProps {
  initialTab?: PageId;
  navigate: (page: PageId) => void;
}

export const LegalPages: React.FC<LegalProps> = ({ initialTab = 'privacy', navigate }) => {
  const [activeTab, setActiveTab] = useState<PageId>(initialTab);

  const tabs: { id: PageId; label: string }[] = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'license', label: 'Software License' },
    { id: 'eula', label: 'EULA' },
    { id: 'copyright', label: 'Copyright & Trademarks' },
  ];

  const handleTabChange = (tabId: PageId) => {
    setActiveTab(tabId);
    navigate(tabId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-sans space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-paper">
          LinkDit legal documentation
        </h1>
        <p className="text-xs font-mono text-ink-mute dark:text-paper/45">
          Last updated: September 2026 · Official domain: https://{DOMAIN_NAME}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 border-b border-line dark:border-line-dark scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`shrink-0 rounded-md px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                : 'text-ink-soft dark:text-paper/60 hover:bg-paper-2 dark:hover:bg-ink-850'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="bg-surface dark:bg-ink-850 border border-line dark:border-line-dark p-6 sm:p-10 space-y-6 text-sm text-ink-soft dark:text-paper/70 leading-relaxed">
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-line dark:border-line-dark pb-4">
              <h2 className="text-2xl font-bold text-ink dark:text-paper">Privacy Policy</h2>
              <p className="text-xs text-ink-mute dark:text-paper/45 mt-1">
                No telemetry, no logins, local files only.
              </p>
            </div>

            <div className="p-4 bg-accent-soft dark:bg-accent/10 border border-accent/30 text-accent-deep dark:text-blue-200 text-xs space-y-1">
              <span className="font-semibold block flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Current system architecture guarantee
              </span>
              <p>
                {PRODUCT_NAME} operates with <strong>no user logins</strong>, <strong>no cloud
                synchronization servers</strong>, <strong>no analytics pings</strong>, and{' '}
                <strong>no telemetry logging</strong>. All documents and notes created with{' '}
                {PRODUCT_NAME} remain stored on your local computer's filesystem.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-ink dark:text-paper">1. Data collection & telemetry</h3>
              <p>
                LinkDit does not collect, track, transmit, or monetize any personal data, usage
                metrics, or document contents when you use {PRODUCT_NAME}. Text buffers and workspace
                state are kept in system memory and local disk storage.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">2. Network connectivity</h3>
              <p>
                {PRODUCT_NAME} does not require an active internet connection to function. The
                application has no background network calls and no remote error reporting.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">3. Future updates disclaimer</h3>
              <p>
                Future releases may introduce optional, opt-in capabilities such as local language
                model support or import/export tooling. Any such feature will be disabled by default,
                and never affects the local, offline workflow.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">
                4. This website (not the app)
              </h3>
              <p>
                linkdit.online is a static website used to present, document, and distribute{' '}
                {PRODUCT_NAME}. Browsing it does not require an account, and it sets no cookies, shows
                no ads, and runs no analytics or tracking scripts. To render its typefaces, the site loads
                fonts from Google Fonts, which means your browser contacts Google's servers to fetch those
                font files; this is a standard, passive request and does not expose the content of the pages
                you view. When you switch between the site's light and dark themes, your choice is kept in
                your browser's local storage (the "linkdit-theme" key) so the preference is remembered on
                return visits; this data never leaves your browser. The site collects no personal data and
                has no login, comment, or form features. All requests are served over HTTPS.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">
                5. Third-party services
              </h3>
              <p>
                The only third-party service used by this website is Google Fonts, which serves the
                site's typefaces as described above. {PRODUCT_NAME} itself makes no network calls. No
                advertising network, advertising cookies, or advertising identifiers are used
                anywhere on this site.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">
                6. Contact about privacy
              </h3>
              <p>
                If you have questions about this Privacy Policy or about how {PRODUCT_NAME} or this
                website handles privacy, email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-accent-deep dark:text-blue-300 hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div className="border-b border-line dark:border-line-dark pb-4">
              <h2 className="text-2xl font-bold text-ink dark:text-paper">Terms of Service</h2>
              <p className="text-xs text-ink-mute dark:text-paper/45 mt-1">
                Terms governing the use of linkdit.online and {PRODUCT_NAME}.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-ink dark:text-paper">1. Acceptance of terms</h3>
              <p>
                By using this website, downloading the software, or installing {PRODUCT_NAME} from
                https://{DOMAIN_NAME}, you agree to be bound by these Terms of Service. If you do not
                agree, do not use the website or install or use the software.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">
                2. Website terms and software license
              </h3>
              <p>
                These Terms of Service govern your use of the linkdit.online website itself. The use,
                installation, and redistribution of the {PRODUCT_NAME} desktop software are separately
                governed by the Software License Agreement and the End User License Agreement
                (EULA) on this site. Where those agreements differ from these Terms, the software
                agreements control with respect to the software.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">3. Permitted use</h3>
              <p>
                You may use this website to read about, download, and learn how to use {PRODUCT_NAME}.
                Subject to the Software License and the EULA, you may also use {PRODUCT_NAME} for
                personal, academic, professional, or commercial writing and software development
                activities.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">4. User responsibilities</h3>
              <p>
                You agree to use this website and the software lawfully and not to interfere with their
                normal operation, attempt to gain unauthorized access to any part of the website, or
                use them to violate the rights of others. You are responsible for backing up your own
                documents and for any content you create or store.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">5. Intellectual property</h3>
              <p>
                The content of this website and the {PRODUCT_NAME} software are protected by copyright
                and other intellectual property laws. Nothing in these Terms grants you ownership of
                the website, its content, or the software. Any marks, names, and logos on this site are
                used as described in the Copyright & Trademarks section.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">6. Limitation of liability</h3>
              <p>
                {PRODUCT_NAME} is provided "AS IS" without warranty of any kind. LinkDit shall not be
                liable for any data loss, filesystem corruption, or indirect damages resulting from
                software operation. Users are encouraged to keep regular backups of critical documents.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">7. Changes to these terms</h3>
              <p>
                LinkDit may revise these Terms of Service from time to time. The "Last updated" date at
                the top of this page indicates when the current version took effect. Continued use of
                the website or the software after changes are posted constitutes acceptance of the
                revised terms.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">8. Contact</h3>
              <p>
                Questions about these Terms of Service can be sent to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-accent-deep dark:text-blue-300 hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {activeTab === 'license' && (
          <div className="space-y-6">
            <div className="border-b border-line dark:border-line-dark pb-4">
              <h2 className="text-2xl font-bold text-ink dark:text-paper">Software License Agreement</h2>
              <p className="text-xs text-ink-mute dark:text-paper/45 mt-1">
                End-user licensing terms for {PRODUCT_NAME}.
              </p>
            </div>

            <div className="space-y-3">
              <p>
                This Software License Agreement applies to the {PRODUCT_NAME} desktop software, and is
                separate from the website Terms of Service, which govern your use of linkdit.online.
              </p>
              <p>
                {PRODUCT_NAME} is distributed free of charge for desktop installations. You may
                install and run the software on any number of personal or workstation computers,
                for personal, academic, professional, or commercial purposes.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">1. Restrictions</h3>
              <p>
                You may not reverse engineer, decompile, or disassemble the compiled binaries of{' '}
                {PRODUCT_NAME}, except to the extent expressly permitted by applicable law. You may
                not repackage or redistribute installer binaries under modified branding without
                prior written consent. This license does not transfer ownership of the software to you.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">2. No warranty</h3>
              <p>
                The software is provided "AS IS", without warranty of any kind, express or implied. Your
                use of the software is at your own risk.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">3. Contact</h3>
              <p>
                Questions about this license can be sent to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-accent-deep dark:text-blue-300 hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {activeTab === 'eula' && (
          <div className="space-y-6">
            <div className="border-b border-line dark:border-line-dark pb-4">
              <h2 className="text-2xl font-bold text-ink dark:text-paper">End User License Agreement</h2>
              <p className="text-xs text-ink-mute dark:text-paper/45 mt-1">
                Desktop software agreement for Windows installations.
              </p>
            </div>

            <div className="space-y-3">
              <p>
                IMPORTANT — READ CAREFULLY: This End-User License Agreement ("EULA") is a legal
                agreement between you (an individual or entity) and LinkDit for {PRODUCT_NAME}. By
                downloading, installing, or using the software, you accept the terms of this EULA
                and the Software License Agreement.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">1. License grant</h3>
              <p>
                Subject to the terms of this EULA, LinkDit grants you a personal, non-exclusive,
                non-transferable, revocable license to install and use {PRODUCT_NAME} on any number of
                personal or workstation computers you own or control, for personal, academic,
                professional, or commercial purposes. This EULA does not grant you ownership of the
                software; title and intellectual property rights remain with LinkDit.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">2. Software installation</h3>
              <p>
                You may install {PRODUCT_NAME} using the official Windows Setup (.exe), v0.1.2, the
                legacy Enterprise MSI (.msi) package, or the legacy Setup.exe (v1.0.0), all downloaded
                from https://{DOMAIN_NAME}/download.
                Other package formats may be added when they are published.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">3. Restrictions</h3>
              <p>
                You may not reverse engineer, decompile, or disassemble the software, except to the
                extent expressly permitted by applicable law, and you may not repackage or redistribute
                the installer under modified branding without prior written consent. You may not use
                the software (including the private, offline edition) in any manner that violates
                applicable law.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">4. Termination</h3>
              <p>
                Without prejudice to any other rights, LinkDit may terminate this EULA if you fail to
                comply with its terms. In such event, you must uninstall all copies of the software.
              </p>

              <h3 className="text-base font-semibold text-ink dark:text-paper">5. Contact</h3>
              <p>
                Questions about this EULA can be sent to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-accent-deep dark:text-blue-300 hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {activeTab === 'copyright' && (
          <div className="space-y-6">
            <div className="border-b border-line dark:border-line-dark pb-4">
              <h2 className="text-2xl font-bold text-ink dark:text-paper">Copyright & Trademarks</h2>
              <p className="text-xs text-ink-mute dark:text-paper/45 mt-1">
                Intellectual property details for LinkDit and {PRODUCT_NAME}.
              </p>
            </div>

            <div className="space-y-3">
              <p>© 2026 LinkDit. All rights reserved.</p>
              <p>
                "LinkDit", "{PRODUCT_NAME}", and the {PRODUCT_NAME} visual branding identify the
                software and services offered by LinkDit and are used on this website as its marks.
              </p>
              <p>
                Microsoft and Windows are trademarks of Microsoft Corporation, whose products are
                referenced solely to describe compatibility. This website and {PRODUCT_NAME} are not
                affiliated with, endorsed by, or sponsored by Microsoft. All other trademarks are
                property of their respective owners.
              </p>
              <p>
                If you have a question about the use of these marks, contact{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-accent-deep dark:text-blue-300 hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};