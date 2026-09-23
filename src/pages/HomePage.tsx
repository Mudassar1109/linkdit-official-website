import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageId } from '../types';
import { PRODUCT_NAME, TAGLINE } from '../data/websiteData';
import { Download, ArrowRight, Check, FileText, CheckSquare } from 'lucide-react';

interface HomePageProps {
  navigate: (page: PageId) => void;
  onOpenScreenshot: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/* Mock documents shown inside the editor showcase. Each is real text, */
/* and the word count in the status bar is computed from these strings.*/
/* ------------------------------------------------------------------ */

const README_MD = `# readme.md — notes on this project

Keep the project log in plain Markdown. Every file on this machine stays a file.

## This week

- Added new notes for the workshop outline and the API reference.
- Organized drafts from the Explorer tree and pinned the two files I use daily.
- Restored an earlier draft from version history when I changed my mind.

## Open items

- [ ] Back up the drafts folder to an external drive
- [x] Review the offline-first storage note
- [x] Keep everything in plain text

## Storage & privacy

All documents are stored as plain .md and .txt files on local disk.
Nothing is uploaded. There is no account, no telemetry, and no cloud.`;

const RELEASE_MD = `# Release Notes — v0.1.2

LinkDit Pad is the current release of a fast, offline-first editor for Windows.

## In this release

- Capture & Share Your Notes: capture the visible editor area or the entire document, preview it, save it as PNG, or copy it to your clipboard.
- Improved Auto Save reliability.
- Automatic saving writes through the real document save pipeline.
- Clear save status feedback: Saving, Saved, Auto-save failed, and Auto Save off.
- Preserved offline/local-first workflow with .ldp document support.

## Notes

- Installer: LinkDit-Pad-0.1.2-x64-setup.exe (about 4 MB).
- Works fully offline. Documents never leave your computer.`;

const NOTES_TXT = `meeting-notes.txt — Sep 16, 2026

Agenda:
1. Review editor roadmap priorities
2. Decide on the command palette order
3. Confirm the dark theme palette for evening writing

Action items:
- Publish release notes for v0.1.2
- Add version history to the roadmap page
- Keep the installer filename unchanged`;

interface MockDoc {
  id: string;
  filename: string;
  content: string;
}

const MOCK_DOCS: MockDoc[] = [
  { id: 'readme', filename: 'readme.md', content: README_MD },
  { id: 'release', filename: 'Release-Notes.md', content: RELEASE_MD },
  { id: 'notes', filename: 'meeting-notes.txt', content: NOTES_TXT },
];

const wordCountOf = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const charCountOf = (s: string) => s.replace(/\s/g, '').length;

/* Tiny markdown-lite renderer used ONLY for the showcase mock documents. */
const MockProse: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const out: React.ReactNode[] = [];
  let codeBuf: string[] = [];
  let codeOpen = false;
  let key = 0;

  const flushCode = () => {
    if (codeBuf.length === 0) return;
    out.push(
      <pre
        key={key++}
        className="rounded bg-paper-2 dark:bg-ink-900 border border-line dark:border-line-dark px-3 py-2 text-[11px] leading-relaxed font-mono overflow-x-auto"
      >
        {codeBuf.join('\n')}
      </pre>
    );
    codeBuf = [];
  };

  lines.forEach((raw) => {
    const line = raw.trim();

    if (line.startsWith('```')) {
      if (codeOpen) {
        flushCode();
        codeOpen = false;
      } else {
        codeOpen = true;
      }
      return;
    }
    if (codeOpen) {
      codeBuf.push(raw);
      return;
    }

    const inline = (t: string) =>
      t
        .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
        .map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**'))
            return (
              <strong key={i} className="font-semibold text-ink dark:text-paper">
                {part.slice(2, -2)}
              </strong>
            );
          if (part.startsWith('`') && part.endsWith('`'))
            return (
              <code key={i} className="font-mono text-[0.9em] bg-paper-2 dark:bg-ink-900 rounded px-1">
                {part.slice(1, -1)}
              </code>
            );
          return <React.Fragment key={i}>{part}</React.Fragment>;
        });

    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s*/, '');
      if (level === 1)
        out.push(
          <h3 key={key++} className="text-lg font-bold tracking-tight text-ink dark:text-paper">
            {inline(text)}
          </h3>
        );
      else
        out.push(
          <h4 key={key++} className="text-sm font-semibold text-ink dark:text-paper">
            {inline(text)}
          </h4>
        );
    } else if (/^- \[[ x]\]\s/.test(line)) {
      const checked = line.startsWith('- [x]');
      const text = line.replace(/^- \[[ x]\]\s*/, '');
      out.push(
        <div key={key++} className="flex items-start gap-2 text-xs text-ink-soft dark:text-paper/75">
          <span
            className={`mt-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded border shrink-0 ${
              checked ? 'bg-accent border-accent text-white' : 'border-line-strong text-transparent'
            }`}
          >
            {checked && <Check className="w-2.5 h-2.5" />}
          </span>
          <span>{inline(text)}</span>
        </div>
      );
    } else if (/^-\s/.test(line) || /^\d+\.\s/.test(line)) {
      out.push(
        <div key={key++} className="flex items-start gap-2 text-xs text-ink-soft dark:text-paper/75">
          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-line-strong dark:bg-line-dark shrink-0" />
          <span>{inline(line.replace(/^-\s|^\d+\.\s/, ''))}</span>
        </div>
      );
    } else if (/^\|/.test(line)) {
      const cells = line.split('|').filter((c) => c.trim().length > 0);
      out.push(
        <div key={key++} className="flex gap-3 text-[11px] font-mono text-ink-soft dark:text-paper/70">
          {cells.map((c, i) => (
            <span key={i} className={c.trim().startsWith('-') ? 'text-line-strong' : 'min-w-0 truncate'}>
              {c.trim()}
            </span>
          ))}
        </div>
      );
    } else if (/^---+\s*$/.test(line)) {
      out.push(<hr key={key++} className="border-line dark:border-line-dark" />);
    } else if (line === '') {
      out.push(<div key={key++} className="h-2" />);
    } else {
      out.push(
        <p key={key++} className="text-xs leading-relaxed text-ink-soft dark:text-paper/75">
          {inline(line)}
        </p>
      );
    }
  });

  flushCode();
  return <div className="space-y-1.5 font-sans">{out}</div>;
};

/* ------------------------------------------------------------------ */

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [activeDocId, setActiveDocId] = useState('readme');
  const [mode, setMode] = useState<'write' | 'read'>('write');
  const [mockDark, setMockDark] = useState(false);

  const activeDoc = MOCK_DOCS.find((d) => d.id === activeDocId) ?? MOCK_DOCS[0];

  const trustItems = [
    { title: 'No account, no login', detail: 'Install once, start typing.' },
    { title: 'Runs fully offline', detail: 'No cloud, no waiting for a connection.' },
    { title: 'Files stay on your PC', detail: 'Plain .md and .txt files you own.' },
    { title: 'Zero telemetry', detail: 'No analytics, trackers, or pings.' },
  ];

  const benefitCards = [
    {
      title: 'A tabbed writing desk',
      desc: 'Keep several documents open at once, switch instantly, and always know what needs saving.',
    },
    {
      title: 'Markdown and rich text',
      desc: 'Type Markdown or format with a rich text surface — tables, task lists, highlights, links.',
    },
    {
      title: 'Native, not a browser tab',
      desc: 'A lean Windows app on Tauri with a Rust core and an installer around 4 MB.',
    },
    {
      title: 'Quiet, by design',
      desc: 'Live word counts in the status bar, recent and pinned files in a simple sidebar.',
    },
  ];

  const productShowcase = [
    {
      index: '01',
      title: 'Professional Markdown Editor',
      image: '/images/software/01-main-editor.png',
      alt: 'LinkDit Pad Markdown editor interface',
      description: 'Write and organize content in a clean, focused Markdown workspace.',
    },
    {
      index: '02',
      title: 'Editor & Auto Save',
      image: '/images/software/02-settings-editor.png',
      alt: 'LinkDit Pad editor settings and Auto Save controls',
      description: 'Customize your editor and keep your documents saved automatically.',
    },
    {
      index: '03',
      title: 'Dark Workspace',
      image: '/images/software/03-workspace-dark.png',
      alt: 'LinkDit Pad dark workspace with document editing interface',
      description: 'A focused dark workspace designed for comfortable writing and editing.',
    },
    {
      index: '04',
      title: 'Trash & Recovery',
      image: '/images/software/04-trash-recovery.png',
      alt: 'LinkDit Pad Trash and deleted document management interface',
      description: 'Manage deleted documents and keep your workspace organized.',
    },
    {
      index: '05',
      title: 'Document Lock',
      image: '/images/software/05-document-lock.png',
      alt: 'LinkDit Pad document lock and password protection interface',
      description: 'Protect documents with local password-based locking and read-only access.',
    },
  ];

  return (
    <div className="font-sans">
      {/* ----------------------------- HERO ----------------------------- */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-14 sm:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wide text-ink-mute dark:text-paper/60 border border-line dark:border-line-dark rounded-full px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              v0.1.2 · Free for Windows 10 &amp; 11
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-ink dark:text-paper leading-[1.08]">
              A writing desk that
              <br className="hidden sm:block" />
              <span className="font-serif italic font-normal">stays out of your way.</span>
            </h1>

            <p className="mx-auto max-w-xl text-base sm:text-lg text-ink-soft dark:text-paper/70 leading-relaxed">
              {PRODUCT_NAME} is a fast, offline-first Markdown and rich-text editor. Multi-tab editing,
              live word counts, and every document stays a plain file on your own computer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('download')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
              >
                <Download className="w-4 h-4" />
                <span>Download for Windows</span>
              </button>
              <button
                onClick={() => navigate('features')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong px-6 py-3 text-sm font-semibold text-ink hover:border-ink transition-colors dark:border-line-dark dark:text-paper dark:hover:border-paper"
              >
                Explore features
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ink-mute dark:text-paper/50">
              4 MB installer · No sign-up · No payment · No data collection
            </p>
          </motion.div>
        </div>
      </section>

      {/* --------------------------- TRUST ROW --------------------------- */}
      <section className="border-b border-line dark:border-line-dark bg-paper-2/50 dark:bg-ink-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-soft dark:bg-accent/15 text-accent-deep dark:text-blue-300">
                <Check className="w-3 h-3" />
              </span>
              <div>
                <div className="text-sm font-semibold text-ink dark:text-paper">{item.title}</div>
                <div className="text-xs text-ink-mute dark:text-paper/55 mt-0.5">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------- EDITOR SHOWCASE ------------------------ */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <AppWindow
            activeDoc={activeDoc}
            onSelectDoc={setActiveDocId}
            mode={mode}
            setMode={setMode}
            mockDark={mockDark}
            setMockDark={setMockDark}
          />
          <p className="mt-5 text-center text-xs text-ink-mute dark:text-paper/50">
            A faithful rendering of the {PRODUCT_NAME} workspace — tabs, sidebar, editor, and status bar.
          </p>
        </div>
      </section>

      {/* ------------------------ PRODUCT SHOWCASE ---------------------- */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="mx-auto mb-12 sm:mb-16 max-w-2xl text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-paper leading-tight">
              See LinkDit Pad in Action
            </h2>
            <p className="text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
              A closer look at the tools and workflows built into LinkDit Pad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {productShowcase.map((card) => (
              <article
                key={card.index}
                className={`flex flex-col rounded-card border border-line dark:border-line-dark bg-surface dark:bg-ink-850 overflow-hidden shadow-card hover:shadow-card-hover transition-shadow ${
                  card.index === '01' ? 'md:col-span-2' : ''
                }`}
              >
                <div className="border-b border-line dark:border-line-dark overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto block"
                  />
                </div>
                <div className="p-5 sm:p-6 flex flex-col gap-1.5">
                  <span className="eyebrow text-ink-mute dark:text-paper/45">{card.index}</span>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-ink dark:text-paper">
                    {card.title}
                  </h3>
                  <p className="text-sm text-ink-soft dark:text-paper/65 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------- BENEFITS ---------------------------- */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
            <div className="space-y-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
                What it is
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-paper leading-tight">
                One focused tool for writing, notes, and technical documents.
              </h2>
              <p className="text-ink-soft dark:text-paper/65 leading-relaxed text-sm sm:text-base">
                No plugin stores to browse, no cloud dashboards to sign in to, no fonts-themes-extensions
                treadmill. {PRODUCT_NAME} is a desktop app for the writing you actually do today.
              </p>
              <button
                onClick={() => navigate('products')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
              >
                Learn about {PRODUCT_NAME}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-px border border-line dark:border-line-dark bg-line dark:bg-line-dark">
              {benefitCards.map((b) => (
                <div key={b.title} className="bg-paper dark:bg-ink-950 p-6 space-y-2">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-paper-2 dark:bg-ink-900 text-accent-deep dark:text-blue-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-ink dark:text-paper">{b.title}</h3>
                  <p className="text-xs text-ink-soft dark:text-paper/60 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------- PRIVACY BAND -------------------------- */}
      <section className="border-b border-line dark:border-line-dark bg-paper-2/50 dark:bg-ink-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
          <CheckSquare className="w-8 h-8 mx-auto text-accent" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-paper">
            Private software shouldn't be a luxury.
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            {PRODUCT_NAME} keeps your words on your disk. There is no account to create, nothing to sync,
            and no usage data leaving your machine.
          </p>
        </div>
      </section>

      {/* --------------------------- FINAL CTA --------------------------- */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-5">
        <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
          {TAGLINE}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-paper">
          Ready to write?
        </h2>
        <p className="mx-auto max-w-md text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
          Download the installer, open a document, and start writing. That is the whole setup.
        </p>
        <button
          onClick={() => navigate('download')}
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-7 py-3 text-sm font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
        >
          <Download className="w-4 h-4" />
          <span>Download {PRODUCT_NAME}</span>
        </button>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* App window showcase                                                */
/* ------------------------------------------------------------------ */

interface AppWindowProps {
  activeDoc: MockDoc;
  onSelectDoc: (id: string) => void;
  mode: 'write' | 'read';
  setMode: (m: 'write' | 'read') => void;
  mockDark: boolean;
  setMockDark: (d: boolean) => void;
}

const AppWindow: React.FC<AppWindowProps> = ({
  activeDoc,
  onSelectDoc,
  mode,
  setMode,
  mockDark,
  setMockDark,
}) => {
  const wordCount = wordCountOf(activeDoc.content);
  const charCount = charCountOf(activeDoc.content);
  const frame = mockDark ? 'dark' : '';

  return (
    <div
      className={`${frame} overflow-hidden rounded-xl border border-line dark:border-line-dark bg-white shadow-[0_20px_60px_-20px_rgba(28,26,22,0.25)] transition-colors`}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between bg-paper-2/80 dark:bg-ink-900 px-4 h-11 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-mono text-ink-mute dark:text-paper/50">LinkDit Pad</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMockDark((d) => !d)}
            className="rounded border border-line dark:border-line-dark px-2.5 py-1 text-[10px] font-mono text-ink-soft dark:text-paper/60 hover:border-line-strong"
          >
            {mockDark ? 'Dark' : 'Light'}
          </button>
          <button
            onClick={() => setMode(mode === 'write' ? 'read' : 'write')}
            className="rounded border border-line dark:border-line-dark px-2.5 py-1 text-[10px] font-mono text-ink-soft dark:text-paper/60 hover:border-line-strong"
          >
            {mode === 'write' ? 'Source' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-2 pt-2 bg-paper-2/40 dark:bg-ink-900/30">
        {MOCK_DOCS.map((doc) => {
          const active = doc.id === activeDoc.id;
          return (
            <button
              key={doc.id}
              onClick={() => onSelectDoc(doc.id)}
              className={`flex items-center gap-2 rounded-t-md border border-b-0 px-3.5 py-2 text-xs font-medium transition-colors ${
                active
                  ? 'bg-white border-line dark:bg-ink-850 dark:border-line-dark text-ink dark:text-paper'
                  : 'border-transparent text-ink-mute dark:text-paper/50 hover:text-ink-soft dark:hover:text-paper/70'
              }`}
            >
              <span className="max-w-[160px] truncate">{doc.filename}</span>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex border-t border-line dark:border-line-dark">
        {/* Sidebar */}
        <aside className="hidden sm:block w-44 shrink-0 border-r border-line dark:border-line-dark bg-paper-2/30 dark:bg-ink-900/20 p-4 space-y-3">
          <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-ink-mute dark:text-paper/40">
            Recent
          </div>
          {MOCK_DOCS.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelectDoc(doc.id)}
              className={`flex items-center gap-2 w-full text-left rounded px-2 py-1.5 text-xs transition-colors ${
                doc.id === activeDoc.id
                  ? 'bg-accent-soft dark:bg-accent/15 text-accent-deep dark:text-blue-300 font-medium'
                  : 'text-ink-soft dark:text-paper/60 hover:bg-paper-2 dark:hover:bg-ink-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{doc.filename}</span>
            </button>
          ))}

          <div className="pt-3 border-t border-line dark:border-line-dark text-[10px] font-mono uppercase tracking-wider text-ink-mute dark:text-paper/40">
            Pinned
          </div>
          <div className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-ink-soft dark:text-paper/60">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">journal.md</span>
          </div>
        </aside>

        {/* Editor canvas */}
        <div
          className={`flex-1 min-h-[380px] p-5 sm:p-6 transition-colors ${
            mode === 'write'
              ? 'bg-white dark:bg-ink-850 font-mono text-[13px] leading-relaxed whitespace-pre-wrap'
              : 'bg-white dark:bg-ink-850'
          }`}
        >
          {mode === 'write' ? (
            <div className="max-h-[420px] overflow-hidden text-ink-soft dark:text-paper/75">
              <MockProse content={activeDoc.content} />
            </div>
          ) : (
            <div className="max-h-[420px] overflow-hidden">
              <div className="rounded-lg bg-paper-2 dark:bg-ink-900 border border-line dark:border-line-dark px-6 py-8 max-w-xl mx-auto space-y-4 shadow-sm">
                <MockProse content={activeDoc.content} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-line dark:border-line-dark bg-paper-2/60 dark:bg-ink-900/40 text-[11px] font-mono text-ink-mute dark:text-paper/55">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">UTF-8</span>
          <span>{activeDoc.filename.endsWith('.md') ? 'Markdown' : 'Plain text'}</span>
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
        <span className="text-emerald-600 dark:text-emerald-400">Local · saved</span>
      </div>
    </div>
  );
};