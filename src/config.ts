import type { PageId } from './types';

export const DOMAIN_NAME = 'linkdit.online';
export const SITE_URL = 'https://www.linkdit.online';

export const CONTACT_EMAIL = 'elahimudassasr1@gmail.com';

// Company / publisher identity (legal entity). Kept separate from the product.
export const APP_NAME = 'LinkDit';
// Product name shown to visitors across the site.
export const PRODUCT_NAME = 'Typodocs';
export const TAGLINE = 'Write clearly. Write locally.';

export const CURRENT_VERSION = '0.1.2';
export const CURRENT_VERSION_LABEL = `v${CURRENT_VERSION}`;
// NOTE: the published installer binaries still carry the legacy LinkDit-Pad
// filenames (and legacy embedded metadata) until the desktop app is rebuilt.
// Keep these names so existing download links stay functional.
export const DOWNLOAD_FILENAME = `LinkDit-Pad-${CURRENT_VERSION}-x64-setup.exe`;
export const DOWNLOAD_FILE_SIZE = '5.98 MB';
export const DOWNLOAD_SHA256 = '8AB1B3469814EC7B4FE18FA0D33373949C9B4AF53E6375AAA6A6C2B0D60F299D';

export const BRAND_DESCRIPTION =
  'Typodocs is a fast, offline-first Markdown and rich-text editor for Windows 10 and 11. Multi-tab editing, live word counts, local files only — no account, no telemetry.';

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
    title: `${PRODUCT_NAME} ${CURRENT_VERSION_LABEL} — Professional Markdown & Text Editor for Windows`,
    description: BRAND_DESCRIPTION,
  },
  products: {
    id: 'products',
    path: '/products',
    title: `About ${PRODUCT_NAME} — The Product`,
    description:
      'What Typodocs is and why it exists: a fast, offline-first Markdown and rich-text editor for Windows that keeps every document as a plain, local file.',
  },
  features: {
    id: 'features',
    path: '/features',
    title: `Features — ${PRODUCT_NAME} for Windows`,
    description:
      'All Typodocs features: tabbed editing, Markdown and rich text, screenshot capture, light and dark themes, search and replace, and a file system that stays entirely on your PC.',
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
      'A closer look at Typodocs: the tabbed workspace, Markdown and rich-text views, dark theme, sidebar, and live word-count status bar.',
  },
  docs: {
    id: 'docs',
    path: '/docs',
    title: `Documentation & Guides — ${PRODUCT_NAME}`,
    description:
      'Get started with Typodocs: quick-start guide, Markdown and rich-text reference, themes, files, and privacy.',
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
      `Release notes for ${PRODUCT_NAME} v${CURRENT_VERSION}: screenshot capture, improved Auto Save, multi-tab editing, Markdown and rich text, sidebar, and a fully offline, no-tracker design.`,
  },
  support: {
    id: 'support',
    path: '/support',
    title: `Support & FAQ — ${PRODUCT_NAME}`,
    description:
      'Help for Typodocs: frequently asked questions about installation, features, privacy, and licensing, plus how to contact support.',
  },
  contact: {
    id: 'contact',
    path: '/contact',
    title: `Contact — ${APP_NAME}`,
    description:
      `Contact the ${APP_NAME} team about ${PRODUCT_NAME} — support, feedback, and feature requests via ${DOMAIN_NAME}.`,
  },
  compare: {
    id: 'compare',
    path: '/compare',
    title: `Compare Markdown Editors — ${PRODUCT_NAME} vs VS Code, Obsidian, Typora & More`,
    description:
      `A side-by-side comparison of ${PRODUCT_NAME}, Visual Studio Code, Obsidian, Typora, MarkText, and Zettlr — price, platforms, editing model, privacy, and extensibility, based only on official sources.`,
  },
  privacy: {
    id: 'privacy',
    path: '/privacy',
    title: `Privacy Policy — ${PRODUCT_NAME}`,
    description:
      'Typodocs privacy: the desktop app has no telemetry, no logins, and no cloud — documents stay as local files. This website uses aggregate Google Analytics and Google AdSense advertising.',
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
      'The software license for Typodocs: free for personal, academic, and commercial use, with restrictions on redistribution.',
  },
  eula: {
    id: 'eula',
    path: '/eula',
    title: `End User License Agreement — ${PRODUCT_NAME}`,
    description:
      'The end-user license agreement for Typodocs for Windows installations.',
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
  PAGE_META.changelog,
  PAGE_META['release-notes'],
  PAGE_META.support,
  PAGE_META.contact,
  PAGE_META.compare,
  PAGE_META.privacy,
  PAGE_META.terms,
  PAGE_META.license,
  PAGE_META.eula,
  PAGE_META.copyright,
];