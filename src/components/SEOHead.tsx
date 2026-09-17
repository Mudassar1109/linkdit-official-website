import React, { useEffect } from 'react';
import { PageId } from '../types';
import { DOMAIN_NAME, PRODUCT_NAME, TAGLINE } from '../data/websiteData';

interface SEOProps {
  pageId: PageId;
  title?: string;
  description?: string;
}

export const SEOHead: React.FC<SEOProps> = ({ pageId, title, description }) => {
  const defaultTitle = `${PRODUCT_NAME} | ${TAGLINE} - Official LinkDit Website`;
  const defaultDesc =
    'LinkDit Pad is the ultra-fast, distraction-free text and markdown editor. Zero bloat, sub-120ms launch, local privacy guarantee, and native Windows builds.';

  const pageTitles: Record<PageId, string> = {
    home: `${PRODUCT_NAME} - ${TAGLINE}`,
    products: `Products & Features - ${PRODUCT_NAME}`,
    features: `All Features - Text, Writing, Themes, Privacy - ${PRODUCT_NAME}`,
    download: `Download ${PRODUCT_NAME} for Windows (.exe, .msi, .msix)`,
    screenshots: `Screenshots & UI Gallery - 21 High-Res Views - ${PRODUCT_NAME}`,
    docs: `Documentation & User Guides - ${PRODUCT_NAME}`,
    roadmap: `Public Roadmap & Feature Voting - ${PRODUCT_NAME}`,
    changelog: `Changelog & Version History - ${PRODUCT_NAME}`,
    'release-notes': `Release Notes - ${PRODUCT_NAME} v0.1.1`,
    support: `Support, Help Center & FAQ - ${PRODUCT_NAME}`,
    contact: `Contact Us - LinkDit Company`,
    privacy: `Privacy Policy - 100% Local Files, No Telemetry - LinkDit`,
    terms: `Terms of Service - LinkDit`,
    license: `Software License - LinkDit`,
    eula: `End User License Agreement (EULA) - LinkDit`,
    copyright: `Copyright & Trademarks - LinkDit`,
    '404': `404 Page Not Found - LinkDit`,
  };

  const currentTitle = title || pageTitles[pageId] || defaultTitle;
  const currentDesc = description || defaultDesc;
  const canonicalUrl = `https://${DOMAIN_NAME}/${pageId === 'home' ? '' : pageId}`;

  useEffect(() => {
    document.title = currentTitle;

    // Helper to update meta tag by property or name
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', currentDesc);

    // Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', currentTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', currentDesc);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', PRODUCT_NAME);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', `https://${DOMAIN_NAME}/app-icon-1024.png`);

    // Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', currentTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', currentDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', `https://${DOMAIN_NAME}/app-icon-1024.png`);

    // Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Schema.org JSON-LD
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: PRODUCT_NAME,
      operatingSystem: 'Windows 10, Windows 11',
      applicationCategory: 'ProductivityApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      description: currentDesc,
      publisher: {
        '@type': 'Organization',
        name: 'LinkDit',
        url: `https://${DOMAIN_NAME}`,
      },
    };

    let schemaScript = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'schema-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.text = JSON.stringify(schemaData);
  }, [currentTitle, currentDesc, canonicalUrl]);

  return null;
};
