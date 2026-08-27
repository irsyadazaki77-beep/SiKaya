import { motion } from 'motion/react';

export function StatsSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850/60 transition-colors bg-grid-pattern"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x md:divide-slate-200 dark:md:divide-slate-800">
          <div className="text-center px-2">
            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-1 font-display">50+</div>
            <div className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-widest font-mono">MODUL BELAJAR</div>
          </div>
          <div className="text-center px-2">
            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-1 font-display">125Rb+</div>
            <div className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-widest font-mono">PELAJAR AKTIF</div>
          </div>
          <div className="text-center px-2">
            <div className="text-4xl font-black text-teal-600 dark:text-teal-400 mb-1 font-display">200+</div>
            <div className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-widest font-mono">TOPIK FINANSIAL</div>
          </div>
          <div className="text-center px-2">
            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-1 font-display">100%</div>
            <div className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-widest font-mono">GRATIS DIAKSES</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
