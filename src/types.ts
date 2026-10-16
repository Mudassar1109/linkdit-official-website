export type PageId =
  | 'home'
  | 'products'
  | 'features'
  | 'download'
  | 'screenshots'
  | 'docs'
  | 'changelog'
  | 'release-notes'
  | 'support'
  | 'contact'
  | 'compare'
  | 'privacy'
  | 'terms'
  | 'license'
  | 'eula'
  | 'copyright'
  | '404';

export interface ScreenshotItem {
  id: string;
  filename: string;
  title: string;
  category: 'Editor' | 'Themes' | 'Customization' | 'Tools' | 'Interface';
  description: string;
  shortcut?: string;
  /** Tone of the rendered preview surface. Drives the scene background AND
      the text colours drawn on it, so a preview that is itself a dark
      screenshot stays readable in both themes. */
  sceneTone: 'light' | 'dark';
  mockContent: {
    title: string;
    subtext: string;
    details: string[];
  };
}

export interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: {
    name: string;
    description: string;
    badge?: string;
    details?: string;
  }[];
}

export interface DownloadOption {
  id: string;
  title: string;
  filename: string;
  format: '.exe' | '.msi' | '.msix' | '.zip';
  version: string;
  releaseDate: string;
  fileSize: string;
  sha256: string;
  requirements: string;
  isAvailable: boolean;
  type: 'Installer' | 'Enterprise MSI' | 'Windows App Store' | 'Portable';
  tagline: string;
  isCurrent?: boolean;
  note?: string;
}

export interface DocArticle {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  lastUpdated: string;
  readTime: string;
  content: string;
  codeSnippet?: string;
  language?: string;
}

export interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  summary: string;
  badge?: 'Current' | 'Previous' | 'Legacy' | 'Major' | 'Feature' | 'Patch';
  status?: 'current' | 'previous' | 'legacy';
  highlights: string[];
  featuresAdded: string[];
  improvements: string[];
  bugFixes: string[];
}

export type EditorTag =
  | 'free'
  | 'open-source'
  | 'cross-platform'
  | 'local-first'
  | 'live-preview'
  | 'extensible'
  | 'academic'
  | 'windows-only';

export interface ComparisonRow {
  id: string;
  label: string;
}

export interface EditorComparison {
  id: string;
  name: string;
  isLinkDit: boolean;
  tagline: string;
  websiteLabel: string;
  websiteHref: string;
  tags: EditorTag[];
  /** Feature values keyed by ComparisonRow.id. */
  cells: Record<string, string>;
  pros: string[];
  limitations: string[];
  useCases: string[];
}

export interface ComparisonFilter {
  id: EditorTag | 'all';
  label: string;
}

export interface ComparisonSource {
  editor: string;
  links: { label: string; href: string }[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Features' | 'Installation' | 'Privacy' | 'Licensing';
}
