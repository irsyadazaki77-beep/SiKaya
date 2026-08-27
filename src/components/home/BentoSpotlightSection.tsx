import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, TrendingUp, Bot, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BentoSpotlightSection() {
  const [activeSpotlight, setActiveSpotlight] = useState<'academy' | 'simulator' | 'aiadvisor'>('academy');

  const bentoTabs = {
    academy: {
      title: 'Kurikulum Finansial Terstruktur',
      desc: 'Pelajari konsep keuangan yang disesuaikan dengan kebutuhan generasi muda secara bertahap dan seru.',
      tag: '01 / SIKAYA ACADEMY',
      color: 'border-teal-400 dark:border-teal-500',
      textColor: 'text-teal-600 dark:text-teal-400',
      points: [
        '50+ modul belajar interaktif mulai dari budgeting hingga reksadana dan saham.',
        'Sistem gamifikasi yang seru: dapatkan XP dan buka lencana pencapaian.',
        'Kuis pemahaman instan di setiap akhir materi dengan reward modal simulasi.'
      ],
      link: '/features',
      btnText: 'Mulai Kelas Sekarang'
    },
    simulator: {
      title: 'Simulator Investasi Multiaset',
      desc: 'Latih insting investasimu menggunakan dana virtual secara real-time di bursa Indonesia & global.',
      tag: '02 / TRADING SIMULATOR',
      color: 'border-indigo-400 dark:border-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      points: [
        'Harga aset riil terintegrasi dengan bursa efek (IDX), pasar AS (Wall Street), dan crypto.',
        'Penerapan order tipe limit, market order, stop loss secara canggih.',
        'Lacak diversifikasi aset, alokasi sektor, dan histori transaksi dalam grafik visual.'
      ],
      link: '/simulasi',
      btnText: 'Masuk Simulator'
    },
    aiadvisor: {
      title: 'Asisten Portofolio Bertenaga AI',
      desc: 'Analisis profil risiko dan rancang portofolio investasi yang optimal menggunakan rekomendasi cerdas dari AI.',
      tag: '03 / AI ADVISOR',
      color: 'border-purple-400 dark:border-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      points: [
        'Analisis instan mengenai arus kas masuk, pengeluaran bulanan, dan tabungan darurat.',
        'Saran diversifikasi alokasi aset yang disesuaikan khusus dengan toleransi risikomu.',
        'Dukungan model Gemini AI yang andal untuk berkonsultasi seputar strategi keuangan.'
      ],
      link: '/advisor',
      btnText: 'Konsultasi AI Gratis'
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 bg-teal-50 dark:bg-slate-850 dark:text-teal-450 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5 border border-teal-150 dark:border-teal-900/40 font-mono">
              <Sparkles className="w-3.5 h-3.5" /> FITUR UNGGULAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-display">
              Satu Platform. Tiga Pilar Cerdas.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1.5">
              SiKaya memadukan edukasi, simulasi, dan kecerdasan buatan untuk mengawal perjalanan investasimu secara komprehensif.
            </p>
          </div>

          <div className="flex gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shrink-0 self-start md:self-end">
            <button
              onClick={() => setActiveSpotlight('academy')}
              className={`p-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeSpotlight === 'academy' ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">Academy</span>
            </button>
            <button
              onClick={() => setActiveSpotlight('simulator')}
              className={`p-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeSpotlight === 'simulator' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <TrendingUp className="w-4 h-4" /> <span className="hidden sm:inline">Simulator</span>
            </button>
            <button
              onClick={() => setActiveSpotlight('aiadvisor')}
              className={`p-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeSpotlight === 'aiadvisor' ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Bot className="w-4 h-4" /> <span className="hidden sm:inline">AI Advisor</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-850 p-6 sm:p-10 rounded-3xl min-h-[420px] flex items-center relative overflow-hidden transition-all duration-500">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-teal-400/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSpotlight}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full grid lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-center"
            >
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${bentoTabs[activeSpotlight].textColor} font-mono`}>
                    {bentoTabs[activeSpotlight].tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2.5 mb-4 font-display">
                    {bentoTabs[activeSpotlight].title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                    {bentoTabs[activeSpotlight].desc}
                  </p>
                </div>

                <div className="space-y-3.5">
                  {bentoTabs[activeSpotlight].points.map((point, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className={`p-1 rounded-md mt-0.5 shrink-0 ${
                        activeSpotlight === 'academy' ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400' :
                        activeSpotlight === 'simulator' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' :
                        'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link 
                    to={bentoTabs[activeSpotlight].link}
                    className={`inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black text-white hover:shadow-lg transition-all active:scale-95 cursor-pointer ${
                      activeSpotlight === 'academy' ? 'bg-teal-600 hover:bg-teal-500' :
                      activeSpotlight === 'simulator' ? 'bg-indigo-600 hover:bg-indigo-500' :
                      'bg-purple-600 hover:bg-purple-500'
                    }`}
                  >
                    {bentoTabs[activeSpotlight].btnText} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Bento Right Panel: Decorative Layout */}
              <div className="lg:col-span-6 flex justify-center items-center h-full">
                {activeSpotlight === 'academy' && (
                  <div className="relative w-full max-w-[400px] h-64 bg-teal-500/10 dark:bg-teal-500/5 rounded-3xl border border-teal-400/20 flex flex-col justify-center items-center p-8 text-center gap-4 animate-float">
                    <div className="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 font-display">Kurikulum Level 1 s.d 4</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 leading-relaxed">Dilengkapi studi kasus unik generasi milenial, modul budgeting, asuransi, hingga reksadana.</p>
                    </div>
                  </div>
                )}
                {activeSpotlight === 'simulator' && (
                  <div className="relative w-full max-w-[400px] h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-3xl border border-indigo-400/20 flex flex-col justify-center items-center p-8 text-center gap-4 animate-float" style={{ animationDelay: "1s" }}>
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 font-display">Harga Pasar Live (Yahoo Finance)</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 leading-relaxed">Kelola portofolio tanpa risiko finansial dengan modal virtual Rp 100 Juta dan saldo USD $10,000.</p>
                    </div>
                  </div>
                )}
                {activeSpotlight === 'aiadvisor' && (
                  <div className="relative w-full max-w-[400px] h-64 bg-purple-500/10 dark:bg-purple-500/5 rounded-3xl border border-purple-400/20 flex flex-col justify-center items-center p-8 text-center gap-4 animate-float" style={{ animationDelay: "1.5s" }}>
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 font-display">Rekomendasi Cerdas Gemini AI</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 leading-relaxed">Dapatkan analisis menyeluruh terhadap cash flow, profil risiko, dan diversifikasi aset yang tepat.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
