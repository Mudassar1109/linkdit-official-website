import type { PageId } from './types';

export const DOMAIN_NAME = 'linkdit.online';
export const SITE_URL = 'https://www.linkdit.online';

export const APP_NAME = 'LinkDit';
export const PRODUCT_NAME = 'LinkDit Pad';
export const TAGLINE = 'Write clearly. Write locally.';

export const CURRENT_VERSION = '0.1.2';
export const CURRENT_VERSION_LABEL = `v${CURRENT_VERSION}`;
export const DOWNLOAD_FILENAME = `LinkDit-Pad-${CURRENT_VERSION}-x64-setup.exe`;
export const DOWNLOAD_FILE_SIZE = '4.05 MB';

export const BRAND_DESCRIPTION =
  'LinkDit Pad is a fast, offline-first Markdown and rich-text editor for Windows 10 and 11. Multi-tab editing, live word counts, local files only — no account, no telemetry.';

export interface PageMeta {
  id: PageId;
  path: string;
  title: string;
  description: string;
}

export const PAGE_META: Record<PageId, PageMeta> = {
  home: {
    id: 'home',
    path: '/',
    title: `${PRODUCT_NAME} — Professional Markdown & Text Editor for Windows`,
    description: BRAND_DESCRIPTION,
  },
  products: {
    id: 'products',
    path: '/products',
    title: `About ${PRODUCT_NAME} — The Product`,
    description:
      'What LinkDit Pad is and why it exists: a fast, offline-first Markdown and rich-text editor for Windows that keeps every document as a plain, local file.',
  },
  features: {
    id: 'features',
    path: '/features',
    title: `Features — ${PRODUCT_NAME} for Windows`,
    description:
      'All LinkDit Pad features: tabbed editing, Markdown and rich text, light and dark themes, search and replace, and a file system that stays entirely on your PC.',
  },
  download: {
    id: 'download',
    path: '/download',
    title: `Download ${PRODUCT_NAME} for Windows (Setup .exe)`,
    description: `Download ${PRODUCT_NAME} — a free ${DOWNLOAD_FILE_SIZE} Windows installer. No account, no sign-up, fully offline. Legacy MSI and Setup builds are also available.`,
  },
  screenshots: {
    id: 'screenshots',
    path: '/screenshots',
    title: `Interface Gallery — ${PRODUCT_NAME}`,
    description:
      'A closer look at LinkDit Pad: the tabbed workspace, Markdown and rich-text views, dark theme, sidebar, and live word-count status bar.',
  },
  docs: {
    id: 'docs',
    path: '/docs',
    title: `Documentation & Guides — ${PRODUCT_NAME}`,
    description:
      'Get started with LinkDit Pad: quick-start guide, Markdown and rich-text reference, themes, files, and privacy.',
  },
  roadmap: {
    id: 'roadmap',
    path: '/roadmap',
    title: `Roadmap — ${PRODUCT_NAME}`,
    description:
      'What is planned for LinkDit Pad — split editor, PDF and HTML export, portable builds, optional local AI, and more. Feature requests are tracked here.',
  },
  changelog: {
    id: 'changelog',
    path: '/changelog',
    title: `Changelog — ${PRODUCT_NAME}`,
    description:
      `Version history for ${PRODUCT_NAME}: the current v${CURRENT_VERSION} release and earlier builds, with what shipped in each.`,
  },
  'release-notes': {
    id: 'release-notes',
    path: '/release-notes',
    title: `Release Notes — ${PRODUCT_NAME} v${CURRENT_VERSION}`,
    description:
      `Release notes for ${PRODUCT_NAME} v${CURRENT_VERSION}: multi-tab editing, Markdown and rich text, sidebar, version history, and a fully offline, no-tracker design.`,
  },
  support: {
    id: 'support',
    path: '/support',
    title: `Support & FAQ — ${PRODUCT_NAME}`,
    description:
      'Help for LinkDit Pad: frequently asked questions about installation, features, privacy, and licensing, plus how to contact support.',
  },
  contact: {
    id: 'contact',
    path: '/contact',
    title: `Contact — ${APP_NAME}`,
    description:
      `Contact the ${APP_NAME} team about ${PRODUCT_NAME} — support, feedback, and feature requests via ${DOMAIN_NAME}.`,
  },
  privacy: {
    id: 'privacy',
    path: '/privacy',
    title: `Privacy Policy — ${PRODUCT_NAME}`,
    description:
      'LinkDit Pad privacy: no telemetry, no logins, no cloud. Documents stay as local files, and the website sets no cookies and runs no trackers.',
  },
  terms: {
    id: 'terms',
    path: '/terms',
    title: `Terms of Service — ${APP_NAME}`,
    description:
      `Terms of service for downloading and using ${PRODUCT_NAME} from ${DOMAIN_NAME}.`,
  },
  license: {
    id: 'license',
    path: '/license',
    title: `Software License — ${PRODUCT_NAME}`,
    description:
      'The software license for LinkDit Pad: free for personal, academic, and commercial use, with restrictions on redistribution.',
  },
  eula: {
    id: 'eula',
    path: '/eula',
    title: `End User License Agreement — ${PRODUCT_NAME}`,
    description:
      'The end-user license agreement for LinkDit Pad for Windows installations.',
  },
  copyright: {
    id: 'copyright',
    path: '/copyright',
    title: `Copyright & Trademarks — ${APP_NAME}`,
    description:
      `Copyright and trademark information for ${APP_NAME} and ${PRODUCT_NAME}.`,
  },
  '404': {
    id: '404',
    path: '/404',
    title: `Page Not Found — ${PRODUCT_NAME}`,
    description: 'The page you are looking for does not exist.',
  },
};

export const SITE_PAGES: PageMeta[] = [
  PAGE_META.home,
  PAGE_META.products,
  PAGE_META.features,
  PAGE_META.download,
  PAGE_META.screenshots,
  PAGE_META.docs,
  PAGE_META.roadmap,
  PAGE_META.changelog,
  PAGE_META['release-notes'],
  PAGE_META.support,
  PAGE_META.contact,
  PAGE_META.privacy,
  PAGE_META.terms,
  PAGE_META.license,
  PAGE_META.eula,
  PAGE_META.copyright,
];