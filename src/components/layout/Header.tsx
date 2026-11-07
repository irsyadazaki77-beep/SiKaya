import React from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Logo } from '../Logo';
import { DesktopNav } from './DesktopNav';
import { UserMenu } from './UserMenu';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { HoverMenuType } from '../../hooks/useNavigation';

interface HeaderProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeHoverMenu: HoverMenuType;
  onMouseEnterMenu: (menu: HoverMenuType) => void;
  onMouseLeaveMenu: () => void;
  onNavigateTo: (path: string, state?: Record<string, unknown>) => void;
  onOpenSearch: () => void;
}

export function Header({
  isScrolled,
  isMenuOpen,
  onToggleMenu,
  isDarkMode,
  onToggleDarkMode,
  activeHoverMenu,
  onMouseEnterMenu,
  onMouseLeaveMenu,
  onNavigateTo,
  onOpenSearch
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 transition-all duration-300">
      {/* Educational top alert / banner - hidden when scrolled on mobile for maximum viewport space */}
      <div className={`bg-slate-900 text-slate-300 dark:bg-slate-950 dark:text-slate-400 py-1 px-4 text-center text-[10px] sm:text-[11px] font-bold tracking-tight border-b border-slate-800 items-center justify-center gap-2 ${
        isScrolled ? 'hidden md:flex' : 'flex'
      }`}>
        <span className="inline-flex items-center gap-1 text-teal-400 font-extrabold">
          <Sparkles className="w-3 h-3 animate-pulse" /> Tips Finansial Hari Ini:
        </span>
        <span className="hidden sm:inline">Uang dingin adalah uang yang tidak kamu butuhkan untuk makan 6 bulan ke depan!</span>
        <span className="sm:hidden">Investasikan hanya uang dingin!</span>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-900/5 py-2 sm:py-2.5' 
          : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50 py-2.5 sm:py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation Links */}
            <DesktopNav
              activeHoverMenu={activeHoverMenu}
              onMouseEnterMenu={onMouseEnterMenu}
              onMouseLeaveMenu={onMouseLeaveMenu}
              onNavigateTo={onNavigateTo}
            />

            {/* Right Action Menu (Desktop User, Lang, Theme, Search) */}
            <UserMenu
              isDarkMode={isDarkMode}
              onToggleDarkMode={onToggleDarkMode}
              onOpenSearch={onOpenSearch}
            />

            {/* Mobile Header Action Buttons */}
            <div className="flex md:hidden items-center gap-1">
              <div className="scale-90">
                <CloudSyncIndicator />
              </div>

              <button
                type="button"
                onClick={onOpenSearch}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
                aria-label="Cari Materi"
                title="Cari"
              >
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </button>

              <button
                type="button"
                onClick={onToggleMenu}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
                aria-label={isMenuOpen ? "Tutup Menu" : "Buka Menu"}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
