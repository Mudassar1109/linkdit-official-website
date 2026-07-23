import React, { useState } from 'react';
import { PageId } from '../types';
import { DOMAIN_NAME } from '../data/websiteData';
import { Mail, MapPin, Globe, Clock, Send, CheckCircle } from 'lucide-react';

interface ContactProps {
  navigate: (page: PageId) => void;
}

export const ContactPage: React.FC<ContactProps> = ({ navigate }) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-16 pb-16 font-sans">
      <section className="bg-slate-100 dark:bg-slate-900 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Official Corporate Inquiry
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Contact LinkDit
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Get in touch with our team for business partnerships, media inquiries, or custom enterprise licensing.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Mail className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Corporate Emails</h3>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 font-mono">
              <p>General: <a href="mailto:contact@linkdit.online" className="text-blue-600 dark:text-blue-400">contact@{DOMAIN_NAME}</a></p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <MapPin className="w-6 h-6 text-emerald-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">HQ Office Location</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              LinkDit Software Corporation<br />
              Custom Domain: https://{DOMAIN_NAME}<br />
              United States & Distributed Remote
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Clock className="w-6 h-6 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Response Time</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Inquiries are reviewed Mon–Fri. Standard response window is within 12–24 hours.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          {submitted ? (
            <div className="p-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-100">
                Message Sent Successfully
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Thank you for contacting LinkDit. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Send Us a Direct Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">First & Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Smith"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Organization / Company</label>
                <input
                  type="text"
                  placeholder="Optional company name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help your team?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
