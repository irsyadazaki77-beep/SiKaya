import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { User } from '../../types/user';
import { ClassroomModuleLayout } from './ClassroomModuleLayout';
import { QuizSection } from './QuizSection';
import { SAHAM_QUESTIONS } from '../../data/classroom/moduleQuestions';

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

export function SahamModule({ onComplete, completed }: ModuleProps) {
  const [selectedStock, setSelectedStock] = useState<string>('BCRA');

  const mockStocks: Record<string, Stock> = {
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
      explanation: 'TLNT menawarkan Dividend Yield yang tinggi (5.2%), jauh di atas bunga deposito biasa. Rasio P/E (14.1x) berada dalam rentang wajar. Sangat cocok untuk investor pasif yang menyukai pembagian dividen tunai rutin setiap tahunnya.'
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

  return (
    <ClassroomModuleLayout
      category="Modul 8 • Saham Fundamental"
      title="Dasar Analisis Saham Pemula (Membongkar Laporan Keuangan)"
      description="Membeli saham bukanlah berjudi menebak warna hijau atau merah di layar ponsel. Membeli saham berarti kamu membeli porsi kepemilikan bisnis riil yang memiliki aset, utang, dan laba operasional. Pelajari parameter dasar analisis fundamental agar terhindar dari pom-pom saham sampah!"
      completed={completed}
    >
      {/* Interactive Stock Analyzer */}
      <div className="bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Mini Fundamental Stock Analyzer
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Klik emiten saham di bawah untuk menganalisis rasio kesehatannya:
            </p>
          </div>

          <div className="flex gap-1.5">
            {Object.keys(mockStocks).map((ticker) => (
              <button
                key={ticker}
                type="button"
                onClick={() => setSelectedStock(ticker)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all border ${
                  selectedStock === ticker
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-teal-600 dark:border-teal-600'
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
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 rounded uppercase">
                {activeStock.ticker}
              </span>
              <h5 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 mt-1">
                {activeStock.name}
              </h5>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-1 rounded">
              {activeStock.category}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-[9px] text-slate-400 font-bold block">P/E Ratio</span>
              <span className={`text-xs sm:text-sm font-black ${activeStock.pe < 0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                {activeStock.pe}x
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-[9px] text-slate-400 font-bold block">Dividend Yield</span>
              <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                {activeStock.dy}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-[9px] text-slate-400 font-bold block">ROE (Laba Modal)</span>
              <span className={`text-xs sm:text-sm font-black ${activeStock.roe < 0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                {activeStock.roe}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-[9px] text-slate-400 font-bold block">DER (Rasio Utang)</span>
              <span className={`text-xs sm:text-sm font-black ${activeStock.der > 2 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                {activeStock.der}x
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/20 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            {activeStock.explanation}
          </p>
        </div>
      </div>

      {/* Quiz Section */}
      <QuizSection
        moduleId="saham"
        questions={SAHAM_QUESTIONS}
        completed={completed}
        onComplete={onComplete}
      />
    </ClassroomModuleLayout>
  );
}
