import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Activity, Wallet, Users, ChevronDown, 
  Compass, MessageSquare, Trophy, TrendingUp, Target, Bot, 
  Flame, LogOut, Sparkles, Sun, Moon, Globe, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { renderUserAvatar } from './UserMenu';

interface MobileNavigationProps {
  isMenuOpen: boolean;
  onCloseMenu: () => void;
  onNavigateTo: (path: string, state?: Record<string, unknown>) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isMobileBelajarOpen: boolean;
  setIsMobileBelajarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileSimulasiOpen: boolean;
  setIsMobileSimulasiOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileKeuanganOpen: boolean;
  setIsMobileKeuanganOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileKomunitasOpen: boolean;
  setIsMobileKomunitasOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MobileNavigation({
  isMenuOpen,
  onCloseMenu,
  onNavigateTo,
  isDarkMode,
  onToggleDarkMode,
  isMobileBelajarOpen,
  setIsMobileBelajarOpen,
  isMobileSimulasiOpen,
  setIsMobileSimulasiOpen,
  isMobileKeuanganOpen,
  setIsMobileKeuanganOpen,
  isMobileKomunitasOpen,
  setIsMobileKomunitasOpen
}: MobileNavigationProps) {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 max-h-[85vh] overflow-y-auto"
          >
            {/* User Info Bar if logged in */}
            {user && (
              <div className="flex items-center justify-between p-3 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 rounded-2xl mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-xs overflow-hidden">
                    {renderUserAvatar(user.avatar)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 dark:text-slate-200">{user.fullName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold flex items-center gap-0.5">
                        <Flame className="w-3 h-3 fill-current text-teal-500" /> {user.xp} XP
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold rounded-full">
                        {user.literacyLevel}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); onCloseMenu(); navigate('/'); }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                  title="Keluar Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Nav Link: Beranda */}
            <button
              onClick={() => onNavigateTo('/')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                location.pathname === '/' 
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20' 
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                Beranda
              </span>
            </button>

            {/* Accordion: Belajar */}
            <div className="space-y-1">
              <button
                onClick={() => setIsMobileBelajarOpen(!isMobileBelajarOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  Belajar & Modul
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMobileBelajarOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileBelajarOpen && (
                <div className="pl-6 pr-2 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4 py-1">
                  <button
                    onClick={() => onNavigateTo('/belajar')}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                    Ruang Kelas Literasi (10 Modul)
                  </button>
                  <button
                    onClick={() => onNavigateTo('/belajar', { showGlossary: true })}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <Compass className="w-3.5 h-3.5 text-teal-500" />
                    Kamus Glosarium Finansial
                  </button>
                </div>
              )}
            </div>

            {/* Accordion: Simulasi */}
            <div className="space-y-1">
              <button
                onClick={() => setIsMobileSimulasiOpen(!isMobileSimulasiOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                  Simulasi & Game
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMobileSimulasiOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileSimulasiOpen && (
                <div className="pl-6 pr-2 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4 py-1">
                  <button
                    onClick={() => onNavigateTo('/simulasi')}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    Virtual Trading Simulator
                  </button>
                  <button
                    onClick={() => onNavigateTo('/life-simulator')}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <Compass className="w-3.5 h-3.5 text-rose-500" />
                    Simulasi Hidup Finansial
                  </button>
                </div>
              )}
            </div>

            {/* Accordion: Keuangan */}
            <div className="space-y-1">
              <button
                onClick={() => setIsMobileKeuanganOpen(!isMobileKeuanganOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 text-teal-600" />
                  Keuangan & Fitur
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMobileKeuanganOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileKeuanganOpen && (
                <div className="pl-6 pr-2 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4 py-1">
                  <button
                    onClick={() => onNavigateTo('/portfolio')}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <Wallet className="w-3.5 h-3.5 text-teal-500" />
                    Portfolio & Asset Tracker
                  </button>
                  <button
                    onClick={() => onNavigateTo('/features', { activeFeature: 'health' })}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    Cek Kesehatan Finansial
                  </button>
                  <button
                    onClick={() => onNavigateTo('/features', { activeFeature: 'envelope' })}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <Compass className="w-3.5 h-3.5 text-blue-500" />
                    Sistem Amplop Digital
                  </button>
                  <button
                    onClick={() => onNavigateTo('/features', { activeFeature: 'fire' })}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <Target className="w-3.5 h-3.5 text-purple-500" />
                    Kalkulator FIRE Pensiun
                  </button>
                  <button
                    onClick={() => onNavigateTo('/ai-advisor')}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <Bot className="w-3.5 h-3.5 text-indigo-500" />
                    AI Financial Advisor
                  </button>
                </div>
              )}
            </div>

            {/* Accordion: Komunitas */}
            <div className="space-y-1">
              <button
                onClick={() => setIsMobileKomunitasOpen(!isMobileKomunitasOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-teal-600" />
                  Komunitas & Berita
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMobileKomunitasOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileKomunitasOpen && (
                <div className="pl-6 pr-2 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4 py-1">
                  <button
                    onClick={() => onNavigateTo('/community')}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    Forum Diskusi Gen Z
                  </button>
                  <button
                    onClick={() => onNavigateTo('/leaderboard')}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    Papan Peringkat Investor
                  </button>
                  <button
                    onClick={() => onNavigateTo('/news')}
                    className="w-full text-left py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
                    Market News & Sentiment
                  </button>
                </div>
              )}
            </div>

            {/* Language & Theme in Mobile Menu */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                {(['id', 'en', 'ja', 'zh'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg uppercase ${
                      language === l 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-2 text-xs font-bold"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                <span>{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            {/* Login CTA if not logged in */}
            {!user && (
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onNavigateTo('/login')}
                  className="w-full py-2.5 px-4 bg-teal-600 text-white rounded-xl text-center text-xs font-black hover:bg-teal-500 transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Mulai Belajar Sekarang (Gratis)
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            location.pathname === '/' 
              ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px]">Beranda</span>
        </Link>
        <Link
          to="/belajar"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            location.pathname === '/belajar' 
              ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[9px]">Belajar</span>
        </Link>
        <Link
          to="/simulasi"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${
            location.pathname === '/simulasi' || location.pathname === '/life-simulator'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[9px]">Simulasi</span>
          <span className="absolute top-0 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
        </Link>
        <Link
          to="/portfolio"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            location.pathname === '/portfolio' || location.pathname === '/features'
              ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span className="text-[9px]">Keuangan</span>
        </Link>
        <Link
          to="/ai-advisor"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            location.pathname === '/ai-advisor' 
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <Bot className="w-4 h-4 text-indigo-500" />
          <span className="text-[9px]">AI Asisten</span>
        </Link>
      </div>
    </>
  );
}
