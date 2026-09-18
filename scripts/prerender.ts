import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CURRENT_VERSION, PAGE_META, SITE_PAGES, SITE_URL } from '../src/config';

const DIST_DIR = fileURLToPath(new URL('../dist', import.meta.url));
const BUILT_HTML = path.join(DIST_DIR, 'index.html');

function assertOne(html: string, re: RegExp, label: string) {
  const matches = html.match(re);
  if (!matches || matches.length !== 1) {
    throw new Error(`[prerender] expected exactly one match for "${label}", got ${matches?.length ?? 0}`);
  }
}

function escapeAttr(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildShell(meta: { title: string; description: string }, canonicalUrl: string, base: string) {
  let html = base;
  const title = escapeAttr(meta.title);
  const desc = escapeAttr(meta.description);
  const descSingle = /<meta\s+name="description"[\s\S]*?\/>/.exec(html);
  const ogTitle = /<meta\s+property="og:title"[\s\S]*?\/>/.exec(html);
  const ogDesc = /<meta\s+property="og:description"[\s\S]*?\/>/.exec(html);
  const ogUrl = /<meta\s+property="og:url"[\s\S]*?\/>/.exec(html);
  const twTitle = /<meta\s+name="twitter:title"[\s\S]*?\/>/.exec(html);
  const twDesc = /<meta\s+name="twitter:description"[\s\S]*?\/>/.exec(html);

  assertOne(html, /<title>[\s\S]*?<\/title>/, 'title');
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  assertOne(html, /<link rel="canonical" href="[^"]*"/, 'canonical');
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonicalUrl}"`);

  if (!descSingle) throw new Error('[prerender] description meta not found in built index.html');
  html = html.replace(descSingle[0], `<meta name="description" content="${desc}" />`);
  if (!ogTitle) throw new Error('[prerender] og:title not found');
  html = html.replace(ogTitle[0], `<meta property="og:title" content="${title}" />`);
  if (!ogDesc) throw new Error('[prerender] og:description not found');
  html = html.replace(ogDesc[0], `<meta property="og:description" content="${desc}" />`);
  if (!ogUrl) throw new Error('[prerender] og:url not found');
  html = html.replace(ogUrl[0], `<meta property="og:url" content="${canonicalUrl}" />`);
  if (!twTitle) throw new Error('[prerender] twitter:title not found');
  html = html.replace(twTitle[0], `<meta name="twitter:title" content="${title}" />`);
  if (!twDesc) throw new Error('[prerender] twitter:description not found');
  html = html.replace(twDesc[0], `<meta name="twitter:description" content="${desc}" />`);

  const sv = /"softwareVersion":\s*"[^"]*"/.exec(html);
  if (sv) html = html.replace(sv[0], `"softwareVersion": "${CURRENT_VERSION}"`);

  return html;
}

function main() {
  const base = readFileSync(BUILT_HTML, 'utf8');

  for (const page of SITE_PAGES) {
    const canonicalUrl = page.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${page.path}`;
    const shell = buildShell(PAGE_META[page.id], canonicalUrl, base);

    if (page.path === '/') {
      writeFileSync(BUILT_HTML, shell);
      console.log(`[prerender] wrote dist/index.html (${page.id})`);
      continue;
    }

    const outDir = path.join(DIST_DIR, page.id);
    mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'index.html');
    writeFileSync(outFile, shell);
    console.log(`[prerender] wrote ${outFile} (${page.id})`);
  }
}

main();