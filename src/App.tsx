import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { SEOHead } from './components/SEOHead';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { DownloadPage } from './pages/DownloadPage';
import { ScreenshotsPage } from './pages/ScreenshotsPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { ReleaseNotesPage } from './pages/ReleaseNotesPage';
import { SupportPage } from './pages/SupportPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPages } from './pages/LegalPages';
import { AuthLoginPage } from './pages/AuthLoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

const VALID_PAGES: PageId[] = [
  'home',
  'products',
  'features',
  'download',
  'screenshots',
  'docs',
  'roadmap',
  'changelog',
  'release-notes',
  'support',
  'contact',
  'privacy',
  'terms',
  'license',
  'eula',
  'copyright',
];

function isAuthRoutePath(path: string): boolean {
  return /^\/auth\/(login|callback)$/.test(path.replace(/\/+$/, ''));
}

export default function App() {
  const [isAuthRoute, setIsAuthRoute] = useState<boolean>(() =>
    isAuthRoutePath(window.location.pathname)
  );

  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    const path = window.location.pathname.replace(/^\//, '') || 'home';
    return VALID_PAGES.includes(path as PageId) ? (path as PageId) : '404';
  });

  const [selectedScreenshotId, setSelectedScreenshotId] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global keyboard shortcut listener for Ctrl + K / Cmd + K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Sync route with URL history
  useEffect(() => {
    const handlePopState = () => {
      setIsAuthRoute(isAuthRoutePath(window.location.pathname));
      const path = window.location.pathname.replace(/^\//, '') || 'home';
      setCurrentPage(VALID_PAGES.includes(path as PageId) ? (path as PageId) : '404');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const newPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  const handleOpenScreenshot = (id: string) => {
    setSelectedScreenshotId(id);
    navigate('screenshots');
  };

  return (
    <ThemeProvider>
      {isAuthRoute ? (
        <AuthLoginPage />
      ) : (
      <div className="min-h-screen bg-paper dark:bg-ink-950 text-ink dark:text-paper flex flex-col justify-between font-sans transition-colors duration-200">
        <SEOHead pageId={currentPage} />

        {/* Sticky Global Navigation Bar */}
        <Header
          currentPage={currentPage}
          navigate={navigate}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        {/* Main Route Content Viewport */}
        <main className="flex-1">
          {currentPage === 'home' && (
            <HomePage navigate={navigate} onOpenScreenshot={handleOpenScreenshot} />
          )}

          {currentPage === 'products' && <ProductsPage navigate={navigate} />}

          {currentPage === 'features' && <FeaturesPage navigate={navigate} />}

          {currentPage === 'download' && <DownloadPage navigate={navigate} />}

          {currentPage === 'screenshots' && (
            <ScreenshotsPage
              navigate={navigate}
              selectedIdFromQuery={selectedScreenshotId}
            />
          )}

          {currentPage === 'docs' && <DocumentationPage navigate={navigate} />}

          {currentPage === 'roadmap' && <RoadmapPage navigate={navigate} />}

          {currentPage === 'changelog' && <ChangelogPage navigate={navigate} />}

          {currentPage === 'release-notes' && <ReleaseNotesPage navigate={navigate} />}

          {currentPage === 'support' && <SupportPage navigate={navigate} />}

          {currentPage === 'contact' && <ContactPage navigate={navigate} />}

          {['privacy', 'terms', 'license', 'eula', 'copyright'].includes(currentPage) && (
            <LegalPages initialTab={currentPage} navigate={navigate} />
          )}

          {currentPage === '404' && (
            <NotFoundPage navigate={navigate} onOpenSearch={() => setSearchModalOpen(true)} />
          )}
        </main>

        {/* Global Footer */}
        <Footer navigate={navigate} />

        {/* Search Modal */}
        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          navigate={navigate}
          onSelectScreenshot={(id) => handleOpenScreenshot(id)}
        />
      </div>
      )}
    </ThemeProvider>
  );
}
