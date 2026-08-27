import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, Sun, Moon, Activity, Flame, LogOut, BookOpen, Sparkles, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'motion/react';

interface UserMenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
}

export const renderUserAvatar = (avatar: string, fallback: string = '🦊') => {
  const currentAvatar = avatar || fallback;
  if (currentAvatar.startsWith('data:image/') || currentAvatar.startsWith('http') || currentAvatar.includes('/')) {
    return <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />;
  }
  return <span>{currentAvatar}</span>;
};

export function UserMenu({ isDarkMode, onToggleDarkMode, onOpenSearch }: UserMenuProps) {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const [personaName, setPersonaName] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('sikaya_profile_persona');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.name) {
          setPersonaName(parsed.name);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-1 xl:gap-1.5 shrink-0">
      <div className="flex items-center gap-1 xl:gap-1.5 border-l border-slate-200/60 dark:border-slate-800 pl-1 xl:pl-3">
        {/* Search Trigger Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden xl:flex items-center gap-1.5 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/80 px-2.5 py-1 rounded-lg text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all cursor-pointer w-36 xl:w-40 text-left"
        >
          <Search className="w-3 h-3" />
          <span className="text-[10px] font-bold flex-1">{t('nav.search_placeholder')}</span>
          <span className="text-[8px] bg-slate-200/60 dark:bg-slate-700/80 px-1 py-0.2 rounded font-black text-slate-500 dark:text-slate-400 select-none">
            ⌘K
          </span>
        </button>

        {/* Medium Screen Search Button Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex xl:hidden p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
          aria-label="Cari"
          title="Cari Materi"
        >
          <Search className="w-4 h-4" />
        </button>
        
        {/* Language Dropdown Selector */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="px-2 py-1 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
            aria-label="Select Language"
            title={language === 'id' ? 'Pilih Bahasa' : 'Select Language'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-teal-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{language}</span>
            <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden"
              >
                {[
                  { code: 'id', flag: '🇮🇩', name: 'Indonesia' },
                  { code: 'en', flag: '🇺🇸', name: 'English' },
                  { code: 'ja', flag: '🇯🇵', name: '日本語' },
                  { code: 'zh', flag: '🇨🇳', name: '中文' }
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code as any);
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-bold transition-colors flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      language === item.code 
                        ? 'text-teal-600 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/10' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.flag}</span> {item.name}
                    </span>
                    {language === item.code && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-800 transition-all cursor-pointer relative group overflow-hidden border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
          aria-label="Toggle Theme"
          title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
        >
          <div className="transition-transform duration-500 group-hover:rotate-12">
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </div>
        </button>

        {/* Reminder Toggle Button */}
        <button
          type="button"
          onClick={() => toast.success("Pengingat investasi harian telah diaktifkan.")}
          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-800 transition-all cursor-pointer relative group overflow-hidden border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
          aria-label="Toggle Reminder"
          title="Aktifkan Reminder Investasi"
        >
          <Activity className="w-4 h-4 text-emerald-500 group-hover:animate-pulse" />
        </button>

        {user ? (
          <div className="flex items-center gap-1.5">
            <Link 
              to="/belajar" 
              className="group flex items-center gap-1.5 lg:gap-2 bg-gradient-to-r from-teal-50 to-teal-100/40 dark:from-slate-900 dark:to-slate-800/80 border border-teal-150 dark:border-slate-800 pl-1 lg:pl-1.5 pr-2 lg:pr-2.5 py-1 rounded-xl hover:border-teal-300 dark:hover:border-teal-500/50 shadow-xs hover:shadow-md hover:shadow-teal-100/10 dark:hover:shadow-none transition-all duration-200"
            >
              <div className="w-6 h-6 bg-white dark:bg-slate-850 rounded-lg flex items-center justify-center text-md shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                {renderUserAvatar(user.avatar)}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-0.5">{t('nav.class')}</p>
                <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 leading-none max-w-[50px] xl:max-w-[80px] truncate">{user.fullName.split(' ')[0]}</p>
              </div>
              <span className="hidden xl:flex items-center gap-0.5 px-1 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[8px] font-black rounded-md ml-0.5 border border-teal-500/20">
                <Flame className="w-2 h-2 fill-current text-teal-500" /> {user.xp} XP
              </span>
            </Link>

            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 p-1.5 rounded-lg transition-all cursor-pointer border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40" 
              title={t('nav.exit')}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {personaName && (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl mr-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">👋 {personaName}</span>
                <button 
                  onClick={() => { localStorage.removeItem('sikaya_onboarding_completed'); localStorage.removeItem('sikaya_profile_persona'); window.location.reload(); }}
                  className="text-[10px] text-rose-500 hover:underline font-bold ml-1.5 cursor-pointer"
                  title="Reset Onboarding Profil"
                >
                  Reset
                </button>
              </div>
            )}
            <button 
              onClick={() => navigate('/login')} 
              className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-1.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
            >
              {t('nav.login')}
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="text-[11px] font-black bg-teal-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-xs border border-teal-700/20 group"
            >
              <BookOpen className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /> 
              <span>{t('nav.start')}</span>
              <Sparkles className="w-3.5 h-3.5 text-teal-200 animate-pulse ml-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
