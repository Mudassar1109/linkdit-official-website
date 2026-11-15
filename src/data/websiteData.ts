import {
  ScreenshotItem,
  FeatureCategory,
  DownloadOption,
  DocArticle,
  ChangelogItem,
  FAQItem,
} from '../types';
import { CONTACT_EMAIL, CURRENT_VERSION, CURRENT_VERSION_LABEL, DOWNLOAD_FILENAME, DOWNLOAD_FILE_SIZE, DOWNLOAD_SHA256 } from '../config';

export {
  DOMAIN_NAME,
  SITE_URL,
  CONTACT_EMAIL,
  APP_NAME,
  PRODUCT_NAME,
  TAGLINE,
  BRAND_DESCRIPTION,
  CURRENT_VERSION,
  CURRENT_VERSION_LABEL,
  DOWNLOAD_FILENAME,
  DOWNLOAD_FILE_SIZE,
  DOWNLOAD_SHA256,
  DOWNLOAD_PATH,
} from '../config';

// Interface scenes rendered as in-app previews (the app ships no bundled
// screenshots, so each card shows a code-drawn replica of the real workspace).
export const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: '00_Workspace',
    filename: '00_Workspace.png',
    title: 'The Workspace',
    category: 'Interface',
    description: 'A frameless window with the document tab bar on top and the editor beneath. Open, edit, and save files that live on your own disk.',
    sceneTone: 'light',
    mockContent: {
      title: 'Untitled — TypoDocs',
      subtext: 'A tabbed writing workspace with nothing between you and the text',
      details: ['Window Controls', 'Tab Bar', 'Editor Canvas'],
    },
  },
  {
    id: '01_Tabs',
    filename: '01_Tabs.png',
    title: 'Multiple Open Documents',
    category: 'Interface',
    description: 'Keep several files open at once. Uncommitted changes are marked so you always know what needs saving.',
    sceneTone: 'light',
    mockContent: {
      title: 'three documents open at once',
      subtext: 'Dirty-state dot on the tab you have not saved yet',
      details: ['notes.md', 'ideas.txt', 'README.md'],
    },
  },
  {
    id: '02_RichText',
    filename: '02_RichText.png',
    title: 'Rich Text & Markdown',
    category: 'Editor',
    description: 'A formatted editing canvas for Markdown-style documents, with tables, task lists, highlights, links, and headings. TypoDocs uses a rich-text surface rather than a raw Markdown source view.',
    sceneTone: 'light',
    mockContent: {
      title: 'Formatting that stays out of the way',
      subtext: 'Formatted Markdown-style editing — not a raw source view',
      details: ['Tables', 'Task Lists', 'Heading Hierarchy'],
    },
  },
  {
    id: '03_Dark',
    filename: '03_Dark.png',
    title: 'Dark Theme',
    category: 'Themes',
    description: 'A warm dark theme for low-light sessions, with the same tabbed workspace and status bar.',
    sceneTone: 'dark',
    mockContent: {
      title: 'Dark mode for evenings',
      subtext: 'The same workspace, tuned for low-light writing sessions',
      details: ['Warm Dark Editor', 'Muted Borders', 'Readable Accents'],
    },
  },
  {
    id: '04_Sidebar',
    filename: '04_Sidebar.png',
    title: 'Files, Recent & Pinned',
    category: 'Interface',
    description: 'The sidebar lists your recent documents and pinned files, and offers search plus settings — all without leaving your writing flow.',
    sceneTone: 'light',
    mockContent: {
      title: 'Quick access to what matters',
      subtext: 'Recent files, pinned documents, search, and settings in one rail',
      details: ['Recent', 'Pinned', 'Search'],
    },
  },
  {
    id: '05_StatusBar',
    filename: '05_StatusBar.png',
    title: 'Word Count & Status Bar',
    category: 'Editor',
    description: 'A quiet status bar shows the live word and character count while you type, plus the current editing mode.',
    sceneTone: 'light',
    mockContent: {
      title: 'Live word and character counts',
      subtext: 'Updated on every keystroke in the status bar',
      details: ['Words', 'Characters', 'Plain / Rich Mode'],
    },
  },
];

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'text-editing',
    title: 'Core Editing',
    description: 'A fast editor for plain text, Markdown, and rich-text documents.',
    iconName: 'FileText',
    features: [
      { name: 'Capture & Share Your Notes', description: 'Capture the visible editor area, preview it, save it as a PNG, or copy it to your clipboard. Runs locally — no AI, cloud, or account.' },
      { name: 'Multiple Tabs', description: 'Keep many documents open at once and switch instantly between them. Unsaved tabs are clearly marked.' },
      { name: 'Markdown & Plain Text', description: 'Open and edit .md and .txt documents that stay on your machine in open formats.' },
      { name: 'Rich Text Workspace', description: 'A rich-text surface for headings, bold, emphasis, tables, task lists, quotes, links, and images.' },
      { name: 'Code & Config Files', description: 'Open .js, .ts, .py, .html, .css, .sql, .yaml, .json, and .log files and edit them as plain text alongside your documents.' },
      { name: 'Search & Replace', description: 'Basic find and replace in the active document with match navigation. Replace All is best used in plain-text documents.' },
      { name: 'Document Outline', description: 'A headings outline panel lets you jump around a long document without scrolling.' },
      { name: 'Undo & Redo', description: 'Rely on dependable undo/redo history while you draft, restructure, or experiment.' },
      { name: 'RTL & Multilingual Text', description: 'Layout prepared for right-to-left scripts such as Arabic and Urdu.' },
    ],
  },
  {
    id: 'writing',
    title: 'Distraction-Free Writing',
    description: 'Writer-focused controls that keep you on the page, not in the settings.',
    iconName: 'PenTool',
    features: [
      { name: 'Live Word Count', description: 'Word and character counts update on every keystroke in the status bar.' },
      { name: 'Quiet Status Bar', description: 'Document mode, word count, and character count — without notification noise.' },
      { name: 'Per-Document Mode', description: 'Choose plain text or rich text for each open document, not the whole app.' },
      { name: 'Command Palette', description: 'A keyboard-first command palette for actions like new file, open, search, settings, and themes.' },
      { name: 'Clean Typography', description: 'Readable line heights and spacing tuned for long writing sessions.' },
    ],
  },
  {
    id: 'organization',
    title: 'Files & Navigation',
    description: 'A simple sidebar that keeps your documents easy to find, organize, and reopen.',
    iconName: 'Sliders',
    features: [
      { name: 'Files & Recent', description: 'The sidebar lists recent documents so a draft you worked on yesterday is one click away.' },
      { name: 'Bookmarks & Pinned', description: 'Pin the files you use most, or bookmark a position inside a document, for instant access.' },
      { name: 'Native Open / Save', description: 'Open and save through standard Windows file dialogs, so files live exactly where you put them.' },
      { name: 'Trash', description: 'Deleted documents go to a local Trash where you can restore them or empty it.' },
    ],
  },
  {
    id: 'control',
    title: 'Save & Recovery',
    description: 'Local save tooling designed to keep work on disk.',
    iconName: 'FileText',
    features: [
      { name: 'Auto Save', description: 'Writes changes through the same save pipeline as manual Save after a configurable idle delay.' },
      { name: 'Save Status', description: 'The status bar reports Saving, Saved, Auto-save failed, and Auto Save off.' },
      { name: 'Recovery Workspace', description: 'Local recovery support after an unexpected shutdown, with no cloud or account dependency.' },
    ],
  },
  {
    id: 'themes',
    title: 'Themes',
    description: 'Six themes and six accent colors for light and dark writing.',
    iconName: 'Palette',
    features: [
      { name: 'Six Themes', description: 'Choose from six built-in themes, including warm light and dark palettes for long sessions.' },
      { name: 'Six Accents', description: 'Pair a theme with one of six accent colors for focus and highlights.' },
      { name: 'Consistent Canvas', description: 'Editor, tabs, sidebar, and status bar share one design language across themes.' },
    ],
  },
  {
    id: 'performance',
    title: 'Performance & Footprint',
    description: 'A lean native app without Electron-scale overhead.',
    iconName: 'Zap',
    features: [
      { name: 'Native Windows App', description: 'Built with Tauri — a small Rust core driving the WebView2-rendered interface.' },
      { name: 'Small Installer', description: 'The Windows setup package is about 6 MB, so installs are quick on any connection.' },
      { name: 'No Background Services', description: 'Nothing runs in the background and nothing phones home when you are not using it.' },
      { name: 'Works Offline', description: 'Launch, write, and save with no internet connection at all.' },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Ownership',
    description: 'Your documents belong to you. TypoDocs keeps them on your disk.',
    iconName: 'Shield',
    features: [
      { name: 'Local Files Only', description: 'Documents are stored as files on your computer. There is no cloud vault or forced sync.' },
      { name: 'Free Plan: No Account', description: 'Install, open, and write with no sign-up or profile. Pro will require an account only when it launches.' },
      { name: 'No Telemetry', description: 'The app contains no analytics, error trackers, or background usage reporting.' },
      { name: 'Open Formats', description: 'Plain text and Markdown files you can open with any other tool, now or years from now.' },
    ],
  },
];

export const DOWNLOAD_OPTIONS: DownloadOption[] = [
  {
    id: 'exe',
    title: 'Windows Setup (.exe)',
    filename: DOWNLOAD_FILENAME,
    format: '.exe',
    version: CURRENT_VERSION_LABEL,
    releaseDate: 'October 2026',
    fileSize: DOWNLOAD_FILE_SIZE,
    sha256: DOWNLOAD_SHA256,
    requirements: 'Windows 10 / 11 (64-bit)',
    isAvailable: true,
    isCurrent: true,
    type: 'Installer',
    tagline: 'The current release. A standard per-machine setup wizard for individual users and workstations.',
  },
  {
    id: 'msi',
    title: 'Enterprise MSI',
    filename: 'Typodocs_0.1.2_x64_en-US.msi',
    format: '.msi',
    version: CURRENT_VERSION_LABEL,
    releaseDate: 'October 2026',
    fileSize: '6.80 MB',
    sha256: 'F79E99E71B2E7AC71F9B222B42F06439985A8D6E65E877B7DDBB0487BB7713C2',
    requirements: 'Windows 10 / 11 (64-bit)',
    isAvailable: true,
    type: 'Enterprise MSI',
    tagline: 'Windows Installer (MSI) package for system administrators and enterprise deployment.',
  },
  {
    id: 'legacy-setup',
    title: 'Windows Setup — Legacy (v1.0.0)',
    filename: 'LinkDit-Pad-Setup.exe',
    format: '.exe',
    version: 'v1.0.0',
    releaseDate: 'July 2026',
    fileSize: '2.10 MB',
    sha256: '32e8119b8d9bee6942cc368714dc90992c1c3611b64a2e13d8df8a45529e8cdc',
    requirements: 'Windows 10/11 (64-bit)',
    isAvailable: true,
    type: 'Installer',
    tagline: 'The earlier setup wizard, kept for anyone who needs to reinstall the previous build.',
    note: `Legacy release — it predates the current v${CURRENT_VERSION_LABEL} build. New installs should use the v${CURRENT_VERSION_LABEL} setup (.exe).`,
  },
  {
    id: 'msix',
    title: 'App Package (.msix)',
    filename: 'Typodocs.msix',
    format: '.msix',
    version: '—',
    releaseDate: 'Not yet released',
    fileSize: '—',
    sha256: 'Not published',
    requirements: 'Windows 10/11',
    isAvailable: false,
    type: 'Windows App Store',
    tagline: 'A Microsoft Store-style package is planned but not yet published.',
    note: 'No MSIX package is available yet. The MSIX placeholder from earlier builds has not shipped a usable installer.',
  },
  {
    id: 'portable',
    title: 'Portable ZIP',
    filename: 'Typodocs-Portable.zip',
    format: '.zip',
    version: 'Upcoming',
    releaseDate: 'Planned',
    fileSize: '—',
    sha256: 'Will be published with the release',
    requirements: 'Windows 10/11 (64-bit)',
    isAvailable: false,
    type: 'Portable',
    tagline: 'A no-install ZIP build for running TypoDocs from a USB drive.',
    note: 'Portable builds are planned for a future release and not yet published.',
  },
];

export const DOC_ARTICLES: DocArticle[] = [
  {
    id: 'getting-started',
    categoryId: 'overview',
    categoryName: 'Getting Started',
    title: 'Quick Start & Interface Guide',
    description: 'Meet the workspace and write your first document in less than a minute.',
    lastUpdated: '2026-07',
    readTime: '3 min read',
    content: `
# Getting Started with TypoDocs

TypoDocs is a desktop editor for Windows that keeps words on your disk and
nothing else. The Free plan needs no account, uses no cloud storage, and runs
nothing in the background.

## The workspace

- **Tab bar** (top) — every open document is a tab. Unsaved changes are marked
  with a small dot.
- **Sidebar** (left) — recent files, pinned documents, search, and settings.
- **Editor** (center) — where you write.
- **Status bar** (bottom) — live word and character counts, plus the current
  editing mode.

## Write your first document

1. Open TypoDocs.
2. Start typing — a new tab is ready immediately.
3. Use the status bar to follow your word count as you go.

## Open and save

Use the standard open and save dialogs (Ctrl+O / Ctrl+S on Windows) to work
with plain \`.md\` and \`.txt\` files that live wherever you keep them.
    `,
  },
  {
    id: 'markdown-guide',
    categoryId: 'editing',
    categoryName: 'Editing & Formatting',
    title: 'Markdown & Plain Text',
    description: 'Use the formatted editor for Markdown-style documents, or keep a file as plain text.',
    lastUpdated: '2026-10',
    readTime: '4 min read',
    content: `
# Markdown-Style Editing in TypoDocs

TypoDocs uses a formatted editing canvas rather than a raw Markdown source
view. You apply formatting with the toolbar or keyboard shortcuts, and the
document is edited as rendered text.

## Formatting you can apply

- **Bold** and *italic* text.
- Headings from level 1 to 6.
- Bulleted and numbered lists, including checkbox task lists.
- Tables with editable cells.
- Block quotes and inline code.
- Links and images.

## Plain text

TypoDocs opens \`.txt\` files as-is. What you type is what is saved — no
hidden formatting, no surprise encoding changes. If you need to read or edit
raw Markdown source line by line, use a source-code editor.
    `,
  },
  {
    id: 'rich-text-guide',
    categoryId: 'editing',
    categoryName: 'Editing & Formatting',
    title: 'Rich Text Formatting',
    description: 'Tables, task lists, highlights, and links without touching Markdown.',
    lastUpdated: '2026-07',
    readTime: '4 min read',
    content: `
# Rich Text Formatting

Switch a document to rich text to format with a toolbar instead of syntax.

## What you can format

- Heading levels for structure.
- Bold, italic, underline, and highlighted text.
- Bulleted and numbered lists, including task lists with checkboxes.
- Tables with editable cells.
- Text alignment, plus subscript and superscript.
- Links and images.

## When to choose which mode

Use **Markdown** when you want portable, version-control-friendly source.
Use **Rich text** when a document benefits from a live formatted canvas.
Each document remembers its own mode.
    `,
  },
  {
    id: 'themes',
    categoryId: 'customization',
    categoryName: 'Themes & Customization',
    title: 'Light & Dark Themes',
    description: 'Choose from six themes and six accent colors in Settings.',
    lastUpdated: '2026-10',
    readTime: '2 min read',
    content: `
# Themes and Accents

TypoDocs ships with six themes and six accent colors built around the same
layout, including light and dark palettes for daytime and evening writing.

Both the theme and the accent are designed to be easy on the eyes during long
sessions. Switch them anywhere from **Settings** in the sidebar.
    `,
  },
];

export const CHANGELOG_ITEMS: ChangelogItem[] = [
  {
    version: CURRENT_VERSION,
    date: 'September 2026',
    title: 'Current release',
    summary: `The current release of TypoDocs: a rebuilt, offline-first Markdown and rich-text editor for Windows 10 and 11, with dependable Auto Save that writes through the real document save pipeline. Some advanced tools in this build are planned for the Pro plan when it launches. Version numbering restarted from 0.1 when the product line was rebuilt on a new codebase.`,
    badge: 'Current',
    status: 'current',
    highlights: [
      'Capture Screenshot — capture the visible document area or the entire document, preview it, save it as PNG, or copy it to the clipboard',
      'Improved Auto Save reliability',
      'Automatic saving now writes changes through the real document save pipeline',
      'Clear save status feedback: Saving, Saved, Auto-save failed, and Auto Save off',
      'Improved save handling for focused split-editor panes',
      'Preserved .ldp document support and offline/local-first workflow',
      'Urdu Nastaliq typography with a bundled Noto Nastaliq Urdu font, plus custom font import',
      'Reliable Print & PDF output that preserves your selected and imported fonts',
    ],
    featuresAdded: [
      'Capture Screenshot: snapshot the visible editor area or the entire document, preview the result, save it as a PNG, or copy it straight to the clipboard',
      'Screenshot capture works entirely on your machine — no AI, no cloud upload, no account or login required',
      'Dependable Auto Save that writes to the document file on disk after a configurable idle delay',
      'Auto Save shares the exact save pipeline as File > Save for identical output (.ldp serialization included)',
      'Status bar Auto Save indicator: Saving, Saved, Auto-save failed, and Auto Save off',
      'Auto Save follows the focused pane in split-editor view',
      'Import custom fonts (TTF/OTF) and use them in the editor and in printed output',
      'Urdu Nastaliq support: ship a bundled Noto Nastaliq Urdu font and apply the Nastaliq stack to Urdu text',
      'Multipage Print & PDF export with correct page margins, multi-column pagination, and N-up sheet layouts',
    ],
    improvements: [
      'Serialized write queue prevents manual Save and Auto Save from ever overlapping on the same file',
      'Retired the legacy, unused localStorage auto-save drafts',
    ],
    bugFixes: [
      'Fixed Auto Save reliability for documents with unsaved changes',
      'Fixed selected and imported fonts (including Urdu Nastaliq) falling back to a default font in Print Preview and exported PDFs',
      'Fixed print pagination, per-page margins, and N-up page grouping',
    ],
  },
  {
    version: '0.1.1',
    date: 'September 2026',
    title: 'Previous release',
    summary: `The previous release of TypoDocs: the rebuilt, offline-first Markdown and rich-text editor for Windows 10 and 11. Version numbering restarted from 0.1 when the product line was rebuilt on a new codebase.`,
    badge: 'Previous',
    status: 'previous',
    highlights: [
      'Multi-tab editor with dirty-state indicators',
      'Markdown / plain text and rich text (tables, task lists, highlights, links)',
      'Sidebar with files, recent, bookmarks, search, and settings',
      'Search & replace and local Trash',
      'Local files only — Free plan needs no account; no telemetry, no cloud',
    ],
    featuresAdded: [
      'Tabbed document workspace with dirty-state indicators',
      'Per-document switching between Markdown / plain text and rich text',
      'Basic search and replace in the active document',
      'Local Trash with restore and empty actions',
      'Document outline panel',
      'Command palette for keyboard-first actions',
      'Bookmarks and pinned documents in the sidebar',
      'Live word and character counts in the status bar',
      'Light and dark themes',
      'SQLite-backed local index for documents and recent files',
      'RTL (Arabic / Urdu) layout readiness',
    ],
    improvements: [
      'Rebuilt from scratch on a new codebase with a smaller footprint',
    ],
    bugFixes: [],
  },
  {
    version: '1.0.0',
    date: 'July 22, 2026',
    title: 'Legacy release',
    summary: 'An earlier release of TypoDocs built on the previous codebase. It is superseded by the rebuilt v' + CURRENT_VERSION_LABEL + '.',
    badge: 'Legacy',
    status: 'legacy',
    highlights: [
      'Belongs to the previous TypoDocs codebase',
      'Superseded by the current v' + CURRENT_VERSION_LABEL + ' release',
    ],
    featuresAdded: [],
    improvements: ['Replaced by the rebuilt v' + CURRENT_VERSION_LABEL + ' product line'],
    bugFixes: [],
  },
  {
    version: '0.9.5',
    date: 'June 15, 2026',
    title: 'Legacy beta',
    summary: 'A beta of the original TypoDocs concept. Superseded by the current v' + CURRENT_VERSION_LABEL + ' release.',
    badge: 'Legacy',
    status: 'legacy',
    highlights: [
      'Early beta of the original product concept',
      'Superseded by the current v' + CURRENT_VERSION_LABEL + ' release',
    ],
    featuresAdded: [],
    improvements: ['Replaced by the rebuilt v' + CURRENT_VERSION_LABEL + ' product line'],
    bugFixes: [],
  },
];

export const FAQS: FAQItem[] = [
  {
    category: 'General',
    question: 'What is TypoDocs?',
    answer: 'TypoDocs is a desktop Markdown and rich-text editor for Windows 10 and 11. It is tabbed, fast, works fully offline, and keeps every document as a normal file on your own computer.',
  },
  {
    category: 'Privacy',
    question: 'Does TypoDocs track or log my writing?',
    answer: 'No. The desktop application has no analytics, no error trackers, and no background usage reporting. Documents are stored as files on your local drive and are never uploaded.',
  },
  {
    category: 'Licensing',
    question: 'Is TypoDocs free to use?',
    answer: 'The Free plan is free to download and use for personal, academic, and commercial writing. It requires no account. A Pro plan is planned at $5.99/month or $47.99/year, but no checkout or payment is available yet.',
  },
  {
    category: 'Licensing',
    question: 'Is there a Pro plan?',
    answer: 'Pro is planned but not available to buy. It will add advanced Print & PDF tools, imported fonts, image tools, and Pro updates while subscribed. The Free plan remains available. See the Pricing page for the full comparison and launch status.',
  },
  {
    category: 'Installation',
    question: 'Does TypoDocs need an internet connection?',
    answer: 'No. Install it once, and it runs entirely offline. There is no cloud dependency, no login for the Free plan, and nothing waiting for a connection.',
  },
  {
    category: 'Installation',
    question: 'Which installer should I choose?',
    answer: `Use the current Windows Setup (.exe), v${CURRENT_VERSION_LABEL}, for everyone. The current Enterprise MSI is also v${CURRENT_VERSION_LABEL}. The older Setup.exe is a v1.0.0 legacy build kept for reinstallation only. New installs should use the current setup. A Microsoft Store-style MSIX package is not published yet.`,
  },
  {
    category: 'Features',
    question: 'Can I write both Markdown and rich text?',
    answer: 'Yes. Each document can run in a plain-text mode or a formatted rich-text mode, with headings, tables, task lists, highlights, links, and images. The formatted editor is not a raw Markdown source view.',
  },
  {
    category: 'General',
    question: 'Where can I get support or request a feature?',
    answer: `Open the Support page or email ${CONTACT_EMAIL} to ask a question or request a feature.`,
  },
];
