import React, { useState } from 'react';
import { PageId } from '../types';
import { DOMAIN_NAME, PRODUCT_NAME } from '../data/websiteData';
import { Shield, FileText, Lock, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Legal & Compliance Terms
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          LinkDit Legal Documentation
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Last Updated: July 22, 2026 • Official Domain: https://{DOMAIN_NAME}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Privacy Policy
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Zero telemetry, zero login, 100% local file control.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <span className="font-bold block flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Current System Architecture Guarantee
              </span>
              <p>
                LinkDit Pad operates with <strong>NO user logins</strong>, <strong>NO cloud synchronization servers</strong>, <strong>NO analytics pings</strong>, and <strong>NO telemetry logging</strong>. All documents and notes created using LinkDit Pad remain strictly stored on your local computer filesystem.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Data Collection & Telemetry</h3>
              <p>
                LinkDit Software Corporation does not collect, track, transmit, or monetize any personal data, usage metrics, IP addresses, or document contents when you use {PRODUCT_NAME}. All text buffers, line statistics, and workspace state are maintained entirely in volatile system RAM and local disk storage.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Network Connectivity</h3>
              <p>
                {PRODUCT_NAME} does not require an active internet connection to function. The application contains zero background network fetch loops or remote error reporting endpoints.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Future Updates Disclaimer</h3>
              <p>
                Future major releases (such as optional opt-in local AI model support or self-hosted E2EE sync modules) may introduce optional network capabilities. Any such capabilities will remain 100% opt-in and disabled by default, ensuring your existing local workflow is never compromised.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Terms of Service
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Official terms governing the use of linkdit.online and LinkDit Pad.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h3>
              <p>
                By downloading, installing, or accessing {PRODUCT_NAME} from https://{DOMAIN_NAME}, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not install or use the software.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Permitted Use</h3>
              <p>
                You are granted a non-exclusive license to use {PRODUCT_NAME} for personal, academic, professional, or commercial writing and software development activities.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Limitation of Liability</h3>
              <p>
                {PRODUCT_NAME} is provided "AS IS" without warranty of any kind. LinkDit Software Corporation shall not be liable for any data loss, filesystem corruption, or indirect damages resulting from software operation. Users are encouraged to maintain regular backups of critical documents.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'license' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Software License Agreement
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Commercial and End-User Licensing Terms for LinkDit Pad.
              </p>
            </div>

            <div className="space-y-3">
              <p>
                LinkDit Pad v1.0.0 is distributed free of charge for desktop installations. You may install and execute the software on unlimited personal or workstation computers.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Restrictions</h3>
              <p>
                You may not reverse engineer, decompile, or disassemble the compiled binaries of {PRODUCT_NAME}, except to the extent that such activity is expressly permitted by applicable law. You may not re-pack or redistribute installer binaries under modified branding without prior written consent.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'eula' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                End User License Agreement (EULA)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                End-user desktop software agreement for Windows installations.
              </p>
            </div>

            <div className="space-y-3">
              <p>
                IMPORTANT — READ CAREFULLY: This End-User License Agreement ("EULA") is a legal agreement between you (an individual or entity) and LinkDit Software Corporation for {PRODUCT_NAME}.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Software Installation</h3>
              <p>
                You may install {PRODUCT_NAME} using the official Windows Setup (.exe), Enterprise MSI (.msi), or MSIX (.msix) packages downloaded from https://{DOMAIN_NAME}/download.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Termination</h3>
              <p>
                Without prejudice to any other rights, LinkDit may terminate this EULA if you fail to comply with the terms and conditions. In such event, you must uninstall all copies of the software.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'copyright' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Copyright & Trademarks
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Intellectual property details for LinkDit and LinkDit Pad.
              </p>
            </div>

            <div className="space-y-3">
              <p>
                © 2026 LinkDit Software Corporation. All rights reserved.
              </p>
              <p>
                "LinkDit", "LinkDit Pad", "Write Better. Create Faster.", and the LinkDit Pad visual branding are trademarks or registered trademarks of LinkDit Software Corporation in the United States and other countries.
              </p>
              <p>
                Microsoft, Windows, VS Code, and Windows PowerShell are trademarks of Microsoft Corporation. All other trademarks are property of their respective owners.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
