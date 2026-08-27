import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Bot, Home, Search, BookOpen } from 'lucide-react';

export function NotFoundPage() {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 15 }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-dot-pattern transition-colors">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full text-center relative z-10"
      >
        <motion.div 
          variants={itemVariants}
          className="relative inline-block mb-8"
        >
          {/* Big decorative 404 numbers */}
          <h1 className="text-8xl sm:text-9xl font-black text-slate-200 dark:text-slate-800/60 font-display select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-20 h-20 bg-teal-600 dark:bg-teal-700 text-white rounded-3xl flex items-center justify-center shadow-2xl rotate-12"
            >
              <Bot className="w-10 h-10 -rotate-12 animate-pulse" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2 
          variants={itemVariants}
          className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight font-display"
        >
          Halaman Hilang di Orbit
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed max-w-sm mx-auto"
        >
          Waduh! Sepertinya halaman yang kamu cari sudah dipindahkan, dihapus, atau tersesat di peta finansial kami.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col gap-3.5 sm:flex-row justify-center sm:gap-4"
        >
          <Link 
            to="/" 
            className="px-6 py-3.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 hover:opacity-95 active:scale-95 rounded-2xl transition-all shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Ke Beranda Utama
          </Link>
          <Link 
            to="/belajar" 
            className="px-6 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 rounded-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            Belajar Dulu Aja
          </Link>
        </motion.div>

        {/* Fun Easter egg footer */}
        <motion.div 
          variants={itemVariants}
          className="mt-14 pt-8 border-t border-slate-100 dark:border-slate-900 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold font-mono uppercase tracking-widest"
        >
          <Search className="w-3.5 h-3.5" />
          Misi keuangan berjalan lancar
        </motion.div>
      </motion.div>
    </div>
  );
}
