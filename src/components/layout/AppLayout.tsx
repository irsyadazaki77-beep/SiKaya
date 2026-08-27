import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import { SearchPalette } from './SearchPalette';
import { Footer } from './Footer';
import { OnboardingModal } from '../OnboardingModal';
import { useNavigation } from '../../hooks/useNavigation';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export function AppLayout() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    isMenuOpen,
    setIsMenuOpen,
    activeHoverMenu,
    handleMouseEnterMenu,
    handleMouseLeaveMenu,
    navigateTo,
    isMobileBelajarOpen,
    setIsMobileBelajarOpen,
    isMobileSimulasiOpen,
    setIsMobileSimulasiOpen,
    isMobileKeuanganOpen,
    setIsMobileKeuanganOpen,
    isMobileKomunitasOpen,
    setIsMobileKomunitasOpen
  } = useNavigation();

  const { isScrolled, isDarkMode, toggleDarkMode } = useResponsiveLayout();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-950 dark:selection:text-teal-200 antialiased flex flex-col transition-colors duration-300">
      {/* Header Bar */}
      <Header
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        activeHoverMenu={activeHoverMenu}
        onMouseEnterMenu={handleMouseEnterMenu}
        onMouseLeaveMenu={handleMouseLeaveMenu}
        onNavigateTo={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNavigation
        isMenuOpen={isMenuOpen}
        onCloseMenu={() => setIsMenuOpen(false)}
        onNavigateTo={navigateTo}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isMobileBelajarOpen={isMobileBelajarOpen}
        setIsMobileBelajarOpen={setIsMobileBelajarOpen}
        isMobileSimulasiOpen={isMobileSimulasiOpen}
        setIsMobileSimulasiOpen={setIsMobileSimulasiOpen}
        isMobileKeuanganOpen={isMobileKeuanganOpen}
        setIsMobileKeuanganOpen={setIsMobileKeuanganOpen}
        isMobileKomunitasOpen={isMobileKomunitasOpen}
        setIsMobileKomunitasOpen={setIsMobileKomunitasOpen}
      />

      {/* ⌘K Global Search Command Palette */}
      <SearchPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateTo={navigateTo}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal />

      {/* Main Routed Content */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AppLayout;
