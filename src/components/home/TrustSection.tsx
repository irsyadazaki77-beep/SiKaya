import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export function TrustSection() {
  return (
    <section className="py-14 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-6">
          STANDAR KEAMANAN & AKURASI DATA TERBAIK
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 md:gap-16 opacity-75 dark:opacity-85">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs"
          >
            <ShieldCheck className="w-5 h-5 text-teal-600" /> Yahoo Finance API
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Kerangka Literasi Finansial
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs"
          >
            <ShieldCheck className="w-5 h-5 text-purple-600" /> Keamanan SSL 256-Bit
          </motion.div>
        </div>
      </div>
    </section>
  );
}
