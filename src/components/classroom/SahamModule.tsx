import { useState } from 'react';
import { BookOpen, HelpCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { User } from '../../context/AuthContext';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

interface Stock {
  ticker: string;
  name: string;
  pe: number; // Price to Earnings Ratio
  dy: number; // Dividend Yield
  roe: number; // Return on Equity
  der: number; // Debt to Equity Ratio
  category: string;
  explanation: string;
}

export function SahamModule({ user, onComplete, completed }: ModuleProps) {
  const [selectedStock, setSelectedStock] = useState<string>('BCRA');
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const mockStocks: { [key: string]: Stock } = {
    BCRA: {
      ticker: 'BCRA',
      name: 'PT Bank Central Rakyat Asia Tbk',
      pe: 22.5,
      dy: 2.8,
      roe: 19.5,
      der: 0.8,
      category: '💎 Blue-Chip Kuat (Saham Defensif)',
      explanation: 'BCRA menunjukkan fundamental yang sangat kokoh. ROE tinggi (19.5%) mengindikasikan perusahaan sangat efisien menghasilkan laba bersih bagi pemegang saham. Rasio utang (DER 0.8) terkelola sangat aman di bawah standar batas umum perbankan. Saham seperti ini ideal untuk tabungan jangka panjang.'
    },
    TLKM: {
      ticker: 'TLNT',
      name: 'PT Telekomunikasi Nusantara Tbk',
      pe: 14.1,
      dy: 5.2,
      roe: 16.0,
      der: 1.2,
      category: '💰 Dividend Play (Bagi Hasil Besar)',
      explanation: 'TLNT menawarkan Dividend Yield yang tinggi (5.2%), jauh di atas bunga deposito biasa. Rasio P/E (14.1x) berada dalam rentang wajar (underpriced/fairly priced). Sangat cocok untuk investor pasif yang menyukai pembagian dividen tunai rutin setiap tahunnya.'
    },
    HYPS: {
      ticker: 'GOTOX',
      name: 'PT Startup Bakar Duit Teknologi Tbk',
      pe: -154.0,
      dy: 0.0,
      roe: -35.0,
      der: 3.5,
      category: '⚠️ Saham Spekulatif / Hype Startup',
      explanation: 'GOTOX masih merugi (P/E negatif dan ROE negatif -35%), tidak membagikan dividen, dan rasio utang (DER 3.5) sangat mengkhawatirkan karena melebihi kapasitas modal perusahaan. Berinvestasi di saham ini sangat tinggi risiko dan mirip berspekulasi. Pemula sangat disarankan menghindari jenis saham ini!'
    }
  };

  const activeStock = mockStocks[selectedStock];

  const questions = [
    {
      id: 1,
      q: 'Apa arti dari Price to Earnings (P/E) Ratio yang terlalu tinggi secara tidak wajar (misal P/E > 150x) bagi investor saham pemula?',
      options: [
        { text: 'A. Perusahaan tersebut sangat murah dan pasti menguntungkan.', isCorrect: false },
        { text: 'B. Saham tersebut sudah sangat mahal (Overvalued) dibandingkan laba bersih yang dihasilkannya, sehingga tinggi risiko koreksi.', isCorrect: true },
        { text: 'C. Saham tersebut pasti membagikan dividen tunai besok pagi.', isCorrect: false }
      ],
      explanation: 'P/E Ratio membandingkan harga saham dengan laba per lembar saham. P/E yang sangat tinggi mengindikasikan harga saham sudah terlampau mahal ("priced to perfection") dan rawan koreksi hebat jika ekspektasi laba tidak tercapai.'
    },
    {
      id: 2,
      q: 'Bagaimana cara terbaik meminimalkan risiko fluktuasi harga saham bagi seorang investor jangka panjang?',
      options: [
        { text: 'A. Melakukan "Dollar Cost Averaging" (DCA) secara konsisten di saham blue-chip berfundamental kuat, bukan membeli seluruhnya di satu waktu.', isCorrect: true },
        { text: 'B. Membeli saham yang sedang viral di TikTok menggunakan uang dingin hasil meminjam dari kerabat.', isCorrect: false },
        { text: 'C. Melakukan "All-In" modal pada saham gorengan dengan volatilitas harian tinggi.', isCorrect: false }
      ],
      explanation: 'DCA (mencicil investasi rutin secara berkala) merata-ratakan harga perolehan sahammu, menghindarkanmu dari kepanikan menebak arah pasar (Market Timing).'
    }
  ];

  const handleSelectOption = (qId: number, optIndex: number) => {
    if (quizChecked) return;
    setQuizAnswers({ ...quizAnswers, [qId]: optIndex });
  };

  const handleCheckQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.options.findIndex(o => o.isCorrect)) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizChecked(true);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-[10px] font-black uppercase dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
            Modul 8 • Saham Fundamental
          </span>
          {completed && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              ✓ Selesai (+100 XP)
            </span>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Dasar Analisis Saham Pemula (Membongkar Laporan Keuangan)
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
          Membeli saham bukanlah berjudi menebak warna hijau atau merah di layar ponsel. Membeli saham berarti kamu membeli porsi kepemilikan bisnis riil yang memiliki aset, utang, dan laba operasional. Mari pelajari parameter dasar analisis fundamental agar terhindar dari pom-pom saham sampah!
        </p>
      </div>

      {/* Interactive Stock Analyzer */}
      <div className="bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Mini Fundamental Stock Analyzer
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Klik emiten saham di bawah untuk menganalisis rasio kesehatannya:</p>
          </div>

          <div className="flex gap-1.5">
            {Object.keys(mockStocks).map((ticker) => (
              <button
                key={ticker}
                onClick={() => setSelectedStock(ticker)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all border ${
                  selectedStock === ticker
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                }`}
              >
                {ticker}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Stock Metrics Screen */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-4 rounded-xl space-y-4 shadow-2xs">
          <div className="flex justify-between items-start border-b dark:border-slate-850 pb-2.5">
            <div>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 rounded uppercase">{activeStock.ticker}</span>
              <h5 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 mt-1">{activeStock.name}</h5>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-1 rounded">
              {activeStock.category}
            </span>
          </div>

          {/* Grid Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg">
              <p className="text-[9px] font-bold text-slate-400 uppercase">P/E Ratio (Harga/Laba)</p>
              <p className={`text-base font-black ${activeStock.pe < 0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'}`}>{activeStock.pe}x</p>
              <p className="text-[8px] text-slate-400">Rekomendasi umum: &lt; 20x</p>
            </div>
            <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Dividend Yield (Bagi Hasil)</p>
              <p className="text-base font-black text-emerald-600">{activeStock.dy}%</p>
              <p className="text-[8px] text-slate-400">Deposito Bank biasa: ~2-3%</p>
            </div>
            <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg">
              <p className="text-[9px] font-bold text-slate-400 uppercase">ROE (Efisiensi Modal)</p>
              <p className={`text-base font-black ${activeStock.roe < 0 ? 'text-rose-500' : 'text-slate-850 dark:text-slate-100'}`}>{activeStock.roe}%</p>
              <p className="text-[8px] text-slate-400">Rekomendasi umum: &gt; 10%</p>
            </div>
            <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg">
              <p className="text-[9px] font-bold text-slate-400 uppercase">DER (Rasio Utang)</p>
              <p className={`text-base font-black ${activeStock.der > 2 ? 'text-rose-500' : 'text-slate-850 dark:text-slate-100'}`}>{activeStock.der}x</p>
              <p className="text-[8px] text-slate-400">Rekomendasi umum: &lt; 1.5x</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/30 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-450 leading-relaxed font-medium">
            <strong>Analisis Diagnostik SiKaya:</strong> {activeStock.explanation}
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> Evaluasi Kompetensi Pasar Saham
        </h4>

        {questions.map((q, qIdx) => {
          const selectedIdx = quizAnswers[q.id];
          return (
            <div key={q.id} className="p-4 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/20 space-y-3">
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-250">{qIdx + 1}. {q.q}</p>
              <div className="grid gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedIdx === oIdx;
                  let style = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                  if (isSelected) {
                    if (quizChecked) {
                      style = opt.isCorrect 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-850 dark:bg-emerald-950/25 dark:border-emerald-700 dark:text-emerald-300 font-bold' 
                        : 'bg-rose-50 border-rose-400 text-rose-850 dark:bg-rose-950/25 dark:border-rose-700 dark:text-rose-300 font-bold';
                    } else {
                      style = 'bg-teal-50 border-teal-500 text-teal-850 dark:bg-teal-950/25 dark:border-teal-700 dark:text-teal-300 font-bold';
                    }
                  } else if (quizChecked && opt.isCorrect) {
                    style = 'bg-emerald-50 border-emerald-500 text-emerald-850 dark:bg-emerald-950/10 dark:border-emerald-800 dark:text-emerald-350';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`p-3 text-left text-xs rounded-xl border transition-all cursor-pointer ${style}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {quizChecked && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border dark:border-slate-800">
                  <strong>Penjelasan:</strong> {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Sources list */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/80 rounded-xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
          <BookOpen className="w-3 h-3" /> Referensi Terpercaya
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
          <p>• <strong>Bursa Efek Indonesia (BEI) / Indonesia Stock Exchange (IDX)</strong> - Kurikulum Sekolah Pasar Modal tingkat Fundamental.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
        {quizChecked ? (
          <span className="text-xs font-bold text-slate-500">Skor: {quizScore} / {questions.length} Benar!</span>
        ) : (
          <button
            onClick={handleCheckQuiz}
            disabled={Object.keys(quizAnswers).length < questions.length}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            Periksa Jawaban
          </button>
        )}

        <button
          onClick={() => onComplete('saham')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
        >
          {completed ? 'Lanjut ke Modul 9' : 'Selesaikan & Klaim +100 XP'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
