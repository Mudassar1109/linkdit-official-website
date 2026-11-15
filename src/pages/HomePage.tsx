import React from 'react';
import { motion } from 'motion/react';
import { PageId } from '../types';
import { DOWNLOAD_FILE_SIZE, DOWNLOAD_PATH, PRODUCT_NAME, TAGLINE } from '../data/websiteData';
import { CURRENT_VERSION } from '../config';
import { trackCta } from '../lib/analytics';
import {
  Download,
  ArrowRight,
  Check,
  FileText,
  FileCode,
  Sparkles,
  Zap,
  ShieldCheck,
  WifiOff,
  ArrowUpRight,
  Crown,
  Feather,
  FolderOpen,
  Laptop,
  AppWindow,
  Braces,
  RefreshCw,
} from 'lucide-react';

interface HomePageProps {
  navigate: (page: PageId) => void;
  onOpenScreenshot: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/* Content data                                                        */
/* ------------------------------------------------------------------ */

const marqueeItems = [
  'No account required',
  'Runs fully offline',
  'Files stay on your PC',
  'Zero telemetry',
  'Plain .md & .txt files',
  'Free plan forever',
];

const stats = [
  { value: '0', label: 'accounts required', detail: 'The Free plan never asks you to sign in.' },
  { value: '100%', label: 'local files', detail: 'Plain .md and .txt on your own disk.' },
  { value: '0', label: 'telemetry', detail: 'No analytics, trackers, or pings.' },
  { value: DOWNLOAD_FILE_SIZE.replace(' MB', ''), label: 'MB installer', detail: 'A lean native Windows app.' },
];

const trustTechnologies = [
  { name: 'Windows 10/11', detail: 'Native app', icon: <AppWindow className="h-5 w-5" /> },
  { name: 'Markdown', detail: 'Plain .md & .txt', icon: <FileText className="h-5 w-5" /> },
  { name: 'Tauri + Rust', detail: 'Lean core', icon: <Zap className="h-5 w-5" /> },
  { name: 'WebView2', detail: 'Rendered UI', icon: <Laptop className="h-5 w-5" /> },
  { name: 'JSON config', detail: 'Readable settings', icon: <Braces className="h-5 w-5" /> },
  { name: 'Updates', detail: `${CURRENT_VERSION} current`, icon: <RefreshCw className="h-5 w-5" /> },
];

const featureCards = [
  {
    title: 'Distraction-Free Writing',
    desc: 'A frameless window, a calm status bar with live word counts, and per-document focus modes — nothing competes with your text.',
    icon: <Feather className="h-5 w-5" />,
  },
  {
    title: 'Markdown Powered',
    desc: 'Write Markdown or switch to a rich-text surface per document — headings, tables, task lists, highlights, links, and images.',
    icon: <FileCode className="h-5 w-5" />,
  },
  {
    title: 'Organize & Manage',
    desc: 'Multi-tab editing, a sidebar with recent and pinned files, bookmarks, document outline, and a local Trash with recovery.',
    icon: <FolderOpen className="h-5 w-5" />,
  },
  {
    title: 'Built for Windows',
    desc: `A lean native app on Tauri with a Rust core — a ${DOWNLOAD_FILE_SIZE} installer, offline from launch, with no background services.`,
    icon: <AppWindow className="h-5 w-5" />,
  },
];

const showcaseFeatures = [
  {
    index: '01',
    kicker: 'The workspace',
    title: 'A calm surface for focused writing.',
    description:
      'A frameless window with the document tab bar on top and the editor beneath. Open, edit, and save files that live on your own disk — nothing between you and the text.',
    image: '/images/software/01-main-editor.png',
    alt: 'TypoDocs Markdown editor interface',
    bullets: ['Multi-tab workspace', 'Live word counts', 'Markdown & rich text'],
  },
];

const showcaseCards = [
  {
    title: 'Editor settings',
    desc: 'Tune the editor, auto save, and appearance from one panel — everything stays on your machine.',
    image: '/images/software/02-settings-editor.png',
    alt: 'TypoDocs editor settings screen',
  },
  {
    title: 'Dark workspace',
    desc: 'Six themes and six accent colors, including a focused dark theme for low-light sessions.',
    image: '/images/software/03-workspace-dark.png',
    alt: 'TypoDocs dark workspace',
  },
  {
    title: 'Trash & recovery',
    desc: 'Deleted documents go to a local Trash, and recovery support keeps work safe after a crash.',
    image: '/images/software/04-trash-recovery.png',
    alt: 'TypoDocs trash and recovery screen',
  },
];

/* ------------------------------------------------------------------ */

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenScreenshot }) => {
  return (
    <div className="font-sans">
      {/* ============================ HERO ============================ */}
      {/* Full-bleed deep-navy aurora band with purple + blue ambient light */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(46rem 26rem at 12% -12%, rgba(147,51,255,0.38), transparent 62%), radial-gradient(40rem 22rem at 88% -6%, rgba(192,38,255,0.2), transparent 60%), radial-gradient(36rem 20rem at 70% 30%, rgba(71,123,255,0.14), transparent 65%)',
          }}
        />
        <div
          aria-hidden="true"
          className="bg-grid-dots pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent"
        />

        <div className="container-site relative grid items-center gap-14 pb-20 pt-16 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:pb-24 lg:pt-24">
          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl space-y-7"
          >
            {/* Latest release badge */}
            <span className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] py-1 pl-1.5 pr-3.5 text-xs font-medium text-zinc-300 backdrop-blur">
              <span className="inline-flex items-center gap-1 rounded-full gradient-violet px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Latest release
              </span>
              <span>
                v{CURRENT_VERSION}
                <span className="hidden sm:inline"> — free for Windows 10 &amp; 11</span>
              </span>
            </span>

            <h1 className="text-[2.7rem] leading-[1.0] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.2rem]">
              Write, Document &amp; Publish with{' '}
              <span className="text-gradient-accent" style={{ WebkitTextFillColor: 'transparent' }}>
                TypoDocs
              </span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
              {PRODUCT_NAME} is a fast, offline-first Markdown and rich-text editor. Multi-tab editing, live word
              counts, and every document stays a plain file on your own computer.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={DOWNLOAD_PATH}
                download
                onClick={() => trackCta('home_hero_download', 'home', 'Download for Windows')}
                className="btn-accent btn-lg"
              >
                <Download className="h-4 w-4" />
                <span>Download for Windows</span>
              </a>
              <button
                onClick={() => {
                  trackCta('home_hero_live_demo', 'home', 'Live Demo');
                  navigate('screenshots');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/30 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-zinc-200 transition-all hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white"
              >
                Live Demo
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              {[
                'Free to use',
                'Open formats',
                'Regular updates',
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                  <Check className="h-3.5 w-3.5 text-violet-400" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Product visual — real screenshot in a laptop mockup with purple light */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              aria-hidden="true"
              className="aurora-ring pointer-events-none absolute -inset-10 -z-10 opacity-80 sm:opacity-100"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-violet-600/20 blur-2xl"
            />

            {/* Laptop mockup — screen + base */}
            <div className="relative mx-auto w-full max-w-xl">
              <div className="relative overflow-hidden rounded-t-[1.4rem] rounded-b-lg border border-white/15 bg-[#0a0d24] p-1.5 pb-0 shadow-card-elevated">
                <div className="overflow-hidden rounded-t-[1rem] border border-white/10 bg-ink-900">
                  <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.04] px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-teal-400/80" />
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500">TypoDocs — readme.md</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-zinc-400">Markdown</span>
                      <span className="rounded-md bg-accent/30 px-2 py-0.5 font-mono text-[10px] text-violet-200">Saved</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenScreenshot('/images/software/01-main-editor.png')}
                    className="block w-full cursor-zoom-in"
                    aria-label="Open full-size editor screenshot"
                  >
                    <img
                      src="/images/software/01-main-editor.png"
                      alt="TypoDocs Markdown editor interface"
                      className="w-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                    />
                  </button>
                </div>
              </div>
              {/* Laptop base */}
              <div className="relative mx-auto h-3.5 w-[112%] max-w-none -translate-x-[5.35%] rounded-b-2xl rounded-t-sm bg-gradient-to-b from-[#262c55] to-[#12162f] shadow-lg">
                <span className="absolute left-1/2 top-0 h-1.5 w-24 -translate-x-1/2 rounded-b-lg bg-black/40" />
              </div>
            </div>

            {/* Floating chips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -left-3 bottom-14 hidden rounded-2xl border border-white/10 bg-ink-850/90 px-4 py-3 shadow-card-elevated backdrop-blur sm:block"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300">
                  <WifiOff className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-white">Offline-first</div>
                  <div className="text-[11px] text-zinc-500">No connection, ever</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="absolute -right-2 top-12 hidden rounded-2xl border border-white/10 bg-ink-850/90 px-4 py-3 shadow-card-elevated backdrop-blur sm:block"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300">
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-white">{DOWNLOAD_FILE_SIZE} installer</div>
                  <div className="text-[11px] text-zinc-500">Native Tauri app</div>
                </div>
              </div>
            </motion.div>

            <p className="mt-5 text-center font-mono text-[11px] text-zinc-600">
              Click the preview to open the full-size view
            </p>
          </motion.div>
        </div>

        {/* Marquee trust strip */}
        <div className="relative border-t border-white/[0.07] bg-white/[0.02]">
          <div className="flex overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="animate-kd-marquee flex shrink-0 items-center gap-10 pr-10">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i} className="inline-flex shrink-0 items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  <span className="h-1 w-1 rounded-full bg-violet-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TRUST / TECHNOLOGY ===================== */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-10 sm:py-12">
          <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute dark:text-zinc-500">
            Built on technologies you already trust
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {trustTechnologies.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-line bg-surface px-3 py-3 transition-all hover:border-accent/40 hover:shadow-card-hover dark:border-line-dark dark:bg-ink-850/60"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl gradient-violet text-white shadow-glow opacity-90 transition-opacity group-hover:opacity-100">
                  {t.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold text-ink dark:text-paper">{t.name}</span>
                  <span className="block truncate text-[10.5px] text-ink-mute dark:text-zinc-500">{t.detail}</span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= STAT BAND ========================== */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site grid grid-cols-2 gap-x-6 gap-y-8 py-12 lg:grid-cols-4 sm:py-14">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="min-w-0 space-y-1.5 border-l-2 border-line pl-5 dark:border-line-dark"
            >
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-display text-4xl font-bold tracking-tight text-ink sm:text-[2.75rem] dark:text-paper">
                  {s.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-mute dark:text-zinc-500">{s.label}</span>
              </div>
              <p className="max-w-[220px] text-xs leading-relaxed text-ink-soft dark:text-zinc-400">{s.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================== FOUR PREMIUM FEATURE CARDS ================= */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site py-16 sm:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
            <div className="max-w-2xl space-y-3">
              <p className="eyebrow text-fg-accent">Why TypoDocs</p>
              <h2 className="text-3xl tracking-[-0.025em] text-ink sm:text-4xl dark:text-paper">
                A focused editor for the writing you actually do.
              </h2>
              <p className="text-sm leading-relaxed text-ink-soft sm:text-base dark:text-zinc-400">
                No plugin stores to browse, no cloud dashboards to sign in to. {PRODUCT_NAME} keeps everything in one
                fast, native window.
              </p>
            </div>
            <button
              onClick={() => {
                trackCta('home_learn_features', 'home', 'All features');
                navigate('features');
              }}
              className="btn-secondary"
            >
              All features
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card, i) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="card-base card-hover group relative flex flex-col space-y-3.5 overflow-hidden p-6"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(147,51,255,0.07),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-violet text-white shadow-glow">
                  {card.icon}
                </span>
                <h3 className="relative text-[15px] font-bold tracking-tight text-ink dark:text-paper">{card.title}</h3>
                <p className="relative text-[13px] leading-relaxed text-ink-soft dark:text-zinc-400">{card.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUCT SHOWCASE — modern documentation ========== */}
      <section className="overflow-hidden border-b border-line dark:border-line-dark">
        <div className="container-site py-16 sm:py-24">
          <div className="mb-12 max-w-2xl space-y-3 sm:mb-16">
            <p className="eyebrow text-fg-accent">Product showcase</p>
            <h2 className="text-3xl tracking-[-0.025em] text-ink sm:text-4xl dark:text-paper">
              A Modern Documentation Experience.
            </h2>
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base dark:text-zinc-400">
              Real screens from the current Windows build — no mockups, no marketing renders.
            </p>
          </div>

          {/* Large product preview */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-violet-500/15 opacity-60 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-2xl border border-line shadow-card-elevated dark:border-line-dark">
              <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5 dark:border-line-dark dark:bg-white/[0.03]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-400/70" />
                </span>
                <span className="font-mono text-[11px] text-ink-mute dark:text-zinc-500">
                  {showcaseFeatures[0].kicker} — readme.md
                </span>
              </div>
              <img
                src={showcaseFeatures[0].image}
                alt={showcaseFeatures[0].alt}
                loading="lazy"
                decoding="async"
                onClick={() => onOpenScreenshot(showcaseFeatures[0].image)}
                className="aspect-[16/10] w-full cursor-zoom-in object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </motion.div>

          {/* Feature descriptions with real thumbnails */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {showcaseCards.map((card, i) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="card-base card-hover group overflow-hidden"
              >
                <button
                  onClick={() => onOpenScreenshot(card.image)}
                  className="relative block w-full cursor-zoom-in border-b border-line dark:border-line-dark"
                  aria-label={`Open ${card.title} screenshot`}
                >
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/9] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </button>
                <div className="space-y-1.5 p-5">
                  <h3 className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-ink dark:text-paper">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-ink-mute dark:text-zinc-600">
                      {String(i + 2).padStart(2, '0')}
                    </span>
                    {card.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-ink-soft dark:text-zinc-400">{card.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                trackCta('home_showcase_gallery', 'home', 'Open interface gallery');
                navigate('screenshots');
              }}
              className="btn-secondary"
            >
              View the interface gallery
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <span className="inline-flex items-center gap-2 text-sm text-ink-soft dark:text-zinc-400">
              <Sparkles className="h-4 w-4 text-fg-accent dark:text-violet-300" />
              Every preview is the shipping app
            </span>
          </div>
        </div>
      </section>

      {/* ==================== SPLIT PROMO (two cards) ================== */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="container-site grid gap-4 py-16 sm:py-20 lg:grid-cols-2">
          {/* Privacy — dark glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-950 p-8 shadow-card-elevated sm:p-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_80%_at_20%_0%,rgba(147,51,255,0.28),transparent_70%)]"
            />
            <div className="relative space-y-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-violet-300">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h3 className="font-display text-2xl font-bold tracking-[-0.025em] text-white sm:text-[1.75rem]">
                Private software shouldn&apos;t be a luxury.
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                {PRODUCT_NAME} keeps your words on your disk. The Free plan needs no account, nothing is synced, and
                no usage data leaves your machine.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['No account', 'No cloud', 'No telemetry'].map((chip) => (
                  <span key={chip} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                    {chip}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  trackCta('home_privacy_download', 'home', 'Get the free editor');
                  navigate('download');
                }}
                className="btn-accent btn-lg mt-2"
              >
                <Download className="h-4 w-4" />
                Get the free editor
              </button>
            </div>
          </motion.div>

          {/* Pro — gradient card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="gradient-violet relative overflow-hidden rounded-3xl p-8 shadow-card-elevated sm:p-10"
          >
            <div
              aria-hidden="true"
              className="bg-grid-dots pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(70%_70%_at_100%_0%,black,transparent)]"
            />
            <div className="relative space-y-4 text-white">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white">
                <Crown className="h-6 w-6" />
              </span>
              <h3 className="font-display text-2xl font-bold tracking-[-0.025em] sm:text-[1.75rem]">
                Pro is coming — the Free plan is here now.
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-white/80">
                Advanced Print &amp; PDF tools, imported fonts, and image tools arrive with Pro at $5.99/month. Today,
                download the Free plan with no account and no payment.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['$5.99/mo planned', 'Free plan stays', 'No checkout yet'].map((chip) => (
                  <span key={chip} className="rounded-full border border-white/25 bg-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/90">
                    {chip}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  trackCta('home_pro_pricing', 'home', 'See pricing');
                  navigate('pricing');
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-violet-50"
              >
                See Free and Pro plans
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================= FINAL CTA =========================== */}
      <section className="container-site py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-line bg-paper-2/60 px-6 py-16 text-center sm:px-12 sm:py-24 dark:border-line-dark dark:bg-ink-900/60"
        >
          <div aria-hidden="true" className="hero-mesh pointer-events-none absolute inset-0" />
          <div className="relative space-y-6">
            <p className="eyebrow text-fg-accent">{TAGLINE}</p>
            <h2 className="mx-auto max-w-2xl text-4xl leading-[1.02] tracking-[-0.03em] text-ink sm:text-6xl dark:text-paper">
              Ready to write?
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft sm:text-base dark:text-zinc-400">
              Download the installer, open a document, and start writing. That is the whole setup.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <a
                href={DOWNLOAD_PATH}
                download
                onClick={() => trackCta('home_final_download', 'home', `Download ${PRODUCT_NAME}`)}
                className="btn-download"
              >
                <Download className="h-5 w-5" />
                <span>Download {PRODUCT_NAME}</span>
              </a>
              <button
                onClick={() => {
                  trackCta('home_final_pricing', 'home', 'See pricing');
                  navigate('pricing');
                }}
                className="btn-secondary btn-lg"
              >
                See Free and Pro plans
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 font-mono text-[11px] uppercase tracking-wider text-ink-mute dark:text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-fg-positive" /> {DOWNLOAD_FILE_SIZE} installer
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-fg-positive" /> Windows 10 &amp; 11
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-fg-positive" /> No account required
              </span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
