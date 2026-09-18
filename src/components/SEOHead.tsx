import React, { useEffect } from 'react';
import { PageId } from '../types';
import { DOMAIN_NAME, PRODUCT_NAME } from '../data/websiteData';

interface SEOProps {
  pageId: PageId;
  title?: string;
  description?: string;
}

export const SEOHead: React.FC<SEOProps> = ({ pageId, title, description }) => {
  const defaultDesc =
    'LinkDit Pad is a fast, offline-first Markdown and rich-text editor for Windows 10 and 11. Multi-tab editing, live word counts, local files only — no account, no telemetry.';

  const pageTitles: Record<PageId, string> = {
    home: `${PRODUCT_NAME} — Professional Markdown & Text Editor for Windows`,
    products: `About ${PRODUCT_NAME} — The Product`,
    features: `Features — ${PRODUCT_NAME} for Windows`,
    download: `Download ${PRODUCT_NAME} for Windows (v0.1.1, .exe)`,
    screenshots: `Interface Gallery — ${PRODUCT_NAME}`,
    docs: `Documentation & Guides — ${PRODUCT_NAME}`,
    roadmap: `Roadmap — ${PRODUCT_NAME}`,
    changelog: `Changelog — ${PRODUCT_NAME}`,
    'release-notes': `Release Notes — ${PRODUCT_NAME} v0.1.1`,
    support: `Support & FAQ — ${PRODUCT_NAME}`,
    contact: `Contact — LinkDit`,
    privacy: `Privacy Policy — ${PRODUCT_NAME}`,
    terms: `Terms of Service — ${PRODUCT_NAME}`,
    license: `Software License — ${PRODUCT_NAME}`,
    eula: `End User License Agreement — ${PRODUCT_NAME}`,
    copyright: `Copyright & Trademarks — ${PRODUCT_NAME}`,
    '404': `Page Not Found — ${PRODUCT_NAME}`,
  };

  const currentTitle = title || pageTitles[pageId] || defaultTitle(pageId);
  const currentDesc = description || defaultDesc;
  const canonicalUrl = `https://${DOMAIN_NAME}/${pageId === 'home' ? '' : pageId}`;

  function defaultTitle(p: PageId) {
    return `${PRODUCT_NAME} — ${p.charAt(0).toUpperCase() + p.slice(1)}`;
  }

  useEffect(() => {
    document.title = currentTitle;

    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('meta[name="description"]', 'name', 'description', currentDesc);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', currentTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', currentDesc);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', PRODUCT_NAME);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', `https://${DOMAIN_NAME}/app-icon-1024.png`);
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', currentTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', currentDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', `https://${DOMAIN_NAME}/app-icon-1024.png`);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);
  }, [currentTitle, currentDesc, canonicalUrl]);

  return null;
};