import React, { useState } from 'react';
import { PageId } from '../types';
import { DOWNLOAD_OPTIONS, PRODUCT_NAME, DOMAIN_NAME } from '../data/websiteData';
import {
  Download,
  ShieldCheck,
  CheckCircle,
  Clock,
  HardDrive,
  FileCode,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface DownloadPageProps {
  navigate: (page: PageId) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ navigate }) => {
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-semibold inline-block">
            Official Download Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Download {PRODUCT_NAME}
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Official production installers for LinkDit Pad are now available. Download the latest verified release for Windows 10 and Windows 11.
          </p>
        </div>
      </section>

      {/* DOWNLOAD CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DOWNLOAD_OPTIONS.map((option) => (
            <div
              key={option.id}
              className="rounded-2xl border p-6 flex flex-col justify-between space-y-6 transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {option.type}
                  </span>
                  {option.isAvailable ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3" /> Available Now
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                      <Clock className="w-3 h-3" /> Coming Soon
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                    {option.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {option.tagline}
                  </p>
                </div>

                {/* Specs Box */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{option.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span className="text-slate-800 dark:text-slate-200">{option.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Release Date:</span>
                    <span className="text-slate-800 dark:text-slate-200">{option.releaseDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Req:</span>
                    <span className="text-slate-800 dark:text-slate-200">{option.requirements}</span>
                  </div>
                </div>
              </div>

              {/* SHA256 Verification Bar */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span>SHA-256 Checksum:</span>
                  </div>
                  <p className="font-mono text-[9px] truncate bg-slate-100 dark:bg-slate-950 p-1.5 rounded text-slate-500 dark:text-slate-400 italic">
                    {option.sha256}
                  </p>
                </div>

                {/* Download CTA Action */}
                {option.isAvailable ? (
                  <a
                    href={`/downloads/${option.filename}`}
                    className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {option.format.slice(1).toUpperCase()}</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Coming Soon</span>
                  </button>
                )}

                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium leading-snug">
                  {option.isAvailable
                    ? 'Digitally signed and verified by LinkDit.'
                    : 'The official LinkDit Pad installer will be available soon.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFICATION & INTEGRITY GUARANTEE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 font-sans">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Binary Integrity & Signature Guarantee
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Official release packages are digitally signed, verified, and published by LinkDit. SHA-256 checksums are provided so users can verify download integrity.
          </p>
        </div>
      </section>
    </div>
  );
};
