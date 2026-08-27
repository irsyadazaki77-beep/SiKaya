import React from 'react';
import { Menu, X, ShieldAlert, Sparkles } from 'lucide-react';
import { Logo } from '../Logo';
import { DesktopNav } from './DesktopNav';
import { UserMenu } from './UserMenu';
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
      {/* Educational top alert / banner */}
      <div className="bg-slate-900 text-slate-300 dark:bg-slate-950 dark:text-slate-400 py-1 px-4 text-center text-[10px] sm:text-[11px] font-bold tracking-tight border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 text-teal-400 font-extrabold">
          <Sparkles className="w-3 h-3 animate-pulse" /> Tips Finansial Hari Ini:
        </span>
        <span className="hidden sm:inline">Uang dingin adalah uang yang tidak kamu butuhkan untuk makan 6 bulan ke depan!</span>
        <span className="sm:hidden">Investasikan hanya uang dingin!</span>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-900/5 py-2.5' 
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50 py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-3">
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

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Cari"
              >
                <Sparkles className="w-5 h-5 text-teal-600" />
              </button>

              <button
                type="button"
                onClick={onToggleMenu}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
