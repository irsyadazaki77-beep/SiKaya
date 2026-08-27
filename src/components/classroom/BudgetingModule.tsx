import { useState } from 'react';
import { BookOpen, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User } from '../../context/AuthContext';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function BudgetingModule({ user, onComplete, completed }: ModuleProps) {
  const pocketMoney = 3000000;
  const [needsPercent, setNeedsPercent] = useState(50);
  const [wantsPercent, setWantsPercent] = useState(30);
  const [savingsPercent, setSavingsPercent] = useState(20);

  // Synchronize percentages to equal 100%
  const handleBudgetChange = (type: 'needs' | 'wants' | 'savings', value: number) => {
    if (type === 'needs') {
      setNeedsPercent(value);
      const remaining = 100 - value;
      setWantsPercent(Math.round(remaining * 0.6));
      setSavingsPercent(100 - value - Math.round(remaining * 0.6));
    } else if (type === 'wants') {
      setWantsPercent(value);
      const remaining = 100 - value;
      setNeedsPercent(Math.round(remaining * 0.7));
      setSavingsPercent(100 - value - Math.round(remaining * 0.7));
    } else {
      setSavingsPercent(value);
      const remaining = 100 - value;
      setNeedsPercent(Math.round(remaining * 0.7));
      setWantsPercent(100 - value - Math.round(remaining * 0.7));
    }
  };

  const needsAmount = (pocketMoney * needsPercent) / 100;
  const wantsAmount = (pocketMoney * wantsPercent) / 100;
  const savingsAmount = (pocketMoney * savingsPercent) / 100;

  let budgetFeedback = {
    status: 'good',
    message: 'Alokasi kamu luar biasa seimbang! Kamu siap kaya raya di masa depan! 🚀',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-350 dark:border-emerald-900/40'
  };

  if (wantsPercent > 40) {
    budgetFeedback = {
      status: 'danger',
      message: 'Waduh! Jajan kopi & gaya hidup kebanyakan (lebih dari 40%). Akhir bulan terancam makan mi instan 🍜. Kurangi wants kamu!',
      color: 'text-rose-700 bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:text-rose-350 dark:border-rose-900/40'
    };
  } else if (savingsPercent < 15) {
    budgetFeedback = {
      status: 'warning',
      message: 'Tabungan kamu tipis banget (kurang dari 15%). Usahakan menyisihkan minimal 20% untuk masa depanmu ya! 🪙',
      color: 'text-amber-700 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:text-amber-350 dark:border-amber-900/40'
    };
  } else if (needsPercent > 60) {
    budgetFeedback = {
      status: 'warning',
      message: 'Biaya kebutuhan primer kamu terlalu besar. Coba cari kosan atau pengeluaran makan yang lebih efisien agar bisa lebih banyak menabung! 🏡',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-350 dark:border-indigo-900/40'
    };
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-[10px] font-black uppercase dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900">
            Praktek Budgeting
          </span>
          {completed && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              ✓ Selesai (+100 XP)
            </span>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Aturan Keuangan 50/30/20 (Panduan Fleksibel)
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
          Banyak Gen Z terjebak bokek di akhir bulan karena tidak punya sistem budgeting yang disiplin. Rumus legendaris <strong>50/30/20</strong> membagi uang sakumu menjadi tiga pos sederhana. 
          <span className="text-teal-600 font-bold"> Ingat:</span> Ini adalah panduan umum, bukan hukum mati! Jika pendapatanmu saat ini masih terbatas, sangat wajar jika pos <em>Needs</em> memakan porsi 70-80% anggaranmu. Yang terpenting adalah kedisiplinan belajar mencatat pengeluaran secara jujur!
        </p>
      </div>

      {/* Educational Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-400 mb-1">Needs (Kebutuhan Primer)</div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">50%</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed">Sewa kamar, makan pokok, kuota internet esensial, transport kuliah/kerja.</p>
        </div>
        <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-400 mb-1">Wants (Gaya Hidup)</div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">30%</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed">Nongkrong di coffee shop, bioskop, langganan streaming, liburan santai.</p>
        </div>
        <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-400 mb-1">Savings (Tabungan & Investasi)</div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">20%</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed">Dana darurat, tabungan emas, reksa dana pasar uang, cicilan masa depan.</p>
        </div>
      </div>

      {/* Interactive Budget Calculator */}
      <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800 p-5 sm:p-6 rounded-2xl space-y-6">
        <div>
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">Sandbox Simulasi Uang Bulanan</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Anda diasumsikan mendapat uang saku/gaji magang sebesar <strong>Rp 3.000.000 / bulan</strong>. Coba geser alokasi pilihanmu!</p>
        </div>

        {/* Quick Budget Presets */}
        <div className="flex gap-2 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-850">
          <span className="text-[10px] text-slate-400 font-bold block w-full">Gunakan Preset Cepat:</span>
          <button
            type="button"
            onClick={() => { setNeedsPercent(50); setWantsPercent(30); setSavingsPercent(20); }}
            className="px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-[10px] font-black text-teal-800 hover:bg-teal-100 dark:bg-teal-950/30 dark:border-teal-900/50 dark:text-teal-400 transition-colors cursor-pointer"
          >
            Ideal (50/30/20)
          </button>
          <button
            type="button"
            onClick={() => { setNeedsPercent(40); setWantsPercent(15); setSavingsPercent(45); }}
            className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400 transition-colors cursor-pointer"
          >
            Super Hemat (40/15/45)
          </button>
          <button
            type="button"
            onClick={() => { setNeedsPercent(60); setWantsPercent(35); setSavingsPercent(5); }}
            className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-[10px] font-black text-rose-800 hover:bg-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 transition-colors cursor-pointer"
          >
            Konsumtif (60/35/5)
          </button>
        </div>

        {/* Range Sliders */}
        <div className="space-y-4">
          {/* Needs */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">Needs (Kebutuhan): {needsPercent}%</span>
              <span className="text-slate-800 dark:text-white">Rp {needsAmount.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={needsPercent}
              onChange={(e) => handleBudgetChange('needs', parseInt(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Wants */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">Wants (Gaya Hidup): {wantsPercent}%</span>
              <span className="text-slate-800 dark:text-white">Rp {wantsAmount.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              value={wantsPercent}
              onChange={(e) => handleBudgetChange('wants', parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Savings */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">Savings (Tabungan & Investasi): {savingsPercent}%</span>
              <span className="text-slate-800 dark:text-white">Rp {savingsAmount.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={savingsPercent}
              onChange={(e) => handleBudgetChange('savings', parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Budget feedback container */}
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-start gap-2.5 transition-all ${budgetFeedback.color}`}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="leading-relaxed">{budgetFeedback.message}</p>
        </div>
      </div>

      {/* Source attribution */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/80 rounded-xl mt-6 mb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3 h-3" /> Sumber Referensi Materi
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
          <p>• <strong>All Your Worth: The Ultimate Lifetime Money Plan</strong> (Elizabeth Warren, 2005) - Penggagas aturan finansial 50/30/20.</p>
        </div>
      </div>

      {/* Complete Module Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onComplete('budgeting')}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-teal-600/15 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {completed ? 'Simpan & Lanjut Modul 2' : 'Selesaikan Modul & Ambil +100 XP'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
