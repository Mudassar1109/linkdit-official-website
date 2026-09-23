import React, { useEffect } from 'react';
import { PageId } from '../types';
import { PAGE_META, PRODUCT_NAME, SITE_URL } from '../config';

interface SEOProps {
  pageId: PageId;
  title?: string;
  description?: string;
}

export const SEOHead: React.FC<SEOProps> = ({ pageId, title, description }) => {
  const pageMeta = PAGE_META[pageId] ?? PAGE_META['404'];

  const currentTitle = title || pageMeta.title;
  const currentDesc = description || pageMeta.description;
  const canonicalUrl =
    pageId === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${pageId}`;

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
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', `${SITE_URL}/app-icon-1024.png?v=20260918`);
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', currentTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', currentDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', `${SITE_URL}/app-icon-1024.png?v=20260918`);

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