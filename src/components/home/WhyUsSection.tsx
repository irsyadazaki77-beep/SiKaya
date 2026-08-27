import { motion } from 'motion/react';
import { Heart, Award, Shield } from 'lucide-react';

export function WhyUsSection() {
  const values = [
    {
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      title: 'Edukasi Tanpa Syarat',
      desc: '100% materi edukasi SiKaya gratis dan dapat diakses oleh semua kalangan pemuda tanpa biaya bulanan.'
    },
    {
      icon: <Award className="w-6 h-6 text-amber-500" />,
      title: 'Pendekatan Gamifikasi',
      desc: 'Kami mendesain modul edukasi interaktif layaknya bermain game agar belajar finansial terasa menyenangkan.'
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      title: 'Aman Tanpa Risiko',
      desc: 'Simulator kami didesain khusus agar kamu bebas bereksperimen, membuat kesalahan, dan belajar tanpa takut rugi.'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-display">
            Mengapa Belajar di SiKaya?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1.5">
            Kami berkomitmen memberikan pengalaman belajar literasi finansial terbaik, aman, dan tanpa biaya sepeser pun.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-250/50 dark:border-slate-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 mb-6 shrink-0 border border-slate-100 dark:border-slate-800">
                {v.icon}
              </div>
              <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100 mb-3 font-display">
                {v.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
