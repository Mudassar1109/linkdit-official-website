import { PRODUCT_NAME } from '../config'
import type { DownloadOption } from '../types'

// Website-only Google Analytics 4 measurement ID.
// The LinkDit Pad desktop application does not load or use this tag.
export const GA_MEASUREMENT_ID = 'G-R2R4E9QFLM'

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Push a command to the Google tag queue. Works before and after gtag.js
 * finishes loading; if the tag is blocked or unavailable the push is simply
 * ignored, so analytics can never break browsing.
 */
function gtag(...args: unknown[]): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag(...args)
  } else {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(args)
  }
}

/** Standard page_view. Called on initial load and on every SPA navigation. */
export function trackPageView(): void {
  gtag('event', 'page_view', {
    page_path: window.location.pathname,
    page_title: document.title,
  })
}

/** Meaningful conversion-direction CTA clicks. */
export function trackCta(ctaName: string, section: string, label: string): void {
  gtag('event', 'cta_click', {
    cta_name: ctaName,
    section,
    cta_label: label,
  })
}

/** Real installer download, with structured params drawn from the download config. */
export function trackInstallerDownload(option: DownloadOption): void {
  gtag('event', 'download_installer', {
    product: PRODUCT_NAME,
    version: option.version.replace(/^v/, ''),
    file_type: option.format.replace(/^\./, ''),
    filename: option.filename,
  })
}