import React, { useState } from 'react';
import { User } from '../../types/user';
import { ClassroomModuleLayout } from './ClassroomModuleLayout';
import { QuizSection } from './QuizSection';
import { BUDGETING_QUESTIONS } from '../../data/classroom/moduleQuestions';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function BudgetingModule({ onComplete, completed }: ModuleProps) {
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
    message: 'Alokasi kamu luar biasa seimbang! Kamu siap membangun pondasi finansial kokoh! 🚀',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-350 dark:border-emerald-900/40'
  };

  if (wantsPercent > 40) {
    budgetFeedback = {
      message: 'Waduh! Jajan kopi & gaya hidup kebanyakan (lebih dari 40%). Akhir bulan terancam boncos. Kurangi porsi wants kamu!',
      color: 'text-rose-700 bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:text-rose-350 dark:border-rose-900/40'
    };
  } else if (savingsPercent < 15) {
    budgetFeedback = {
      message: 'Tabungan kamu tipis banget (kurang dari 15%). Usahakan menyisihkan minimal 20% untuk masa depanmu ya! 🪙',
      color: 'text-amber-700 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:text-amber-350 dark:border-amber-900/40'
    };
  } else if (needsPercent > 60) {
    budgetFeedback = {
      message: 'Biaya kebutuhan primer kamu terlalu besar. Coba cari pengeluaran makan atau kos yang lebih efisien agar bisa menabung lebih banyak! 🏡',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-350 dark:border-indigo-900/40'
    };
  }

  return (
    <ClassroomModuleLayout
      category="Praktek Budgeting"
      title="Aturan Keuangan 50/30/20 (Panduan Fleksibel)"
      description="Banyak Gen Z terjebak bokek di akhir bulan karena tidak punya sistem budgeting yang disiplin. Rumus 50/30/20 membagi uang sakumu menjadi tiga pos sederhana: Kebutuhan Pokok (50%), Keinginan (30%), dan Tabungan/Investasi (20%)."
      completed={completed}
    >
      {/* Educational Pillars */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-400 mb-1">Needs (Kebutuhan Primer)</div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">50%</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
            Sewa kamar, makan pokok, kuota internet esensial, transport harian.
          </p>
        </div>
        <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-400 mb-1">Wants (Gaya Hidup)</div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">30%</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
            Nongkrong coffee shop, bioskop, langganan streaming, liburan santai.
          </p>
        </div>
        <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-400 mb-1">Savings (Tabungan/Investasi)</div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">20%</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
            Dana darurat, reksa dana pasar uang, tabungan masa depan.
          </p>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
          Simulator Alokasi Uang Saku (Simulasi Rp 3.000.000 / Bulan)
        </h4>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Needs (Kebutuhan): {needsPercent}%</span>
              <span className="text-teal-600 dark:text-teal-400 font-black">Rp {needsAmount.toLocaleString('id-ID')}</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="80" 
              value={needsPercent}
              onChange={(e) => handleBudgetChange('needs', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Wants (Keinginan): {wantsPercent}%</span>
              <span className="text-teal-600 dark:text-teal-400 font-black">Rp {wantsAmount.toLocaleString('id-ID')}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="60" 
              value={wantsPercent}
              onChange={(e) => handleBudgetChange('wants', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Savings (Tabungan): {savingsPercent}%</span>
              <span className="text-teal-600 dark:text-teal-400 font-black">Rp {savingsAmount.toLocaleString('id-ID')}</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={savingsPercent}
              onChange={(e) => handleBudgetChange('savings', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>
        </div>

        {/* Feedback Alert */}
        <div className={`p-4 rounded-xl border text-xs leading-relaxed font-semibold ${budgetFeedback.color}`}>
          {budgetFeedback.message}
        </div>
      </div>

      {/* Quiz Section */}
      <QuizSection
        moduleId="budgeting"
        questions={BUDGETING_QUESTIONS}
        completed={completed}
        onComplete={onComplete}
      />
    </ClassroomModuleLayout>
  );
}
