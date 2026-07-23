import {
  ScreenshotItem,
  FeatureCategory,
  DownloadOption,
  DocArticle,
  ChangelogItem,
  RoadmapItem,
  FAQItem,
} from '../types';

export const DOMAIN_NAME = 'linkdit.online';
export const APP_NAME = 'LinkDit';
export const PRODUCT_NAME = 'LinkDit Pad';
export const TAGLINE = 'Write Better. Create Faster.';
export const BRAND_DESCRIPTION =
  'LinkDit Pad is the ultra-fast, distracion-free text and markdown editor designed for writers, developers, and thinkers. Zero bloat, instant startup, full privacy, and total offline control.';

// 21 Screenshots list matching exact request: 00_Hero.png to 20_Markdown.png
export const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: '00_Hero',
    filename: '00_Hero.png',
    title: 'Hero Interface Showcase',
    category: 'Interface',
    description: 'The clean, glassmorphic primary workspace of LinkDit Pad with active document session.',
    previewColor: 'from-blue-600 to-indigo-700',
    mockContent: {
      title: 'LinkDit Pad - Focused Workspace',
      subtext: 'Distraction-free canvas with floating bar and word counters',
      details: ['Minimalist Chrome', 'Real-time Stats Bar', 'Subtle Typography Spacing'],
    },
  },
  {
    id: '01_Home',
    filename: '01_Home.png',
    title: 'Welcome Screen & Recent Vaults',
    category: 'Interface',
    description: 'Quick access dashboard showing recent files, pinned documents, and template starters.',
    previewColor: 'from-slate-700 to-slate-900',
    mockContent: {
      title: 'Welcome Back to LinkDit Pad',
      subtext: 'Quick start new draft or jump into recent workspace',
      details: ['Keyboard Quick Switcher (Ctrl+P)', 'Vault Favorites', 'Recent File History'],
    },
  },
  {
    id: '02_Editor',
    filename: '02_Editor.png',
    title: 'Distraction-Free Editor View',
    category: 'Editor',
    description: 'Ultra-clean composition mode with line numbers, code syntax highlighting, and smooth caret.',
    previewColor: 'from-emerald-600 to-teal-800',
    mockContent: {
      title: 'The Core Writing Canvas',
      subtext: 'Engineered for uninterrupted train of thought',
      details: ['Typewriter Scrolling Mode', 'Line Highlight', 'Focus Mode Dimming'],
    },
  },
  {
    id: '03_Dark_Mode',
    filename: '03_Dark_Mode.png',
    title: 'Midnight Dark Mode Accent',
    category: 'Themes',
    description: 'Deep OLED-friendly dark palette tailored for night sessions with low visual fatigue.',
    previewColor: 'from-zinc-900 to-black',
    mockContent: {
      title: 'OLED Midnight Dark Preset',
      subtext: 'High contrast text on pitch-dark canvas',
      details: ['Eye Care Contrast Palette', 'Custom Caret Glow', 'Muted Borders'],
    },
  },
  {
    id: '04_Light_Mode',
    filename: '04_Light_Mode.png',
    title: 'Clean Paper Light Theme',
    category: 'Themes',
    description: 'Crisp, high-contrast light mode inspired by warm archival paper and clean modern UI.',
    previewColor: 'from-amber-50 to-orange-100',
    mockContent: {
      title: 'Archival Cream Light Palette',
      subtext: 'Softer background tones for daytime productivity',
      details: ['WCAG AAA Contrast Rating', 'Subtle Shadow Elevators', 'Warm Paper Finish'],
    },
  },
  {
    id: '05_File_Menu',
    filename: '05_File_Menu.png',
    title: 'Command Palette & File Operations',
    category: 'Tools',
    description: 'Instant file menu, export dialogs, and format conversions (.md, .txt, .html, .pdf, .json).',
    previewColor: 'from-indigo-600 to-violet-800',
    mockContent: {
      title: 'Multi-Format Export & File Control',
      subtext: 'Export your writing anywhere in one click',
      details: ['Markdown to PDF/HTML', 'Raw Plaintext Output', 'Encrypted Auto-Backup'],
    },
  },
  {
    id: '06_Settings',
    filename: '06_Settings.png',
    title: 'Preference & Configuration Panel',
    category: 'Customization',
    description: 'Comprehensive control over font family, line heights, tab size, auto-save delay, and shortcuts.',
    previewColor: 'from-purple-600 to-indigo-900',
    mockContent: {
      title: 'Granular Workspace Settings',
      subtext: 'Tailor every pixel and keystroke behavior',
      details: ['Font Family & Pitch Control', 'Custom Tab Stops', 'Smart Indent Rules'],
    },
  },
  {
    id: '07_Documentation',
    filename: '07_Documentation.png',
    title: 'Embedded Help & Docs Hub',
    category: 'Tools',
    description: 'In-app keyboard shortcut cheat sheets, markdown guides, and quick syntax reference.',
    previewColor: 'from-cyan-600 to-blue-800',
    mockContent: {
      title: 'Integrated Help & Cheatsheets',
      subtext: 'Learn shortcuts without leaving the editor',
      details: ['Markdown Cheat Sheet', 'Shortcuts Matrix', 'Local Guides'],
    },
  },
  {
    id: '08_Fonts',
    filename: '08_Fonts.png',
    title: 'Typography & Font Selector',
    category: 'Customization',
    description: 'Support for custom system fonts, Inter, JetBrains Mono, Fira Code, and serif editorial fonts.',
    previewColor: 'from-pink-600 to-rose-800',
    mockContent: {
      title: 'Custom Font Engine',
      subtext: 'Switch between Sans-Serif, Serif, and Monospace',
      details: ['Ligatures Support', 'Custom Font Weight Sliders', 'Variable Line-Height'],
    },
  },
  {
    id: '09_Theme_Customization',
    filename: '09_Theme_Customization.png',
    title: 'Theme Designer Studio',
    category: 'Customization',
    description: 'Create and save your custom color themes with live accent tint selectors and CSS exports.',
    previewColor: 'from-fuchsia-600 to-purple-800',
    mockContent: {
      title: 'Theme Creator & Accent Color Picker',
      subtext: 'Design custom background tints and cursor highlights',
      details: ['Color Wheel Customizer', 'JSON Theme Export/Import', '12 Built-in Presets'],
    },
  },
  {
    id: '10_Search',
    filename: '10_Search.png',
    title: 'Global File & Symbol Search',
    category: 'Tools',
    shortcut: 'Ctrl + Shift + F',
    description: 'Lightning-fast fuzzy search across all documents in your working directory with instant jump.',
    previewColor: 'from-blue-700 to-slate-900',
    mockContent: {
      title: 'Instant Fuzzy File Indexer',
      subtext: 'Search thousands of files in under 5 milliseconds',
      details: ['Regex Match Support', 'Match Highlighting', 'Inline Replacement'],
    },
  },
  {
    id: '11_Welcome_Screen',
    filename: '11_Welcome_Screen.png',
    title: 'First-Launch Onboarding',
    category: 'Interface',
    description: 'Sleek first-run screen introducing key bindings, default workspace folder, and dark mode choice.',
    previewColor: 'from-sky-600 to-indigo-800',
    mockContent: {
      title: 'Welcome to LinkDit Pad',
      subtext: 'Zero setup required - start typing immediately',
      details: ['1-Click Preset Selection', 'Folder Picker', 'Offline Privacy Notice'],
    },
  },
  {
    id: '12_About',
    filename: '12_About.png',
    title: 'System Information & Diagnostics',
    category: 'Tools',
    description: 'Version info, local storage status, keyboard performance diagnostics, and license details.',
    previewColor: 'from-teal-600 to-cyan-900',
    mockContent: {
      title: 'About LinkDit Pad v1.0.0',
      subtext: 'Native performance running with zero background telemetry',
      details: ['Build Hash', 'RAM Footprint: ~24MB', 'No Cloud Telemetry Flag'],
    },
  },
  {
    id: '13_Find_Replace',
    filename: '13_Find_Replace.png',
    title: 'Regex Find & Replace Bar',
    category: 'Editor',
    shortcut: 'Ctrl + H',
    description: 'Powerful find-and-replace overlay with case sensitivity, whole word, and regex pattern matching.',
    previewColor: 'from-amber-600 to-orange-800',
    mockContent: {
      title: 'Advanced Pattern Replace Engine',
      subtext: 'Find, batch replace, and highlight matches in real-time',
      details: ['Case Matching', 'Regex Match Tokens', 'Replace All Safety Buffer'],
    },
  },
  {
    id: '14_Shortcuts',
    filename: '14_Shortcuts.png',
    title: 'Custom Hotkey Binder',
    category: 'Customization',
    description: 'Rebind any editor action to your preferred keyboard shortcuts or VS Code keymaps.',
    previewColor: 'from-violet-600 to-purple-900',
    mockContent: {
      title: 'Keyboard Shortcuts Manager',
      subtext: 'Map commands to your muscle memory',
      details: ['VS Code Preset Mode', 'Vim / Emacs Keybinding Toggle', 'Conflict Detector'],
    },
  },
  {
    id: '15_Fullscreen',
    filename: '15_Fullscreen.png',
    title: 'Immersive Zen Fullscreen',
    category: 'Editor',
    shortcut: 'F11',
    description: 'Pure content isolation removing window titlebars, status bars, and desktop distractions.',
    previewColor: 'from-zinc-800 to-neutral-950',
    mockContent: {
      title: 'Zen Mode - Pure Typography',
      subtext: 'Just you and your words on screen',
      details: ['Floating Auto-Hide Toolbar', 'Centered Column Width', 'Soft Ambient Backdrop'],
    },
  },
  {
    id: '16_File_Explorer',
    filename: '16_File_Explorer.png',
    title: 'Side Tree File Navigator',
    category: 'Interface',
    shortcut: 'Ctrl + B',
    description: 'Toggleable side tree for nested folder navigation, file renaming, and quick drag-and-drop reorganization.',
    previewColor: 'from-slate-800 to-zinc-900',
    mockContent: {
      title: 'Local File Explorer Drawer',
      subtext: 'Manage local directory trees seamlessly',
      details: ['Nested Folder Expansion', 'File Creation Shortcuts', 'Filter by Extension'],
    },
  },
  {
    id: '17_Status_Bar',
    filename: '17_Status_Bar.png',
    title: 'Real-time Metrics Status Bar',
    category: 'Interface',
    description: 'Live statistics showing word count, character count, reading time estimate, encoding (UTF-8), and CRLF/LF.',
    previewColor: 'from-cyan-700 to-blue-900',
    mockContent: {
      title: 'Live Statistics & Line Counters',
      subtext: 'Granular writing pace metrics updated on every keystroke',
      details: ['Words, Chars, Lines', 'Estimated Reading Time', 'UTF-8 & Line Ending Indicator'],
    },
  },
  {
    id: '18_Context_Menu',
    filename: '18_Context_Menu.png',
    title: 'Smart Contextual Right-Click Menu',
    category: 'Tools',
    description: 'Quick right-click actions for text formatting, case conversions, word lookup, and markdown transformation.',
    previewColor: 'from-emerald-700 to-teal-900',
    mockContent: {
      title: 'Contextual Action Popover',
      subtext: 'Transform selected text instantly',
      details: ['Convert UPPERCASE / lowercase / Title Case', 'Wrap in Code / Quote', 'Format Table'],
    },
  },
  {
    id: '19_Code_Block',
    filename: '19_Code_Block.png',
    title: 'Syntax Highlighting & Code Blocks',
    category: 'Editor',
    description: 'Rich syntax coloring for JavaScript, TypeScript, Python, HTML, Rust, SQL, C++, JSON, and CSS.',
    previewColor: 'from-indigo-700 to-blue-950',
    mockContent: {
      title: 'Polyglot Syntax Highlighter',
      subtext: 'Engineered for developers who write docs and code side-by-side',
      details: ['Copy Code Block Button', 'Language Auto-Detect', 'Line Number Gutter'],
    },
  },
  {
    id: '20_Markdown',
    filename: '20_Markdown.png',
    title: 'Live Split Markdown Preview',
    category: 'Editor',
    shortcut: 'Ctrl + Shift + P',
    description: 'Side-by-side live rendering of GFM tables, checklists, math formulas, blockquotes, and image embeds.',
    previewColor: 'from-slate-900 to-indigo-950',
    mockContent: {
      title: 'Real-time Split Markdown Preview',
      subtext: 'Instant visual output synchronized with your cursor position',
      details: ['GitHub Flavored Markdown (GFM)', 'Synchronized Dual-Scroll', 'Table Formatter'],
    },
  },
];

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'text-editing',
    title: 'Text Editing & Engine',
    description: 'Uncompromising speed and editing precision built on a lightweight native buffer.',
    iconName: 'FileText',
    features: [
      { name: 'Instant Startup', description: 'Launches in under 120ms with near-zero memory footprint (~24MB RAM).' },
      { name: 'Multi-Caret Editing', description: 'Add multiple cursors with Alt+Click for rapid simultaneous modifications.' },
      { name: 'Smart Auto-Closing', description: 'Auto-completes quotes, brackets, parentheses, and markdown symbols.' },
      { name: 'Typewriter Scrolling', description: 'Keeps your active editing line centered on screen for steady eye focus.' },
    ],
  },
  {
    id: 'writing',
    title: 'Writing & Markdown',
    description: 'Rich writing tools designed for authoring articles, code documentation, and personal journals.',
    iconName: 'PenTool',
    features: [
      { name: 'GFM Markdown Support', description: 'Full GitHub Flavored Markdown with tables, task lists, and footnotes.' },
      { name: 'Live Split Preview', description: 'Synchronized visual preview that scrolls smoothly alongside your cursor.' },
      { name: 'Focus Mode Dimming', description: 'Dims surrounding paragraphs to keep your current sentence in high contrast.' },
      { name: 'Live Metrics & Goals', description: 'Set target word counts with real-time progress bars and reading time estimates.' },
    ],
  },
  {
    id: 'customization',
    title: 'Customization & Controls',
    description: 'Personalize every detail of your writing environment to fit your preferences.',
    iconName: 'Sliders',
    features: [
      { name: 'Hotkey Rebinding', description: 'Full control over all keyboard shortcuts, compatible with VS Code bindings.' },
      { name: 'Layout Toggle', description: 'Hide sidebars, status bars, or line numbers with simple one-key toggles.' },
      { name: 'Custom Line Spacing', description: 'Fine-tune line heights, paragraph margins, and tab width stops.' },
      { name: 'Vim & Emacs Modes', description: 'Optional modal editing modes for keyboard-driven power users.' },
    ],
  },
  {
    id: 'themes',
    title: 'Themes & Visual Tints',
    description: 'Beautiful carefully balanced light and dark palettes designed to prevent eye strain.',
    iconName: 'Palette',
    features: [
      { name: 'OLED Midnight Dark', description: 'Pure black canvas tailored for low-light night writing sessions.' },
      { name: 'Paper Archival Light', description: 'Warm off-white finish inspired by classic high-grade print paper.' },
      { name: 'Accent Tint Customizer', description: 'Choose your favorite primary accent color for highlights and cursors.' },
      { name: 'System Auto-Switch', description: 'Automatically syncs with your operating system light/dark theme preference.' },
    ],
  },
  {
    id: 'fonts',
    title: 'Typography & Fonts',
    description: 'Full support for custom installed system fonts and high-grade variable typography.',
    iconName: 'Type',
    features: [
      { name: 'System Font Picker', description: 'Use any font installed on your computer, including custom monospaced fonts.' },
      { name: 'Ligatures Support', description: 'Renders code ligatures beautifully for languages like Fira Code or JetBrains Mono.' },
      { name: 'Font Weight Fine-Tuning', description: 'Adjust weight from thin 300 to bold 700 with precise numerical stepping.' },
      { name: 'Editorial Serif Option', description: 'Switch to classic serif fonts like Georgia or Playfair for essay writing.' },
    ],
  },
  {
    id: 'performance',
    title: 'Performance & Speed',
    description: 'Zero bloat architecture optimized for huge multi-megabyte text files without stutter.',
    iconName: 'Zap',
    features: [
      { name: 'Sub-Millisecond Input Latency', description: 'Keystrokes render instantly with zero input lag.' },
      { name: 'Large File Support', description: 'Opens 50MB+ plain text and log files without freezing or memory leaks.' },
      { name: 'Battery Efficient', description: 'Uses zero CPU when idle, maximizing laptop battery longevity.' },
      { name: 'Lightweight Footprint', description: 'Compact binary size that installs in seconds and uses minimal storage.' },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Your notes and code belong strictly to you. No tracking, no accounts, no cloud leakage.',
    iconName: 'Shield',
    features: [
      { name: 'Zero Telemetry', description: 'No usage analytics, error trackers, or background diagnostic pings.' },
      { name: 'No Login Required', description: 'Use the software immediately without registering an account or password.' },
      { name: '100% Local Storage', description: 'All your files stay stored locally on your hard disk drive.' },
      { name: 'Open File Integrity', description: 'Uses standard plain text files (.md, .txt) with no proprietary lock-in format.' },
    ],
  },
  {
    id: 'offline',
    title: 'Offline Independence',
    description: 'Works 100% offline anywhere — on airplanes, remote locations, or offline workstations.',
    iconName: 'WifiOff',
    features: [
      { name: 'Zero Cloud Dependency', description: 'Does not require internet connection to launch, write, or export.' },
      { name: 'Local Auto-Save Buffer', description: 'Protects your unsaved work in a local emergency cache during unexpected power loss.' },
      { name: 'Direct File System Access', description: 'Reads and writes straight to your filesystem without sync conflicts.' },
      { name: 'Portable Executable Mode', description: 'Run directly from a USB flash drive with configuration files stored alongside.' },
    ],
  },
  {
    id: 'future-ai',
    title: 'Future AI Integration (Opt-In)',
    description: 'Roadmap integrations for local, privacy-first AI assistance without forced subscriptions.',
    iconName: 'Cpu',
    features: [
      { name: 'Local Ollama & LLM Support', description: 'Connect your local AI models for grammar suggestions without sending data online.', badge: 'Roadmap' },
      { name: 'Smart Outline Generator', description: 'Generate document structure summaries powered by local model processing.', badge: 'Roadmap' },
      { name: 'Strict Opt-In Choice', description: 'AI features will remain 100% optional and disabled by default.', badge: 'Roadmap' },
    ],
  },
  {
    id: 'future-cloud',
    title: 'Future Cloud Sync (Optional)',
    description: 'Optional self-hosted or end-to-end encrypted backup solutions on the horizon.',
    iconName: 'Cloud',
    features: [
      { name: 'E2EE Self-Hosted Sync', description: 'Sync notes across machines using your own WebDAV, S3, or Nextcloud storage.', badge: 'Roadmap' },
      { name: 'Encrypted Vaults', description: 'Passphrase-protected local vaults encrypted with AES-GCM-256.', badge: 'Roadmap' },
      { name: 'Version History Retention', description: 'Local document diff timeline to restore previous drafts easily.', badge: 'Roadmap' },
    ],
  },
];

export const DOWNLOAD_OPTIONS: DownloadOption[] = [
  {
    id: 'exe',
    title: 'Windows Setup (.exe)',
    filename: 'LinkDit-Pad-Setup.exe',
    format: '.exe',
    version: 'v1.0.0',
    releaseDate: 'July 2026',
    fileSize: 'TBD',
    sha256: '4e82a93c8b1d2f091a13b5e11f02883391b42e742884f6c91a0215918e93ad01',
    requirements: 'Windows 10 / 11 (64-bit)',
    isAvailable: true,
    type: 'Installer',
    tagline: 'Recommended standard setup wizard for single users and desktop PCs.',
  },
  {
    id: 'msi',
    title: 'Enterprise Installer (.msi)',
    filename: 'LinkDit-Pad.msi',
    format: '.msi',
    version: 'v1.0.0',
    releaseDate: 'July 2026',
    fileSize: 'TBD',
    sha256: '8c37d04a3f1295e8081122a014a51e6211d08214fa8156191b7e411b0213192a',
    requirements: 'Windows Server 2019+ / Windows 10/11 x64',
    isAvailable: true,
    type: 'Enterprise MSI',
    tagline: 'Ideal for IT administrators deploying across corporate domain networks.',
  },
  {
    id: 'msix',
    title: 'App Package (.msix)',
    filename: 'LinkDit-Pad.msix',
    format: '.msix',
    version: 'v1.0.0',
    releaseDate: 'July 2026',
    fileSize: 'TBD',
    sha256: '1a99852f8a12903328e11a3341b528e190223401fa220199042b512019a82301',
    requirements: 'Windows 10 Build 1809+ / Windows 11',
    isAvailable: true,
    type: 'Windows App Store',
    tagline: 'Modern sandboxed package with seamless background updates.',
  },
  {
    id: 'portable',
    title: 'Portable ZIP Version',
    filename: 'LinkDit-Pad-Portable.zip',
    format: '.zip',
    version: '1.0.0 (Upcoming)',
    releaseDate: 'Coming Soon',
    fileSize: 'Coming Soon',
    sha256: 'Will be published upon release',
    requirements: 'Any Windows x64 Machine',
    isAvailable: false,
    type: 'Portable',
    tagline: 'No installation required. Run directly from USB drives with local config.',
  },
];

export const DOC_ARTICLES: DocArticle[] = [
  {
    id: 'getting-started',
    categoryId: 'overview',
    categoryName: 'Getting Started',
    title: 'Quick Start & Interface Guide',
    description: 'Learn the core interface components and how to start writing in seconds.',
    lastUpdated: '2026-07-22',
    readTime: '3 min read',
    content: `
# Getting Started with LinkDit Pad

Welcome to **LinkDit Pad** — the distraction-free workspace designed for speed and clarity.

## Key Features at a Glance
- **Instant Launch**: Opens in under 120ms with minimal memory footprint.
- **Pure Local Files**: Directly open, edit, and save \`.md\` and \`.txt\` files on your local drive.
- **Keyboard First**: Every action has a dedicated hotkey or command palette entry.

## Quick Keybindings
- **Ctrl + N**: Create a new blank draft.
- **Ctrl + O**: Open a local file or folder.
- **Ctrl + S**: Save changes immediately.
- **Ctrl + Shift + P**: Toggle Split Markdown Preview.
- **F11**: Toggle Zen Fullscreen Mode.
    `,
    codeSnippet: `# Quick launch command via Windows Terminal / CMD
linkdit-pad "C:\\Users\\You\\Documents\\Notes\\Ideas.md"`,
    language: 'bash',
  },
  {
    id: 'markdown-guide',
    categoryId: 'editing',
    categoryName: 'Editing & Formatting',
    title: 'Markdown & Syntax Cheatsheet',
    description: 'Complete reference for GitHub Flavored Markdown (GFM) supported in LinkDit Pad.',
    lastUpdated: '2026-07-22',
    readTime: '5 min read',
    content: `
# Markdown Syntax Reference

LinkDit Pad renders full **GitHub Flavored Markdown (GFM)** with instant dual preview.

## Formatting Essentials
- **Bold**: \`**text**\` or \`__text__\`
- *Italic*: \`*text*\` or \`_text_\`
- ~~Strikethrough~~: \`~~text~~\`
- \`Inline Code\`: \`\` \`code\` \`\`

## Checklists
- [x] Download LinkDit Pad
- [x] Configure preferred font
- [ ] Write first document
    `,
    codeSnippet: `| Feature | Support Status | Notes |
| :--- | :---: | ---: |
| GFM Tables | Supported | Auto-formatted |
| Syntax Coloring | 20+ Languages | Fast Parser |
| Footnotes | Supported | Interactive Links |`,
    language: 'markdown',
  },
  {
    id: 'theme-customization',
    categoryId: 'customization',
    categoryName: 'Themes & Customization',
    title: 'Theme Customization & Colors',
    description: 'How to switch presets, adjust accent colors, and import custom JSON theme specs.',
    lastUpdated: '2026-07-22',
    readTime: '4 min read',
    content: `
# Customizing Themes in LinkDit Pad

Tailor the aesthetics of your editor to match your working preference and lighting conditions.

## Default Palette Presets
1. **OLED Midnight**: Deep black background for late-night focus.
2. **Archival Cream**: Soft off-white paper texture for daytime writing.
3. **Nordic Slate**: Cool dark gray with muted blue accents.
4. **Emerald Cyber**: Dark green slate for terminal enthusiasts.

## Custom Theme JSON Format
You can import custom JSON themes by dropping them into the \`%APPDATA%\\LinkDit\\Themes\` directory.
    `,
    codeSnippet: `{
  "name": "Custom Amber Glow",
  "type": "dark",
  "background": "#12100e",
  "foreground": "#f5e6d0",
  "accent": "#f59e0b",
  "selection": "#38240f",
  "lineHighlight": "#1e1a16"
}`,
    language: 'json',
  },
  {
    id: 'shortcuts-reference',
    categoryId: 'shortcuts',
    categoryName: 'Keyboard Shortcuts',
    title: 'Full Keyboard Shortcuts Index',
    description: 'Complete list of default hotkeys and how to rebind them to match your muscle memory.',
    lastUpdated: '2026-07-22',
    readTime: '3 min read',
    content: `
# LinkDit Pad Keyboard Shortcuts

Boost your typing speed using dedicated hotkeys.

| Command | Windows Shortcut | Function |
| :--- | :--- | :--- |
| **New File** | \`Ctrl + N\` | Creates a new draft buffer |
| **Open File** | \`Ctrl + O\` | Opens file chooser dialog |
| **Quick Command Palette** | \`Ctrl + Shift + P\` | Opens searchable action palette |
| **Find & Replace** | \`Ctrl + H\` | Toggles find and replace bar |
| **Toggle Sidebar** | \`Ctrl + B\` | Collapses/expands file explorer |
| **Zen Fullscreen** | \`F11\` | Removes all window chrome |
| **Line Duplicate** | \`Shift + Alt + Down\` | Duplicates active line downwards |
    `,
    codeSnippet: `// Custom keybindings configuration file: %APPDATA%/LinkDit/keybindings.json
[
  { "command": "editor.toggleFocusMode", "key": "ctrl+alt+f" },
  { "command": "editor.formatTable", "key": "ctrl+alt+t" }
]`,
    language: 'json',
  },
];

export const CHANGELOG_ITEMS: ChangelogItem[] = [
  {
    version: '1.0.0',
    date: 'July 22, 2026',
    title: 'Official Commercial Launch',
    summary: 'Initial official release of LinkDit Pad featuring ultra-fast startup, GFM markdown preview, zero telemetry, and native Windows installer packages.',
    badge: 'Major',
    highlights: [
      'Sub-120ms cold start performance engine',
      'Full local file storage guarantee with zero cloud tracking',
      'Dual live Markdown split view preview',
      'Native installer suites (.exe, .msi, .msix)',
    ],
    featuresAdded: [
      'Added 21 UI screenshot modes and responsive theme gallery',
      'Integrated fuzzy command palette (Ctrl+Shift+P)',
      'Added OLED Midnight Dark and Archival Cream Light themes',
      'Implemented real-time status bar statistics (words, characters, reading time)',
    ],
    improvements: [
      'Optimized memory usage under 25MB RAM during heavy editing',
      'Smoother caret motion animation with customizable blink rates',
      'Enhanced GFM table auto-formatting on pipe character entry',
    ],
    bugFixes: [
      'Fixed cursor offset issue on high-DPI scaling monitors',
      'Resolved UTF-8 BOM encoding glitch when opening legacy files',
      'Fixed file lock bug when closing workspace tabs rapidly',
    ],
  },
  {
    version: '0.9.5',
    date: 'June 15, 2026',
    title: 'Beta 2 Performance Tuning',
    summary: 'Refined typing buffer latency, multi-caret editing, and custom hotkey binder implementation.',
    badge: 'Feature',
    highlights: [
      'Multi-cursor editing support via Alt+Click',
      'Added custom keybinding JSON editor in preferences',
    ],
    featuresAdded: [
      'Added typewriter scrolling mode toggle',
      'Integrated regex find-and-replace overlay bar',
    ],
    improvements: [
      'Reduced binary payload size by 14%',
      'Improved line highlight contrast across light modes',
    ],
    bugFixes: [
      'Fixed scroll bar stuttering in 100,000+ line documents',
    ],
  },
];

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 'road-1',
    title: 'Local Ollama & LLM AI Writing Assistant',
    description: 'Opt-in integration with local Ollama models for grammar review and document summaries without cloud data transmission.',
    category: 'Future AI',
    status: 'In Progress',
    targetRelease: 'v1.2.0 (Q3 2026)',
    votes: 342,
    tags: ['AI', 'Privacy', 'Local'],
  },
  {
    id: 'road-2',
    title: 'Portable ZIP Standalone Package',
    description: 'Zero-install portable directory download running directly from USB keys with configuration saved locally.',
    category: 'Distribution',
    status: 'In Progress',
    targetRelease: 'v1.1.0 (Q3 2026)',
    votes: 289,
    tags: ['Windows', 'Portable'],
  },
  {
    id: 'road-3',
    title: 'End-to-End Encrypted Vault Sync (Self-Hosted)',
    description: 'Optional E2EE sync module supporting custom WebDAV, Nextcloud, or S3 bucket endpoints.',
    category: 'Future Cloud',
    status: 'Planned',
    targetRelease: 'v2.0.0 (Q1 2027)',
    votes: 415,
    tags: ['Sync', 'E2EE', 'Self-Hosted'],
  },
  {
    id: 'road-4',
    title: 'Vim & Emacs Modal Input Controls',
    description: 'Full modal keymap engine supporting normal, insert, visual, and command modes inside the main editor buffer.',
    category: 'Editing',
    status: 'Under Review',
    targetRelease: 'v1.3.0 (Q4 2026)',
    votes: 198,
    tags: ['Vim', 'Keybindings'],
  },
];

export const FAQS: FAQItem[] = [
  {
    category: 'General',
    question: 'What is LinkDit Pad?',
    answer: 'LinkDit Pad is a fast, distraction-free text and Markdown editor built specifically for writers, developers, and researchers. It focuses on instant startup speed, zero bloat, local file privacy, and clean modern aesthetics.',
  },
  {
    category: 'Privacy',
    question: 'Does LinkDit Pad track or log my writing data?',
    answer: 'No. LinkDit Pad contains zero telemetry, zero analytics tracking, and zero diagnostic logging. All documents and notes remain stored strictly on your local hard drive.',
  },
  {
    category: 'Licensing',
    question: 'Is LinkDit Pad free to use?',
    answer: 'Yes! LinkDit Pad v1.0.0 is completely free to download and use for personal, academic, and commercial purposes.',
  },
  {
    category: 'Installation',
    question: 'Which download installer should I choose for Windows?',
    answer: 'We recommend the standard Windows Setup (.exe) for individual desktop users. For IT administrators deploying across corporate networks, use the Enterprise MSI package. If you prefer sandboxed store apps, select the MSIX package.',
  },
  {
    category: 'Features',
    question: 'Can I open large text files or logs with LinkDit Pad?',
    answer: 'Yes. LinkDit Pad utilizes an optimized virtualized rendering buffer capable of opening multi-megabyte plain text and log files smoothly without freezing.',
  },
  {
    category: 'General',
    question: 'Where can I get support or report a feature request?',
    answer: 'You can submit requests via our official Support page or email us directly at support@linkdit.online. Our engineering team reviews all user input regularly.',
  },
];
