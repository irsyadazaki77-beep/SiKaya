import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-slate-50/80 dark:bg-slate-950 pb-20 pt-16 lg:pb-28 lg:pt-24 bg-grid-pattern bg-dot-pattern transition-colors duration-300">
      {/* Dynamic ambient background orbs */}
      <div className="absolute top-1/10 left-1/10 w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/15 to-emerald-500/10 dark:from-teal-500/10 dark:to-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-float"></div>
      <div className="absolute top-1/4 right-1/10 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-500/15 to-purple-500/10 dark:from-indigo-500/10 dark:to-purple-500/5 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/20 dark:border-teal-400/25 text-teal-700 dark:text-teal-300 text-xs font-bold mb-8 uppercase tracking-wider shadow-xs backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
            <span className="font-display">{t('home.hero_badge')}</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1] mb-8 font-display">
            {t('home.hero_title')} <br />
            <span className="shimmer-text">
              {t('home.hero_title_highlight')}
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-350 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('home.hero_desc')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/simulasi" className="inline-flex justify-center items-center gap-2.5 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 hover:from-teal-500 hover:via-emerald-500 hover:to-indigo-500 rounded-2xl transition-all shadow-xl shadow-teal-600/25 hover:shadow-indigo-600/30 active:scale-95 cursor-pointer hover:-translate-y-0.5 duration-200">
              {t('home.cta_simulation')} <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <Link to="/features" className="inline-flex justify-center items-center px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-xs active:scale-95 hover:border-teal-500/30 hover:-translate-y-0.5 duration-200 backdrop-blur-sm">
              {t('home.cta_modules')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
