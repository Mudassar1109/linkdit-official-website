import React from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  align?: 'center' | 'left';
}

/**
 * Shared page masthead — "Aurora" editorial band: a quiet violet top glow,
 * mono eyebrow with a violet dash, and an oversized display title set on a
 * hairline-ruled band. Every public subpage opens with this composition.
 */
export const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, description, children, align = 'center' }) => {
  const centered = align === 'center';
  return (
    <header className="relative overflow-hidden border-b border-line dark:border-line-dark">
      {/* Violet + blue ambient glow band on the navy canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_26rem_at_50%_-30%,rgba(147,51,255,0.09),transparent_70%)] dark:bg-[radial-gradient(60rem_26rem_at_50%_-30%,rgba(147,51,255,0.2),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(34rem_18rem_at_82%_-10%,transparent,transparent)] dark:bg-[radial-gradient(34rem_18rem_at_82%_-10%,rgba(71,123,255,0.12),transparent_70%)]"
      />
      <div
        className={`container-site relative pt-14 pb-12 sm:pt-20 sm:pb-16 ${
          centered ? 'text-center' : 'text-left'
        }`}
      >
        <span
          className={`inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-accent ${
            centered ? 'justify-center' : ''
          }`}
        >
          <span aria-hidden="true" className="h-px w-6 gradient-violet" />
          {eyebrow}
          {centered && <span aria-hidden="true" className="h-px w-6 gradient-violet" />}
        </span>
        <h1
          className={`${
            centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          } mt-4 text-[2.6rem] leading-[1.0] tracking-[-0.035em] text-ink sm:text-6xl dark:text-paper`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`${
              centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
            } mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft dark:text-zinc-400`}
          >
            {description}
          </p>
        )}
        {children && (
          <div
            className={`mt-8 flex flex-wrap items-center gap-3 ${centered ? 'justify-center' : ''}`}
          >
            {children}
          </div>
        )}
      </div>
      {/* Hairline rule with violet tick — the band's signature detail */}
      <div aria-hidden="true" className="relative mx-auto max-w-[68rem] px-5 sm:px-8 lg:px-10">
        <div className="relative h-px w-full bg-line dark:bg-line-dark">
          <span className="absolute left-0 top-0 h-px w-24 gradient-violet" />
        </div>
      </div>
    </header>
  );
};
