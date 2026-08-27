import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah SiKaya adalah aplikasi trading atau investasi sungguhan?",
      a: "Bukan. SiKaya 100% adalah platform edukasi dan simulasi. Anda tidak dapat menyetorkan uang asli atau membeli aset nyata di sini. Semua data dan grafik ditujukan semata-mata untuk pembelajaran agar Anda terbiasa dengan dinamika pasar sebelum berinvestasi sungguhan."
    },
    {
      q: "Bagaimana cara kerja fitur Simulasi Portofolio?",
      a: "Fitur simulasi memungkinkan Anda belajar menyusun portofolio (seperti saham, obligasi, dan reksa dana) menggunakan 'uang virtual'. Anda dapat melihat bagaimana portofolio imajiner Anda bereaksi terhadap perubahan pasar berdasarkan data historis."
    },
    {
      q: "Apakah seluruh materi edukasi di sini gratis?",
      a: "Ya! Kami berkomitmen penuh untuk meningkatkan literasi keuangan Gen Z di Indonesia. Semua modul dasar manajemen uang, pengantar investasi, hingga alat kalkulator finansial dapat diakses sepenuhnya secara gratis."
    },
    {
      q: "Topik finansial apa saja yang diajarkan di SiKaya?",
      a: "Kami mulai dari dasar: cara mengatur budget bulanan, pentingnya dana darurat, menghindari pinjaman online ilegal, hingga konsep tingkat lanjut seperti bunga majemuk (compound interest), diversifikasi risiko, dan cara membaca laporan keuangan sederhana."
    }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 16 }
    }
  };

  return (
    <motion.section 
      id="faq" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-20 bg-slate-50 dark:bg-slate-950 scroll-mt-24 border-t border-slate-100 dark:border-slate-850/60 transition-colors bg-grid-pattern"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUpVariant} className="text-center mb-14">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 bg-teal-50 dark:bg-slate-900 dark:text-teal-450 px-3 py-1.5 rounded-full inline-block mb-3.5 border border-teal-150 dark:border-teal-900/40 font-mono">
            TANYA JAWAB
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-3 font-display">
            Tentang Edukasi di SiKaya
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm">
            Ketahui lebih lanjut misi kami dalam mencerdaskan Generasi Z Indonesia.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <motion.div 
                key={index} 
                variants={fadeUpVariant}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 pr-4 font-display">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4.5 h-4.5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-teal-650' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-50 dark:border-slate-850/80">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
