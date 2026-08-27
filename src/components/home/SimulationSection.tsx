import { useState } from 'react';
import { motion } from 'motion/react';
import { PerformanceChart } from '../PerformanceChart';
import { InvestmentCalculator } from '../InvestmentCalculator';

export function SimulationSection() {
  const [period, setPeriod] = useState<'1W' | '1M' | '1Y' | 'ALL'>('1Y');

  const periodMeta = {
    '1W': { value: 'Rp 1.005.000', change: '+Rp 5.000 (▲ 0.5%)', text: 'simulasi 1 minggu' },
    '1M': { value: 'Rp 1.036.000', change: '+Rp 36.000 (▲ 3.6%)', text: 'simulasi 1 bulan' },
    '1Y': { value: 'Rp 1.120.000', change: '+Rp 120.000 (▲ 12.0%)', text: 'simulasi 1 tahun' },
    'ALL': { value: 'Rp 1.450.000', change: '+Rp 450.000 (▲ 45.0%)', text: 'pertumbuhan total' },
  };

  return (
    <section id="simulasi" className="pb-16 pt-8 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider font-mono">Simulasi Aset Masa Depan</p>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-display">
                    {periodMeta[period].value}
                  </h3>
                  <div className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="inline-block py-0.5 px-1.5 bg-emerald-50 dark:bg-emerald-950/50 rounded text-[9px] font-black uppercase tracking-wider border border-emerald-100/40 dark:border-emerald-900/30">ILUSTRASI</span>
                    <span>{periodMeta[period].change}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-normal">{periodMeta[period].text}</span>
                  </div>
                </div>

                <div className="flex gap-1 bg-slate-50 dark:bg-slate-850 p-1.5 rounded-2xl self-start sm:self-center border border-slate-100 dark:border-slate-800">
                  {(['1W', '1M', '1Y', 'ALL'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        period === p
                          ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-md'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 pt-6 h-64">
                <PerformanceChart period={period} />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/40 hover:-translate-y-1 hover:shadow-md transition-all">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block mb-1 uppercase tracking-wider">Kas / Uang Tunai</span>
                <p className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">45.2%</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/40 hover:-translate-y-1 hover:shadow-md transition-all">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block mb-1 uppercase tracking-wider">Emas Digital</span>
                <p className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">30.8%</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/40 hover:-translate-y-1 hover:shadow-md transition-all">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block mb-1 uppercase tracking-wider">Indeks Saham</span>
                <p className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">24.0%</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-[380px] shrink-0">
            <InvestmentCalculator />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
