import {
  ScreenshotItem,
  FeatureCategory,
  DownloadOption,
  DocArticle,
  ChangelogItem,
  RoadmapItem,
  FAQItem,
} from '../types';
import { CONTACT_EMAIL, CURRENT_VERSION, CURRENT_VERSION_LABEL, DOWNLOAD_FILENAME, DOWNLOAD_SHA256 } from '../config';

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
    previewColor: 'bg-paper',
    mockContent: {
      title: 'Untitled — LinkDit Pad',
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
    previewColor: 'bg-paper',
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
    description: 'Switch between Markdown source and rich text. Tables, task lists, highlights, links, and formatted headings for documents that need more than plain text.',
    previewColor: 'bg-paper',
    mockContent: {
      title: 'Formatting that stays out of the way',
      subtext: 'Markdown source or WYSIWYG — your choice per document',
      details: ['Tables', 'Task Lists', 'Heading Hierarchy'],
    },
  },
  {
    id: '03_Dark',
    filename: '03_Dark.png',
    title: 'Dark Theme',
    category: 'Themes',
    description: 'A warm dark theme for low-light sessions, with the same tabbed workspace and status bar.',
    previewColor: 'bg-ink-950',
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
    previewColor: 'bg-paper',
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
    previewColor: 'bg-paper',
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
      { name: 'Capture & Share Your Notes', description: 'Capture the visible editor area or the entire document, preview it, save it as PNG, or copy it directly to your clipboard. Fully local — no AI, no cloud, no account.' },
      { name: 'Multiple Tabs', description: 'Keep many documents open at once and switch instantly between them. Unsaved tabs are clearly marked.' },
      { name: 'Markdown & Plain Text', description: 'Write and edit standard .md and .txt files that stay on your machine in open formats.' },
      { name: 'Rich Text Workspace', description: 'A rich-text surface for headings, bold, emphasis, tables, task lists, quotes, links, and images.' },
      { name: 'Code & Config Files', description: 'Open .js, .ts, .py, .html, .css, .sql, .yaml, .json, and .log files and edit them as plain text alongside your documents.' },
      { name: 'Search & Replace', description: 'Find text in the active document and replace it, with case-sensitive, whole-word, and regex options.' },
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
      { name: 'File Explorer', description: 'A folder tree in the sidebar with drag-and-drop file organization.' },
      { name: 'Native Open / Save', description: 'Open and save through standard Windows file dialogs, so files live exactly where you put them.' },
      { name: 'Find in Files', description: 'A sidebar search that scans open documents and saved files, with click-to-jump results.' },
      { name: 'Trash', description: 'Deleted documents go to a local Trash where you can restore them or empty it.' },
    ],
  },
  {
    id: 'control',
    title: 'Control & Recovery',
    description: 'Tooling so you never lose work and can keep sensitive documents private.',
    iconName: 'FileText',
    features: [
      { name: 'Version History', description: 'Per-document snapshots let you step back to an earlier draft at any time.' },
      { name: 'Auto Backup', description: 'Automatic local backups on top of your saved files, with a recovery dialog after an unexpected shutdown.' },
      { name: 'Document Lock', description: 'Lock a document behind a local password — no cloud, no account, nothing ever leaves your machine.' },
    ],
  },
  {
    id: 'themes',
    title: 'Themes',
    description: 'Light and dark themes built to be easy on the eyes, period.',
    iconName: 'Palette',
    features: [
      { name: 'Light & Dark', description: 'Two carefully balanced palettes — a warm paper light theme and a warm dark theme for evenings.' },
      { name: 'Restrained Accents', description: 'A single blue accent (the LinkDit Pad blue) used sparingly for focus and highlights.' },
      { name: 'Consistent Canvas', description: 'Editor, tabs, sidebar, and status bar share one design language in both themes.' },
    ],
  },
  {
    id: 'performance',
    title: 'Performance & Footprint',
    description: 'A lean native app without Electron-scale overhead.',
    iconName: 'Zap',
    features: [
      { name: 'Native Windows App', description: 'Built with Tauri — a small Rust core driving the WebView2-rendered interface.' },
      { name: 'Small Installer', description: 'The Windows setup package is about 4 MB, so installs are quick on any connection.' },
      { name: 'No Background Services', description: 'Nothing runs in the background and nothing phones home when you are not using it.' },
      { name: 'Works Offline', description: 'Launch, write, and save with no internet connection at all.' },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Ownership',
    description: 'Your documents belong to you. LinkDit Pad keeps them on your disk.',
    iconName: 'Shield',
    features: [
      { name: 'Local Files Only', description: 'Documents are stored as plain files on your computer. There is no proprietary vault or lock-in.' },
      { name: 'No Account, No Login', description: 'Install, open, and write — no sign-up, no password, no profile.' },
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
    releaseDate: 'September 2026',
    fileSize: '4.10 MB',
    sha256: DOWNLOAD_SHA256,
    requirements: 'Windows 10 / 11 (64-bit)',
    isAvailable: true,
    isCurrent: true,
    type: 'Installer',
    tagline: 'The current release. A standard per-machine setup wizard for individual users and workstations.',
  },
  {
    id: 'msi',
    title: 'Enterprise MSI (Legacy v1.0.0)',
    filename: 'LinkDit-Pad.msi',
    format: '.msi',
    version: 'v1.0.0',
    releaseDate: 'July 2026',
    fileSize: '2.81 MB',
    sha256: '82ef2150d8edc0c21d85e9051223601d136567df26a7e946cbb8a1665cd8bfeb',
    requirements: 'Windows 10/11 (64-bit)',
    isAvailable: true,
    type: 'Enterprise MSI',
    tagline: 'A previous build of LinkDit Pad for IT administrators who already deploy MSI packages.',
    note: `Legacy release — it predates the current v${CURRENT_VERSION_LABEL} build. New installs should use the v${CURRENT_VERSION_LABEL} setup (.exe).`,
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
    tagline: 'The earlier LinkDit Pad setup wizard, kept for anyone who needs to reinstall the previous build.',
    note: `Legacy release — it predates the current v${CURRENT_VERSION_LABEL} build. New installs should use the v${CURRENT_VERSION_LABEL} setup (.exe).`,
  },
  {
    id: 'msix',
    title: 'App Package (.msix)',
    filename: 'LinkDit-Pad.msix',
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
    filename: 'LinkDit-Pad-Portable.zip',
    format: '.zip',
    version: 'Upcoming',
    releaseDate: 'Planned',
    fileSize: '—',
    sha256: 'Will be published with the release',
    requirements: 'Windows 10/11 (64-bit)',
    isAvailable: false,
    type: 'Portable',
    tagline: 'A no-install ZIP build for running LinkDit Pad from a USB drive.',
    note: 'Portable builds are on the roadmap and not yet published.',
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
# Getting Started with LinkDit Pad

LinkDit Pad is a desktop editor for Windows that keeps words on your disk and
nothing else. There is no account, no cloud, and nothing running in the
background.

## The workspace

- **Tab bar** (top) — every open document is a tab. Unsaved changes are marked
  with a small dot.
- **Sidebar** (left) — recent files, pinned documents, search, and settings.
- **Editor** (center) — where you write.
- **Status bar** (bottom) — live word and character counts, plus the current
  editing mode.

## Write your first document

1. Open LinkDit Pad.
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
    description: 'Write Markdown source directly, or switch a document to rich text.',
    lastUpdated: '2026-07',
    readTime: '4 min read',
    content: `
# Writing Markdown in LinkDit Pad

Markdown is the native language of LinkDit Pad. You can type it directly as
source, or switch a document to rich text and let the toolbar format for you.

## Common syntax

- **Bold** \\*\\*text\\*\\* and *italic* \\*text\\*
- ## Headings from level 1 to 6
- \\- List items and \\- [ ] checkbox task lists
- \\| Tables \\| with \\| columns \\|
- \\> Block quotes, and \\\`code\\\` inline
- Links \\[text\\](https://example.com) and images

## Plain text

LinkDit Pad opens \`.txt\` files as-is. What you type is what is saved — no
hidden formatting, no surprise encoding changes.
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
    description: 'Switch between the warm light and dark palettes in Settings.',
    lastUpdated: '2026-07',
    readTime: '2 min read',
    content: `
# Light & Dark Themes

LinkDit Pad ships with two themes built around the same layout:

1. **Paper (light)** — a warm off-white canvas with near-black text, tuned for
   daytime writing.
2. **Evening (dark)** — a warm near-black canvas with soft text and a single
   restrained accent.

Both are designed to be easy on the eyes during long sessions. Switch them
anywhere from **Settings** in the sidebar.
    `,
  },
];

export const CHANGELOG_ITEMS: ChangelogItem[] = [
  {
    version: CURRENT_VERSION,
    date: 'September 2026',
    title: 'Current release',
    summary: `The current release of LinkDit Pad: a rebuilt, offline-first Markdown and rich-text editor for Windows 10 and 11, with dependable Auto Save that writes through the real document save pipeline. Version numbering restarted from 0.1 when the product line was rebuilt on a new codebase.`,
    badge: 'Current',
    status: 'current',
    highlights: [
      'Capture Screenshot — capture the visible document area or the entire document, preview it, save it as PNG, or copy it to the clipboard',
      'Improved Auto Save reliability',
      'Automatic saving now writes changes through the real document save pipeline',
      'Clear save status feedback: Saving, Saved, Auto-save failed, and Auto Save off',
      'Improved save handling for focused split-editor panes',
      'Preserved .ldp document support and offline/local-first workflow',
    ],
    featuresAdded: [
      'Capture Screenshot: snapshot the visible editor area or the entire document, preview the result, save it as a PNG, or copy it straight to the clipboard',
      'Screenshot capture works entirely on your machine — no AI, no cloud upload, no account or login required',
      'Dependable Auto Save that writes to the document file on disk after a configurable idle delay',
      'Auto Save shares the exact save pipeline as File > Save for identical output (.ldp serialization included)',
      'Status bar Auto Save indicator: Saving, Saved, Auto-save failed, and Auto Save off',
      'Auto Save follows the focused pane in split-editor view',
    ],
    improvements: [
      'Serialized write queue prevents manual Save and Auto Save from ever overlapping on the same file',
      'Retired the legacy, unused localStorage auto-save drafts',
    ],
    bugFixes: [
      'Fixed Auto Save reliability for documents with unsaved changes',
    ],
  },
  {
    version: '0.1.1',
    date: 'September 2026',
    title: 'Previous release',
    summary: `The previous release of LinkDit Pad: the rebuilt, offline-first Markdown and rich-text editor for Windows 10 and 11. Version numbering restarted from 0.1 when the product line was rebuilt on a new codebase.`,
    badge: 'Previous',
    status: 'previous',
    highlights: [
      'Multi-tab editor with dirty-state indicators',
      'Markdown / plain text and rich text (tables, task lists, highlights, links)',
      'Sidebar with files, recent, bookmarks, search, and settings',
      'Search & replace, version history, trash, document lock, and auto backup',
      'Local files only — no account, no telemetry, no cloud',
    ],
    featuresAdded: [
      'Tabbed document workspace with dirty-state indicators',
      'Per-document switching between Markdown / plain text and rich text',
      'Search & replace with case-sensitive, whole-word, and regex options',
      'Find-in-files search from the sidebar with jump-to-match results',
      'Version history with per-document snapshots and restore',
      'Local Trash with restore and empty actions',
      'File Explorer with drag-and-drop organization',
      'Document outline panel',
      'Document lock (local password, no cloud)',
      'Auto backup with a recovery dialog',
      'Command palette for keyboard-first actions',
      'Bookmarks and pinned documents in the sidebar',
      'Live word and character counts in the status bar',
      'Warm light and dark themes',
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
    summary: 'An earlier release of LinkDit Pad built on the previous codebase. It is superseded by the rebuilt v' + CURRENT_VERSION_LABEL + '.',
    badge: 'Legacy',
    status: 'legacy',
    highlights: [
      'Belongs to the previous LinkDit Pad codebase',
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
    summary: 'A beta of the original LinkDit Pad concept. Superseded by the current v' + CURRENT_VERSION_LABEL + ' release.',
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

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 'road-1',
    title: 'Split Editor',
    description: 'View two documents side by side, or a single document in split panes, with synchronized tabs.',
    category: 'Editing',
    status: 'Planned',
    targetRelease: 'v0.2.0',
    votes: 0,
    tags: ['Editor', 'Tabs'],
  },
  {
    id: 'road-2',
    title: 'PDF & HTML Export',
    description: 'Export documents to PDF, HTML, and other formats directly from the app.',
    category: 'Files',
    status: 'Under Review',
    targetRelease: 'v0.2.0',
    votes: 0,
    tags: ['Export', 'Formats'],
  },
  {
    id: 'road-3',
    title: 'Portable ZIP Build',
    description: 'A no-install ZIP build for running LinkDit Pad from a USB drive.',
    category: 'Packaging',
    status: 'Under Review',
    targetRelease: 'Later',
    votes: 0,
    tags: ['Installer', 'Portable'],
  },
  {
    id: 'road-4',
    title: 'Optional Local AI (Opt-In)',
    description: 'An opt-in, off-by-default integration with local AI models for grammar and summaries — no cloud accounts.',
    category: 'Assistant',
    status: 'Under Review',
    targetRelease: 'Later',
    votes: 0,
    tags: ['AI', 'Privacy', 'Local'],
  },
  {
    id: 'road-5',
    title: 'Encrypted Vault',
    description: 'An optional local encrypted vault for documents you want locked even further.',
    category: 'Security',
    status: 'Under Review',
    targetRelease: 'Later',
    votes: 0,
    tags: ['Security', 'Encryption'],
  },
  {
    id: 'road-6',
    title: 'Plugin SDK',
    description: 'A sandboxed plugin API so the community can extend LinkDit Pad without making it heavy.',
    category: 'Extensions',
    status: 'Under Review',
    targetRelease: 'Later',
    votes: 0,
    tags: ['Extensions', 'SDK'],
  },
];

export const FAQS: FAQItem[] = [
  {
    category: 'General',
    question: 'What is LinkDit Pad?',
    answer: 'LinkDit Pad is a desktop Markdown and rich-text editor for Windows 10 and 11. It is tabbed, fast, works fully offline, and keeps every document as a normal file on your own computer.',
  },
  {
    category: 'Privacy',
    question: 'Does LinkDit Pad track or log my writing?',
    answer: 'No. LinkDit Pad has no analytics, no error trackers, and no background usage reporting. Documents are stored as plain files on your local drive and are never uploaded.',
  },
  {
    category: 'Licensing',
    question: 'Is LinkDit Pad free to use?',
    answer: 'Yes. LinkDit Pad is free to download and use for personal, academic, and commercial purposes. There is no paid tier and no account to create.',
  },
  {
    category: 'Installation',
    question: 'Does LinkDit Pad need an internet connection?',
    answer: 'No. Install it once, and it runs entirely offline. There is no cloud dependency, no login, and nothing waiting for a connection.',
  },
  {
    category: 'Installation',
    question: 'Which installer should I choose?',
    answer: `Use the current Windows Setup (.exe), v${CURRENT_VERSION_LABEL}, for everyone. The legacy links — the MSI (v1.0.0) and the older Setup.exe (v1.0.0) — are kept for IT administrators who already deploy those files; both predate the current v${CURRENT_VERSION_LABEL} build, and new installs should use the v${CURRENT_VERSION_LABEL} setup. A Microsoft Store-style MSIX package is not published yet.`,
  },
  {
    category: 'Features',
    question: 'Can I write both Markdown and rich text?',
    answer: 'Yes. Each document can run in Markdown/plain-text mode or rich-text mode — with headings, tables, task lists, highlights, links, and images — and you can switch per document.',
  },
  {
    category: 'General',
    question: 'Where can I get support or request a feature?',
    answer: `Open the Support page or email ${CONTACT_EMAIL}. Feature requests are tracked on the roadmap, and the Support page explains how votes and requests work.`,
  },
];