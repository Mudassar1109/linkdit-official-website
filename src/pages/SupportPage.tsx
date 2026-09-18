import React, { useState } from 'react';
import { PageId } from '../types';
import { FAQS, PRODUCT_NAME, DOMAIN_NAME } from '../data/websiteData';
import { ChevronDown, Mail, BookOpen, MessageSquare } from 'lucide-react';

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
      <header className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 text-center space-y-5">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            Help & answers
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            Answers to common questions about {PRODUCT_NAME}, plus a direct line to a real human mailbox.
          </p>
        </div>
      </header>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-ink dark:text-paper text-center">
            Frequently asked questions
          </h2>

          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-md px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                    : 'border border-line dark:border-line-dark text-ink-soft dark:text-paper/60 hover:border-line-strong'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-px bg-line dark:bg-line-dark border border-line dark:border-line-dark">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="bg-surface dark:bg-ink-850">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left font-semibold text-sm text-ink dark:text-paper flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-2 dark:bg-ink-850 text-ink-mute dark:text-paper/50 shrink-0">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-mute shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 -mt-1 text-sm text-ink-soft dark:text-paper/60 leading-relaxed border-t border-line dark:border-line-dark pt-3">
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

      {/* Direct contact */}
      <section className="border-t border-line dark:border-line-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-4 sm:grid-cols-2">
          <div className="border border-line dark:border-line-dark bg-surface dark:bg-ink-850 p-6 space-y-3">
            <div className="flex items-center gap-2 text-accent-deep dark:text-blue-300">
              <Mail className="w-5 h-5" />
              <h3 className="font-semibold text-ink dark:text-paper">Email us</h3>
            </div>
            <p className="text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
              This site has no backend, so reaching us is simple: write to{' '}
              <a href={`mailto:support@${DOMAIN_NAME}`} className="font-mono text-accent-deep dark:text-blue-300 hover:underline">
                support@{DOMAIN_NAME}
              </a>
              . Include your OS and version if it is a technical question.
            </p>
          </div>

          <div className="border border-line dark:border-line-dark bg-surface dark:bg-ink-850 p-6 space-y-3">
            <div className="flex items-center gap-2 text-accent-deep dark:text-blue-300">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-semibold text-ink dark:text-paper">Read the docs</h3>
            </div>
            <p className="text-sm text-ink-soft dark:text-paper/60 leading-relaxed">
              Quick start, Markdown, rich text, and themes are covered in the documentation.
            </p>
            <button
              onClick={() => navigate('docs')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-deep dark:text-blue-300 hover:underline"
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