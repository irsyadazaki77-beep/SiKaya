import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function CtaBannerSection() {
  const scaleUpVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 40, damping: 15 }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={scaleUpVariant}
      className="bg-teal-950 py-20 relative overflow-hidden bg-dot-pattern"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-900 to-indigo-950 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 opacity-90"></div>
      
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight font-display">
          Saatnya Ambil Kendali Keuanganmu
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-teal-100/90 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
          Bergabung dengan ratusan ribu pemuda Indonesia lainnya. Pelajari ilmu finansial yang tidak diajarkan di bangku sekolah konvensional secara gratis & interaktif.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="px-8 py-4.5 text-sm font-bold text-teal-950 bg-white hover:bg-slate-50 active:scale-95 rounded-2xl transition-all shadow-xl inline-flex items-center justify-center cursor-pointer hover:-translate-y-0.5 duration-200">
            Buat Akun Pelajar Gratis
          </Link>
          <Link to="/features" className="px-8 py-4.5 text-sm font-bold text-white border border-teal-700/60 hover:bg-teal-800/40 active:scale-95 rounded-2xl transition-all inline-flex items-center justify-center cursor-pointer hover:-translate-y-0.5 duration-200">
            Jelajahi Kurikulum
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
