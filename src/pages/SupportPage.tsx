import React, { useState } from 'react';
import { PageId } from '../types';
import { CONTACT_EMAIL, FAQS, PRODUCT_NAME } from '../data/websiteData';
import { PageHero } from '../components/PageHero';
import { Plus, Mail, BookOpen, MessageSquare } from 'lucide-react';

interface SupportProps {
  navigate: (page: PageId) => void;
}

export const SupportPage: React.FC<SupportProps> = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = ['All', 'General', 'Privacy', 'Features', 'Installation', 'Licensing'];

  const filteredFaqs = FAQS.filter(
    (f) => selectedCategory === 'All' || f.category === selectedCategory
  );

  return (
    <div className="border-t border-line dark:border-line-dark">
      {/* Header */}
      <PageHero
        eyebrow="Support"
        title={
          <>
            Help{' '}
            <span className="text-gradient-accent">
              &amp; answers
            </span>
          </>
        }
        description={`Answers to common questions about ${PRODUCT_NAME}, plus a direct line to a real human mailbox.`}
      />

      {/* FAQ */}
      <section className="container-narrow py-12 space-y-8">
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink dark:text-paper text-center">
            Frequently asked questions
          </h2>

          <div className="flex items-center justify-start gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'gradient-violet text-white shadow-glow'
                    : 'border border-line dark:border-line-dark text-ink-soft dark:text-paper/60 hover:border-accent hover:text-fg-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className={`card-base overflow-hidden ${isOpen ? 'card-elevated' : ''}`}>
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left font-bold text-sm text-ink dark:text-paper flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="badge-accent shrink-0">{faq.category}</span>
                    <span>{faq.question}</span>
                  </div>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 ${
                    isOpen
                      ? 'rotate-45 border-accent text-fg-accent dark:border-accent'
                      : 'border-line text-ink-mute dark:border-line-dark'
                  }`}>
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pl-[4.5rem] text-sm text-ink-soft dark:text-paper/60 leading-relaxed animate-kd-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <p className="text-center text-sm text-ink-mute dark:text-paper/45">
            No questions in this category yet.
          </p>
        )}
      </section>

      {/* Direct contact — gradient CTA cards */}
      <section className="border-t border-line dark:border-line-dark">
        <div className="container-narrow py-12 grid gap-4 sm:grid-cols-2">
          <div className="card-base relative overflow-hidden p-6 space-y-3">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(60%_100%_at_20%_0%,rgba(124,58,237,0.08),transparent_75%)]"
            />
            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-fg-accent dark:bg-accent/20 dark:text-violet-200">
                <Mail className="w-5 h-5" />
              </span>
              <h3 className="font-display font-bold tracking-tight text-ink dark:text-paper">Email us</h3>
            </div>
            <p className="relative text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
              This site has no backend, so reaching us is simple: write to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-fg-accent hover:underline">
                {CONTACT_EMAIL}
              </a>
              . Include your OS and version if it is a technical question.
            </p>
          </div>

          <div className="card-base relative overflow-hidden p-6 space-y-3">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(60%_100%_at_80%_0%,rgba(192,38,211,0.08),transparent_75%)]"
            />
            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-2-soft text-fg-accent dark:bg-accent/20 dark:text-violet-200">
                <BookOpen className="w-5 h-5" />
              </span>
              <h3 className="font-display font-bold tracking-tight text-ink dark:text-paper">Read the docs</h3>
            </div>
            <p className="relative text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
              Quick start, Markdown, rich text, and themes are covered in the documentation.
            </p>
            <button
              onClick={() => navigate('docs')}
              className="btn-secondary btn-sm relative self-start"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Open documentation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};