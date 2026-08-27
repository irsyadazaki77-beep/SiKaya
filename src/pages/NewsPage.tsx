import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, BrainCircuit, TrendingUp, TrendingDown, Clock, MessageSquare, 
  Search, ShieldAlert, Sparkles, SlidersHorizontal, CheckCircle2, Send, PlayCircle, HelpCircle, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface MarketScenario {
  id: number;
  title: string;
  sentiment: string;
  color: string;
  bgColor: string;
  description: string;
  impacts: { asset: string; value: string; up: boolean }[];
}

export function NewsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'SEMUA' | 'SAHAM' | 'CRYPTO' | 'MAKRO'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [tldrMode, setTldrMode] = useState(false);
  const [activeNewsId, setActiveNewsId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Market Simulator States
  const [activeScenarioId, setActiveScenarioId] = useState<number | null>(null);

  const [newsComments, setNewsComments] = useState<Record<number, { user: string; text: string; time: string; avatar: string }[]>>({
    1: [
      { user: "Wawan Value", text: "BBRI & BBCA emang ga pernah ngecewain sih, nabung terus!", time: "10m lalu", avatar: "🧔" },
      { user: "Scalper Pro", text: "IHSG sideways bosen, mending nunggu breakout bursa.", time: "5m lalu", avatar: "⚡" }
    ],
    2: [
      { user: "HODL Bitcoin", text: "To the moon 🚀 Fed rate cut is coming, siapkan amunisi!", time: "1j lalu", avatar: "🪙" }
    ],
    3: [
      { user: "Ibu Cerdas", text: "Harga bahan pokok naik mulu pusing belanja bulanan.", time: "3j lalu", avatar: "👩" }
    ]
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const newsItems = [
    {
      id: 1,
      title: "IHSG Ditutup Menguat, Sektor Perbankan Jadi Motor Penggerak Utama",
      source: "CNBC Indonesia",
      time: "30 menit lalu",
      sentiment: "positive",
      category: "SAHAM",
      aiSummary: "Sentimen pasar sangat positif didorong oleh laporan keuangan kuartal bank-bank besar yang melebihi ekspektasi analis. Momentum ini diperkirakan bertahan hingga akhir pekan.",
      aiTldr: "⚡ Laba perbankan melonjak tinggi, dorong optimisme IHSG ke zona hijau.",
      impact: [
        { asset: "BBCA", direction: "up", qty: "+2.5%" },
        { asset: "BBRI", direction: "up", qty: "+3.2%" }
      ],
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400&h=250"
    },
    {
      id: 2,
      title: "The Fed Tahan Suku Bunga, Pasar Kripto Merespon Positif",
      source: "Bloomberg",
      time: "2 jam lalu",
      sentiment: "positive",
      category: "CRYPTO",
      aiSummary: "Keputusan bank sentral AS (The Fed) untuk menahan suku bunga acuan memberikan angin segar bagi aset berisiko. Bitcoin melonjak 4% pasca pengumuman.",
      aiTldr: "⚡ Fed pertahankan suku bunga, aset berisiko (Bitcoin) langsung to the moon.",
      impact: [
        { asset: "BTC", direction: "up", qty: "+4.1%" },
        { asset: "GOTO", direction: "up", qty: "+1.5%" }
      ],
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=400&h=250"
    },
    {
      id: 3,
      title: "Inflasi Domestik Naik Tipis, Daya Beli Masyarakat Jadi Sorotan",
      source: "Bisnis.com",
      time: "5 jam lalu",
      sentiment: "negative",
      category: "MAKRO",
      aiSummary: "Kenaikan harga bahan pokok memicu inflasi di luar prediksi. Investor disarankan lebih waspada pada sektor ritel konsumen dalam jangka pendek.",
      aiTldr: "⚠️ Inflasi beras & komoditas menekan sektor ritel konsumen dalam jangka pendek.",
      impact: [
        { asset: "TLKM", direction: "down", qty: "-1.1%" },
        { asset: "GOLD", direction: "up", qty: "+1.8%" }
      ],
      image: "https://images.unsplash.com/photo-1579621970588-a3f5ce599fac?auto=format&fit=crop&q=80&w=400&h=250"
    }
  ];

  // Simulator Data
  const marketScenarios: MarketScenario[] = [
    {
      id: 1,
      title: "🏦 BI Pangkas Suku Bunga Acuan 50 bps",
      sentiment: "HIGHLY BULLISH",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
      bgColor: "bg-emerald-500",
      description: "Suku bunga rendah memicu gairah pinjaman usaha, melipatgandakan likuiditas bursa dan mengalirkan dana asing ke saham serta kripto.",
      impacts: [
        { asset: "BBCA", value: "+4.2%", up: true },
        { asset: "BTC", value: "+8.5%", up: true },
        { asset: "GOTO", value: "+12.1%", up: true },
        { asset: "EMAS", value: "-1.5%", up: false }
      ]
    },
    {
      id: 2,
      title: "🌋 Krisis Finansial: Wall Street Jatuh -8%",
      sentiment: "HIGHLY BEARISH",
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30",
      bgColor: "bg-rose-500",
      description: "Kepanikan hebat melanda pasar global. Investor institusi berbondong-bondong melikuidasi aset berisiko (Kripto, Saham) dan mengungsi ke pelindung Safe Haven (Emas).",
      impacts: [
        { asset: "BBCA", value: "-6.4%", up: false },
        { asset: "BTC", value: "-15.2%", up: false },
        { asset: "GOTO", value: "-22.5%", up: false },
        { asset: "EMAS", value: "+5.8%", up: true }
      ]
    },
    {
      id: 3,
      title: "🪙 Regulasi Pajak Baru Aset Digital Aktif",
      sentiment: "MIXED / SIDEWAYS",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
      bgColor: "bg-amber-500",
      description: "Tambahan tarif pajak membuat spekulan lokal membatasi transaksi bursa harian, volume trading kripto melorot sementara saham perbankan tetap tenang.",
      impacts: [
        { asset: "BTC", value: "-7.8%", up: false },
        { asset: "BBCA", value: "+0.4%", up: true },
        { asset: "GOTO", value: "-1.1%", up: false },
        { asset: "EMAS", value: "+0.1%", up: true }
      ]
    }
  ];

  const addComment = (newsId: number) => {
    if (!commentInput.trim()) return;
    const newCommentObj = {
      user: "Anda (User)",
      text: commentInput.trim(),
      time: "Baru saja",
      avatar: "👤"
    };
    setNewsComments(prev => ({
      ...prev,
      [newsId]: [...(prev[newsId] || []), newCommentObj]
    }));
    setCommentInput('');
  };

  const filteredNews = newsItems.filter(item => {
    const matchesCat = selectedCategory === 'SEMUA' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.aiSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <PageHeader
          category="Komunitas"
          title="Sentimen Pasar & Berita Terupdate"
          description="Eksplorasi berita bursa terkini, analisis pengaruh instan, dan saksikan debat komunitas tentang tren pasar keuangan global."
          badge="AI SUMMARY & IMPACT"
        />

        {/* Dynamic Controls Row */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 w-full md:w-auto">
            {(['SEMUA', 'SAHAM', 'CRYPTO', 'MAKRO'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all cursor-pointer ${selectedCategory === cat ? 'bg-teal-650 text-white shadow-sm shadow-teal-500/10' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & TLDR toggler */}
          <div className="flex gap-3 w-full md:w-auto items-center">
            <div className="relative flex-1 md:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setTldrMode(!tldrMode)}
              className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${tldrMode ? 'bg-indigo-650 text-white shadow-xs shadow-indigo-500/10' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-850'}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> TL;DR Rangkuman
            </button>
          </div>

        </div>

        {/* Sentiment Index Hero Gauge Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-1 shadow-lg shadow-indigo-500/10">
          <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-8 h-8 text-indigo-600 dark:text-indigo-450 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">AI Sentiment Index</span>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">BULLISH MARKET</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 font-display">Suhu Sentimen IDX & Global Hari Ini</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Sektor perbankan dan teknologi nasional menunjukkan daya tahan yang luar biasa. Walaupun inflasi domestik meningkat tipis, sentimen global cenderung menenangkan para investor asing.
              </p>
            </div>
            <div className="shrink-0 text-center px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-150 dark:border-slate-850">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Skor Optimisme</p>
              <p className="text-3xl font-black text-emerald-500 font-mono">78<span className="text-xs text-slate-400">/100</span></p>
            </div>
          </div>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col p-5 space-y-4 animate-pulse"
              >
                <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800/60 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800/60 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800/60 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Feed List */}
            <div className="lg:col-span-8 space-y-6">
              {filteredNews.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                  <ShieldAlert className="w-12 h-12 text-slate-350 mx-auto mb-3" />
                  <p className="font-extrabold text-slate-700 dark:text-slate-300">Tidak ada berita ditemukan</p>
                  <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau kategori Anda.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredNews.map((news) => (
                    <motion.div 
                      key={news.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-all group cursor-pointer"
                      onClick={() => setActiveNewsId(news.id)}
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img 
                          src={news.image} 
                          alt={news.title} 
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-black text-slate-800 dark:text-white flex items-center gap-1 font-mono uppercase">
                          <Clock className="w-3 h-3 text-teal-650" /> {news.time}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col font-sans">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">{news.category} • {news.source}</span>
                          {news.sentiment === 'positive' ? (
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md font-mono">
                              <TrendingUp className="w-3 h-3" /> Bullish
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded-md font-mono">
                              <TrendingDown className="w-3 h-3" /> Bearish
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-extrabold text-slate-950 dark:text-white leading-snug mb-3 text-sm line-clamp-2 font-display group-hover:text-teal-650 transition-colors">
                          {news.title}
                        </h3>
                        
                        <div className="mt-auto bg-slate-50 dark:bg-slate-950/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-850 relative">
                          <div className="absolute -top-3 -left-2 bg-indigo-500 text-white rounded-full p-1 border-2 border-white dark:border-slate-900 shadow-sm">
                            <BrainCircuit className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                            {tldrMode ? news.aiTldr : `"${news.aiSummary}"`}
                          </p>
                        </div>

                        {/* Interactive trigger */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:text-teal-600 transition-colors">
                          <span className="flex items-center gap-1 font-semibold">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> Komentar ({(newsComments[news.id] || []).length})
                          </span>
                          <span className="font-bold">Buka Detail & Sentimen &rarr;</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Detail Panel & Comments Drawer OR Market Simulator if empty */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-6">
              
              {activeNewsId === null ? (
                /* =======================================
                   MARKET REACTION SIMULATOR WIDGET (UPGRADED)
                   ======================================= */
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                        <BrainCircuit className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white font-display">Simulator Reaksi Pasar ⚡</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-450 font-semibold leading-relaxed">
                      Pilih salah satu skenario berita makro di bawah untuk memproyeksikan reaksinya secara spasial terhadap instrumen aset utama!
                    </p>
                  </div>

                  {/* Skenarios Chips Selector */}
                  <div className="space-y-2.5">
                    {marketScenarios.map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setActiveScenarioId(activeScenarioId === sc.id ? null : sc.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all text-xs font-bold cursor-pointer ${activeScenarioId === sc.id ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-md' : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-850 hover:bg-slate-100'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-extrabold truncate pr-2">{sc.title}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md font-mono ${sc.color}`}>
                            {sc.sentiment}
                          </span>
                        </div>
                        <p className={`text-[10px] leading-relaxed font-semibold line-clamp-1 ${activeScenarioId === sc.id ? 'text-slate-300 dark:text-slate-700' : 'text-slate-400'}`}>
                          {sc.description}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Projection details board */}
                  <AnimatePresence mode="wait">
                    {activeScenarioId !== null ? (
                      <motion.div
                        key={activeScenarioId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-4"
                      >
                        {(() => {
                          const sc = marketScenarios.find(s => s.id === activeScenarioId)!;
                          return (
                            <>
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Dampak Skenario</span>
                                <h4 className="font-extrabold text-slate-850 dark:text-white text-xs mt-0.5 mb-1.5">Penjelasan Mekanisme:</h4>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                                  {sc.description}
                                </p>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono block mb-1">Dampak Instan Aset:</span>
                                <div className="grid grid-cols-2 gap-2">
                                  {sc.impacts.map((imp, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center font-mono">
                                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300">{imp.asset}</span>
                                      <span className={`text-[10px] font-black flex items-center ${imp.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {imp.up ? '+' : ''}{imp.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>
                    ) : (
                      <div className="p-8 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center text-slate-450 space-y-1">
                        <SlidersHorizontal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum Ada Skenario Terpilih</h4>
                        <p className="text-[10px] text-slate-450 max-w-xs mx-auto">Ketuk salah satu skenario makro di atas untuk mempelajari bagaimana berita bursa berinteraksi dengan aset investasimu.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* =======================================
                   NEWS DETAILS & COMMENTS AREA
                   ======================================= */
                <div className="space-y-6">
                  {/* Selected News Details */}
                  {(() => {
                    const item = newsItems.find(n => n.id === activeNewsId)!;
                    return (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
                          <span className="text-[9px] font-mono font-black text-indigo-600 dark:text-indigo-400 uppercase">{item.source}</span>
                          <button 
                            type="button"
                            onClick={() => setActiveNewsId(null)}
                            className="text-[9px] font-black text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-md cursor-pointer"
                          >
                            TUTUP
                          </button>
                        </div>
                        
                        <h4 className="font-extrabold text-slate-950 dark:text-white text-sm leading-snug">{item.title}</h4>
                        
                        {/* Portfolio Impact Projections widget */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 animate-pulse" /> Estimasi Dampak Portofolio
                          </p>
                          <div className="space-y-2">
                            {item.impact.map((imp, index) => (
                              <div key={index} className="flex justify-between items-center bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 font-mono">
                                <span className="text-xs font-black text-slate-800 dark:text-slate-200">{imp.asset}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${imp.direction === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                  {imp.direction === 'up' ? '📈 Naik' : '📉 Turun'} {imp.qty}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Comment threads */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> Opini Komunitas
                          </p>
                          
                          <div className="space-y-2.5 max-h-56 overflow-y-auto scrollbar-thin pr-1">
                            {(newsComments[item.id] || []).map((comm, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex gap-2">
                                <span className="text-sm shrink-0">{comm.avatar}</span>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">{comm.user}</span>
                                    <span className="text-[8px] font-bold text-slate-400">{comm.time}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">{comm.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Post Comment form */}
                          <div className="relative pt-2">
                            <input 
                              type="text" 
                              placeholder="Ketik komentar Anda..." 
                              value={commentInput}
                              onChange={e => setCommentInput(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs font-bold focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                            />
                            <button 
                              type="button"
                              onClick={() => addComment(item.id)}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
