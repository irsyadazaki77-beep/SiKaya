import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Activity, Wallet, Users, ChevronDown, 
  Compass, MessageSquare, Trophy, TrendingUp, Target, Bot 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HoverMenuType } from '../../hooks/useNavigation';

interface DesktopNavProps {
  activeHoverMenu: HoverMenuType;
  onMouseEnterMenu: (menu: HoverMenuType) => void;
  onMouseLeaveMenu: () => void;
  onNavigateTo: (path: string, state?: Record<string, unknown>) => void;
}

export function DesktopNav({
  activeHoverMenu,
  onMouseEnterMenu,
  onMouseLeaveMenu,
  onNavigateTo
}: DesktopNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center gap-0.5 xl:gap-1.5 text-xs font-bold text-slate-650 dark:text-slate-300">
      {/* 1. Beranda */}
      <Link 
        to="/" 
        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 ${
          location.pathname === '/' 
            ? 'text-teal-600 dark:text-teal-450 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
            : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
        }`}
      >
        <Home className="w-3.5 h-3.5 opacity-85" />
        <span>Beranda</span>
      </Link>

      {/* 2. Belajar */}
      <div 
        className="relative group"
        onMouseEnter={() => onMouseEnterMenu('belajar')}
        onMouseLeave={onMouseLeaveMenu}
      >
        <button 
          onClick={() => navigate('/belajar')}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
            location.pathname === '/belajar' 
              ? 'text-teal-600 dark:text-teal-450 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
              : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 opacity-85" />
          <span>Belajar</span>
          <ChevronDown className={`w-2.5 h-2.5 text-slate-450 transition-transform duration-200 ${activeHoverMenu === 'belajar' ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {activeHoverMenu === 'belajar' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 mt-1 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1"
            >
              <button
                onClick={() => onNavigateTo('/belajar')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-455">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Ruang Kelas Literasi</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">10 Modul Interaktif & Kuis Seru</p>
                </div>
              </button>
              <button
                onClick={() => onNavigateTo('/belajar', { showGlossary: true })}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-455">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Kamus Glosarium</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Istilah & rumus finansial Gen-Z</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Simulasi */}
      <div 
        className="relative group"
        onMouseEnter={() => onMouseEnterMenu('simulasi')}
        onMouseLeave={onMouseLeaveMenu}
      >
        <button 
          onClick={() => navigate('/simulasi')}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
            location.pathname === '/simulasi' || location.pathname === '/life-simulator'
              ? 'text-teal-600 dark:text-teal-455 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
              : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>Simulasi</span>
          <ChevronDown className={`w-2.5 h-2.5 text-slate-455 transition-transform duration-200 ${activeHoverMenu === 'simulasi' ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {activeHoverMenu === 'simulasi' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 mt-1 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1"
            >
              <button
                onClick={() => onNavigateTo('/simulasi')}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Virtual Trading Simulator</span>
                    <span className="text-[7px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-1 rounded">LIVE</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Uji trading saham data pasar asli</p>
                </div>
              </button>
              <button
                onClick={() => onNavigateTo('/life-simulator')}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-450">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Simulasi Hidup Finansial</span>
                    <span className="text-[7px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 px-1 rounded">SERU</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Simulasi tabungan, karir, & pengeluaran</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Keuangan */}
      <div 
        className="relative group"
        onMouseEnter={() => onMouseEnterMenu('keuangan')}
        onMouseLeave={onMouseLeaveMenu}
      >
        <button 
          onClick={() => navigate('/portfolio')}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
            location.pathname === '/portfolio' || location.pathname === '/features' || location.pathname === '/ai-advisor'
              ? 'text-teal-600 dark:text-teal-450 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
              : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <Wallet className="w-3.5 h-3.5 opacity-85" />
          <span>Keuangan</span>
          <ChevronDown className={`w-2.5 h-2.5 text-slate-455 transition-transform duration-200 ${activeHoverMenu === 'keuangan' ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {activeHoverMenu === 'keuangan' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 mt-1 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1"
            >
              <button
                onClick={() => onNavigateTo('/portfolio')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-450 shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Portfolio & Asset Tracker</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Kekayaan bersih (Net Worth) & Arus Kas</p>
                </div>
              </button>
              <button
                onClick={() => onNavigateTo('/features', { activeFeature: 'health' })}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Cek Kesehatan Finansial</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Analisis skor kesehatan finansial digital</p>
                </div>
              </button>
              <button
                onClick={() => onNavigateTo('/features', { activeFeature: 'envelope' })}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-455 shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Sistem Amplop Digital</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Atur anggaran bulanan saku kuliah/kerja</p>
                </div>
              </button>
              <button
                onClick={() => onNavigateTo('/features', { activeFeature: 'fire' })}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-450 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Kalkulator FIRE</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Prediksi target pensiun dini mandiri</p>
                </div>
              </button>
              <button
                onClick={() => onNavigateTo('/ai-advisor')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">AI Financial Advisor</span>
                    <span className="text-[7px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 px-1 rounded animate-pulse">BARU</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Asisten konsultasi investasi Gen-Z</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Komunitas */}
      <div 
        className="relative group"
        onMouseEnter={() => onMouseEnterMenu('komunitas')}
        onMouseLeave={onMouseLeaveMenu}
      >
        <button 
          onClick={() => navigate('/community')}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
            location.pathname === '/community' || location.pathname === '/leaderboard' || location.pathname === '/news'
              ? 'text-teal-600 dark:text-teal-450 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
              : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-3.5 h-3.5 opacity-85" />
          <span>Komunitas</span>
          <ChevronDown className={`w-2.5 h-2.5 text-slate-455 transition-transform duration-200 ${activeHoverMenu === 'komunitas' ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {activeHoverMenu === 'komunitas' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 mt-1 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1"
            >
              <button
                onClick={() => onNavigateTo('/community')}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Forum Diskusi Gen Z</span>
                    <span className="text-[7px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-1 rounded">RAMAI</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Tanya jawab finansial & curhat cuan</p>
                </div>
              </button>
              <button
                onClick={() => onNavigateTo('/leaderboard')}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-450 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Papan Peringkat Investor</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Klasemen portofolio simulasi tertinggi</p>
                </div>
              </button>
              <button
                onClick={() => onNavigateTo('/news')}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-450 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Market News & Sentiment</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Analisis berita saham dengan AI real-time</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
