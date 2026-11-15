import type { PageId } from './types';

export const DOMAIN_NAME = 'typodocs.online';
export const SITE_URL = 'https://www.typodocs.online';

export const CONTACT_EMAIL = 'elahimudassasr1@gmail.com';

// Company / publisher identity (legal entity). Kept separate from the product.
export const APP_NAME = 'LinkDit';
// Product name shown to visitors across the site.
export const PRODUCT_NAME = 'TypoDocs';
export const TAGLINE = 'Write clearly. Write locally.';

export const CURRENT_VERSION = '0.1.2';
export const CURRENT_VERSION_LABEL = `v${CURRENT_VERSION}`;
export const DOWNLOAD_FILENAME = `Typodocs_${CURRENT_VERSION}_x64-setup.exe`;
export const DOWNLOAD_FILE_SIZE = '5.54 MB';
export const DOWNLOAD_SHA256 = 'D7DD74829F5F459AB0696FB214F64D797268039555389B2E19AC4E57419220E0';
export const DOWNLOAD_PATH = `/downloads/${DOWNLOAD_FILENAME}`;

export const BRAND_DESCRIPTION =
  'TypoDocs is a fast, offline-first Markdown and rich-text editor for Windows 10 and 11. Multi-tab editing, live word counts, local files only. Free plan available; Pro coming soon.';

export interface PageMeta {
  id: PageId;
  path: string;
  title: string;
  description: string;
  /** Private/auth pages are excluded from search indexing. */
  noindex?: boolean;
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
      'What TypoDocs is and why it exists: a fast, offline-first Markdown and rich-text editor for Windows that keeps every document as a plain, local file.',
  },
  features: {
    id: 'features',
    path: '/features',
    title: `Features — ${PRODUCT_NAME} for Windows`,
    description:
      'TypoDocs features: tabbed editing, Markdown and rich text, screenshot capture, themes and accents, search and replace, and a workspace that stays entirely on your PC.',
  },
  pricing: {
    id: 'pricing',
    path: '/pricing',
    title: `Pricing — ${PRODUCT_NAME} Free & Pro Plans`,
    description:
      'Compare the TypoDocs Free plan with the planned Pro plan. Free is available today; Pro adds advanced print/PDF, imported fonts, and image tools. Pro is coming soon.',
  },
  download: {
    id: 'download',
    path: '/download',
    title: `Download ${PRODUCT_NAME} for Windows (Setup .exe)`,
    description: `Download the ${PRODUCT_NAME} Free plan — a ${DOWNLOAD_FILE_SIZE} Windows installer. No account or payment required. Pro is coming soon.`,
  },
  screenshots: {
    id: 'screenshots',
    path: '/screenshots',
    title: `Interface Gallery — ${PRODUCT_NAME}`,
    description:
      'A closer look at TypoDocs: the tabbed workspace, Markdown and rich-text views, dark theme, sidebar, and live word-count status bar.',
  },
  docs: {
    id: 'docs',
    path: '/docs',
    title: `Documentation & Guides — ${PRODUCT_NAME}`,
    description:
      'Get started with TypoDocs: quick-start guide, Markdown and rich-text reference, themes, files, and privacy.',
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
      'Help for TypoDocs: frequently asked questions about installation, features, privacy, pricing, and licensing, plus how to contact support.',
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
      'TypoDocs privacy: the Free plan needs no account and the desktop app has no telemetry or cloud storage — documents stay as local files. This website uses aggregate Google Analytics and Google AdSense advertising.',
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
      'The software license for TypoDocs: a free plan plus a planned Pro subscription, with restrictions on redistribution.',
  },
  eula: {
    id: 'eula',
    path: '/eula',
    title: `End User License Agreement — ${PRODUCT_NAME}`,
    description:
      'The end-user license agreement for TypoDocs for Windows installations, including Free and planned Pro plan terms.',
  },
  copyright: {
    id: 'copyright',
    path: '/copyright',
    title: `Copyright & Trademarks — ${APP_NAME}`,
    description:
      `Copyright and trademark information for ${APP_NAME} and ${PRODUCT_NAME}.`,
  },
  account: {
    id: 'account',
    path: '/account',
    title: `Account — ${PRODUCT_NAME}`,
    description: 'Manage your TypoDocs account profile, email, password and data.',
    noindex: true,
  },
  billing: {
    id: 'billing',
    path: '/billing',
    title: `Billing & Subscription — ${PRODUCT_NAME}`,
    description: 'View your TypoDocs plan, subscription status and payment history.',
    noindex: true,
  },
  'sign-in': {
    id: 'sign-in',
    path: '/sign-in',
    title: `Sign in — ${PRODUCT_NAME}`,
    description: 'Sign in to your TypoDocs account.',
    noindex: true,
  },
  'sign-up': {
    id: 'sign-up',
    path: '/sign-up',
    title: `Create an account — ${PRODUCT_NAME}`,
    description: 'Create a TypoDocs account for Pro subscription and billing.',
    noindex: true,
  },
  'forgot-password': {
    id: 'forgot-password',
    path: '/forgot-password',
    title: `Reset your password — ${PRODUCT_NAME}`,
    description: 'Request a secure TypoDocs password reset link.',
    noindex: true,
  },
  'reset-password': {
    id: 'reset-password',
    path: '/reset-password',
    title: `Choose a new password — ${PRODUCT_NAME}`,
    description: 'Complete a secure TypoDocs password reset.',
    noindex: true,
  },
  'verify-email': {
    id: 'verify-email',
    path: '/verify-email',
    title: `Verify your email — ${PRODUCT_NAME}`,
    description: 'Confirm your email address to finish setting up your TypoDocs account.',
    noindex: true,
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
  PAGE_META.pricing,
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