import { motion } from 'motion/react';
import { Newspaper, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function MarketNewsSection() {
  const marketNews = [
    {
      title: "IHSG Masih Berpotensi Menguat di Awal Bulan Juli",
      summary: "Indeks Harga Saham Gabungan (IHSG) diproyeksikan masih berada dalam tren positif di tengah arus modal asing yang kembali masuk ke sektor perbankan nasional.",
      source: "CNBC Indonesia",
      time: "2 Jam yang lalu",
      sentiment: "positive",
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
    },
    {
      title: "Investor Asing Catat Net Buy, Saham Bluechip Incaran Utama",
      summary: "Data perdagangan menunjukkan investor asing membukukan aksi beli bersih (net buy) yang signifikan, didorong optimisme pertumbuhan ekonomi kuartal ini.",
      source: "Kontan",
      time: "4 Jam yang lalu",
      sentiment: "positive",
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
    },
    {
      title: "Harga Emas Antam Stagnan, Pasar Menanti Data Inflasi Global",
      summary: "Menjelang rilis data makroekonomi AS, pergerakan harga emas batangan di dalam negeri cenderung konsolidasi dan bergerak mendatar tanpa perubahan ekstrem.",
      source: "Kompas",
      time: "5 Jam yang lalu",
      sentiment: "neutral",
      icon: <Minus className="w-3.5 h-3.5 text-slate-400" />
    },
    {
      title: "Saham Sektor Teknologi Terkoreksi Wajar Setelah Reli Panjang",
      summary: "Sejumlah emiten teknologi mengalami aksi ambil untung (profit taking) setelah mencetak rekor kenaikan beruntun selama dua pekan terakhir.",
      source: "Bisnis Indonesia",
      time: "6 Jam yang lalu",
      sentiment: "negative",
      icon: <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUpVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-650 bg-indigo-50 dark:bg-slate-850 dark:text-indigo-400 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5 border border-indigo-150 dark:border-indigo-900/40 font-mono">
              <Newspaper className="w-3.5 h-3.5" /> INTISARI BERITA
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-display">
              Sentimen Pasar Terkini
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1">
              Kompilasi berita utama dari mesin pencari untuk memandu strategimu hari ini.
            </p>
          </div>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {marketNews.map((news, index) => (
            <motion.div 
              key={index}
              variants={fadeUpVariant}
              whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl flex flex-col transition-colors group cursor-pointer duration-300"
            >
              <div className="flex justify-between items-start mb-4 gap-2">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  news.sentiment === 'positive' ? 'bg-emerald-100 dark:bg-emerald-950/50' : 
                  news.sentiment === 'negative' ? 'bg-rose-100 dark:bg-rose-950/50' : 
                  'bg-slate-200 dark:bg-slate-800'
                }`}>
                  {news.icon}
                </div>
                <div className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right font-mono leading-relaxed">
                  {news.source} <br/> <span className="opacity-75">{news.time}</span>
                </div>
              </div>
              
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 leading-snug mb-3.5 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors font-display">
                {news.title}
              </h3>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-auto">
                {news.summary}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
