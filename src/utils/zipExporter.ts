import JSZip from 'jszip';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root metadata & config files
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'linkdit-official-website',
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: {
          dev: 'vite --port=3000 --host=0.0.0.0',
          build: 'vite build',
          preview: 'vite preview',
          lint: 'tsc --noEmit',
        },
        dependencies: {
          react: '^19.0.1',
          'react-dom': '^19.0.1',
          'lucide-react': '^0.546.0',
          motion: '^12.23.24',
          jszip: '^3.10.1',
        },
        devDependencies: {
          vite: '^6.2.3',
          '@vitejs/plugin-react': '^5.0.4',
          '@tailwindcss/vite': '^4.1.14',
          tailwindcss: '^4.1.14',
          typescript: '~5.8.2',
          '@types/node': '^22.14.0',
        },
      },
      null,
      2
    )
  );

  zip.file(
    'README.md',
    `# LinkDit Official Website (linkdit.online)

Official website repository for LinkDit and LinkDit Pad — "Write Better. Create Faster."

## Features
- Complete multi-page React application for LinkDit Pad
- Light / Dark Mode support
- 21 Interactive UI Screenshots Gallery with Lightbox & Zoom
- Windows Installers (.exe, .msi, .msix) Auto-detection & downloads
- Documentation Hub with instant search and code copy
- Changelog, Release Notes, Public Roadmap with feature voting
- Support Center & Contact Forms
- Fully written Privacy Policy, Terms, License, EULA, and Copyright docs
- SEO optimized with Sitemap, Robots.txt, OpenGraph, and Schema.org metadata

## Quick Start
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## Deployment
This project is Vercel ready. Simply push to GitHub or connect the directory to Vercel and set target domain to \`https://linkdit.online\`.
`
  );

  zip.file(
    'index.html',
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LinkDit - Write Better. Create Faster.</title>
    <meta name="description" content="Official website for LinkDit and LinkDit Pad. The ultra-fast, modern text and markdown editor." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
  );

  zip.file(
    'vite.config.ts',
    `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
`
  );

  zip.file(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          skipLibCheck: true,
          moduleResolution: 'bundler',
          isolatedModules: true,
          jsx: 'react-jsx',
          paths: { '@/*': ['./*'] },
          noEmit: true,
        },
      },
      null,
      2
    )
  );

  zip.file(
    'vercel.json',
    JSON.stringify(
      {
        cleanUrls: true,
        headers: [
          {
            source: '/(.*)',
            headers: [
              { key: 'X-Content-Type-Options', value: 'nosniff' },
              { key: 'X-Frame-Options', value: 'DENY' },
              { key: 'X-XSS-Protection', value: '1; mode=block' },
            ],
          },
        ],
      },
      null,
      2
    )
  );

  zip.file('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://linkdit.online/sitemap.xml`);

  return await zip.generateAsync({ type: 'blob' });
}
