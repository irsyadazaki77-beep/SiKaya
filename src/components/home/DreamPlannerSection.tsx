import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Target, DollarSign, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DreamPlannerSection() {
  const [goalPreset, setGoalPreset] = useState<'gadget' | 'travel' | 'concert' | 'education' | 'investment'>('gadget');
  const [customGoalName, setCustomGoalName] = useState('Beli iPhone Baru');
  const [goalAmount, setGoalAmount] = useState<number>(15000000);
  const [goalMonths, setGoalMonths] = useState<number>(12);

  const goalPresets = {
    gadget: { name: 'Beli iPhone / Laptop', amount: 15000000, color: 'from-purple-500 to-indigo-600' },
    travel: { name: 'Liburan ala Backpacker', amount: 8000000, color: 'from-teal-500 to-emerald-600' },
    concert: { name: 'Tiket Konser Musik', amount: 4500000, color: 'from-pink-500 to-rose-600' },
    education: { name: 'Dana Kursus & Sertifikasi', amount: 6000000, color: 'from-amber-500 to-orange-600' },
    investment: { name: 'Modal Investasi Pertama', amount: 10000000, color: 'from-blue-500 to-cyan-600' }
  };

  const selectPreset = (key: 'gadget' | 'travel' | 'concert' | 'education' | 'investment') => {
    setGoalPreset(key);
    setCustomGoalName(goalPresets[key].name);
    setGoalAmount(goalPresets[key].amount);
  };

  const monthlySavingsNeeded = Math.round(goalAmount / goalMonths);
  const monthlyRate = 0.08 / 12;
  const investingNeeded = Math.round(
    (goalAmount * monthlyRate) / (Math.pow(1 + monthlyRate, goalMonths) - 1)
  );
  const totalWithInvestment = investingNeeded * goalMonths;
  const moneySaved = (monthlySavingsNeeded * goalMonths) - totalWithInvestment;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold mb-4 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
            <Zap className="w-4 h-4 text-indigo-500 animate-bounce" /> WIDGET INTERAKTIF
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-4 font-display">
            Gen Z <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">Dream Planner</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm">
            Tentukan target impianmu, atur waktunya, dan lihat perbedaan mencolok menabung biasa vs diinvestasikan secara pintar.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid md:grid-cols-12 transition-all">
          {/* Planner Left Panel: Inputs */}
          <div className="p-6 sm:p-8 md:col-span-7 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Pilih Kategori Impianmu</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(goalPresets) as Array<keyof typeof goalPresets>).map((key) => {
                  const isSelected = goalPreset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectPreset(key)}
                      className={`px-3 py-2.5 text-xs font-bold rounded-xl transition-all text-left border relative overflow-hidden cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm' 
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {key === 'gadget' && '📱 Gadget'}
                      {key === 'travel' && '✈️ Liburan'}
                      {key === 'concert' && '🎸 Konser'}
                      {key === 'education' && '🎓 Edukasi'}
                      {key === 'investment' && '💼 Investasi'}
                      
                      {isSelected && (
                        <motion.div 
                          layoutId="presetSelection"
                          className="absolute inset-0 bg-white/10 dark:bg-slate-900/10 pointer-events-none"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Target className="w-4 h-4 text-teal-600" /> Nama Impianmu
                  </label>
                </div>
                <input
                  type="text"
                  value={customGoalName}
                  onChange={(e) => setCustomGoalName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  placeholder="Contoh: Liburan ke Jepang"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-teal-600" /> Perkiraan Biaya (Rp)
                  </label>
                  <span className="text-xs font-extrabold text-indigo-650 dark:text-indigo-400 font-mono">
                    Rp {goalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="100000000"
                  step="500000"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(Number(e.target.value))}
                  className="w-full accent-teal-600 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                  <span>1 Juta</span>
                  <span>50 Juta</span>
                  <span>100 Juta</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-teal-600" /> Target Waktu (Bulan)
                  </label>
                  <span className="text-xs font-extrabold text-teal-650 dark:text-teal-400 font-mono">
                    {goalMonths} Bulan ({ (goalMonths/12).toFixed(1) } Tahun)
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  step="1"
                  value={goalMonths}
                  onChange={(e) => setGoalMonths(Number(e.target.value))}
                  className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                  <span>3 Bulan</span>
                  <span>1 Tahun</span>
                  <span>3 Tahun</span>
                  <span>5 Tahun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Planner Right Panel: Projections & Advice */}
          <div className="p-6 sm:p-8 md:col-span-5 bg-slate-900 dark:bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden">
            
            <div className="space-y-6 relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded">Proyeksi Rencana</span>
                <h4 className="text-xl font-bold mt-3 leading-snug font-display">{customGoalName || 'Impianmu'}</h4>
              </div>
 
              <div className="space-y-5">
                <div className="border-l-2 border-slate-700 pl-4 py-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1 block">Cara 1: Tabungan Biasa (0% Bunga)</p>
                  <p className="text-lg font-bold">Rp {monthlySavingsNeeded.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">/ bln</span></p>
                </div>
 
                <div className="border-l-2 border-teal-500 pl-4 py-1">
                  <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-widest mb-1 block">Cara 2: Investasi Pintar (~8% CAGR)</p>
                  <p className="text-lg font-bold text-teal-400">Rp {investingNeeded.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">/ bln</span></p>
                </div>
              </div>
 
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={moneySaved}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2"
              >
                <p className="text-[10px] font-bold text-teal-400 flex items-center gap-1.5 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Sikaya Smart Tip
                </p>
                <p className="text-sm font-medium leading-relaxed text-slate-300">
                  Dengan berinvestasi secara disiplin, kamu menghemat sekitar <span className="text-teal-400 font-bold">Rp {moneySaved.toLocaleString('id-ID')}</span> karena uangmu bertumbuh secara otomatis!
                </p>
              </motion.div>
            </div>
 
            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-0.5">Pelajari Caranya di</p>
                <p className="text-sm font-bold text-teal-400">Kelas Classroom</p>
              </div>
              <Link to="/belajar" className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl transition-colors font-semibold text-sm flex items-center gap-1.5">
                Mulai Belajar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
