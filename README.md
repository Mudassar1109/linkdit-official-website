# linkdit-official-website

The official website for LinkDit and Typodocs, built with React + Vite + Tailwind CSS v4.

## Run locally

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev` (serves on http://localhost:3000)
3. Production build: `npm run build`
4. Type check: `npm run lint`

## Deploy

Static SPA — `vercel.json` rewrites all routes to `/index.html`. Downloadable installers live in `public/downloads/`.

### Domains

| Host | Role |
| --- | --- |
| `https://www.typodocs.online` | **Canonical.** Set in `src/config.ts` (`SITE_URL`). |
| `https://typodocs.online` | Redirects to the canonical `www` host at the DNS level. |
| `https://linkdit.online` | Legacy host. Kept attached until the new domain is verified. |

`SITE_URL` drives the canonical tag, Open Graph/Twitter URLs, JSON-LD, the
prerendered per-page canonicals, `robots.txt` and `sitemap.xml`. Change it in
one place and rebuild.
