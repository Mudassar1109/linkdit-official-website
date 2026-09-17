import React from 'react';
import { PageId } from '../types';
import {
  FileText,
  Shield,
  Download,
  Mail,
  Heart,
  Globe,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { DOMAIN_NAME, PRODUCT_NAME, TAGLINE } from '../data/websiteData';

interface FooterProps {
  navigate: (page: PageId) => void;
  onOpenExportZip: () => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, onOpenExportZip }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/icon-128.png"
                alt="LinkDit Pad Logo"
                className="w-8 h-8 rounded-lg shadow-xs object-contain"
              />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-white font-sans">LinkDit</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 font-semibold border border-slate-800">
                  Pad
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs max-w-sm leading-relaxed font-normal">
              {TAGLINE} The ultra-fast, distraction-free markdown and plain text editor engineered for peak focus, total privacy, and sub-120ms local performance.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Official Domain:</span>
              <a
                href={`https://${DOMAIN_NAME}`}
                target="_blank"
                rel="noreferrer"
                className="text-white hover:underline font-semibold"
              >
                https://{DOMAIN_NAME}
              </a>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('download')}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download LinkDit Pad</span>
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('products')} className="hover:text-white transition-colors">
                  LinkDit Pad
                </button>
              </li>
              <li>
                <button onClick={() => navigate('features')} className="hover:text-white transition-colors">
                  All Features
                </button>
              </li>
              <li>
                <button onClick={() => navigate('download')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Download Installers</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-900 text-emerald-400 border border-slate-800 font-bold">
                    v0.1.1
                  </span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('screenshots')} className="hover:text-white transition-colors">
                  21 Screenshots Gallery
                </button>
              </li>
              <li>
                <button onClick={() => navigate('roadmap')} className="hover:text-white transition-colors">
                  Public Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('docs')} className="hover:text-white transition-colors">
                  Documentation Hub
                </button>
              </li>
              <li>
                <button onClick={() => navigate('changelog')} className="hover:text-white transition-colors">
                  Changelog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('release-notes')} className="hover:text-white transition-colors">
                  Release Notes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('support')} className="hover:text-white transition-colors">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('license')} className="hover:text-white transition-colors">
                  Software License
                </button>
              </li>
              <li>
                <button onClick={() => navigate('eula')} className="hover:text-white transition-colors">
                  End User License (EULA)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('copyright')} className="hover:text-white transition-colors">
                  Copyright & Trademarks
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-400 font-mono">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>© 2026 LinkDit • Powered by LinkDit</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              v0.1.1
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">
              Built with React & Vite
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Zero Telemetry</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Local Files</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
