import React from 'react';
import { User } from '../../types/user';
import { ClassroomModuleLayout } from './ClassroomModuleLayout';
import { QuizSection } from './QuizSection';
import { CRYPTO_QUESTIONS } from '../../data/classroom/moduleQuestions';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function CryptoModule({ onComplete, completed }: ModuleProps) {
  return (
    <ClassroomModuleLayout
      category="Crypto & Web3"
      title="Fundamental Kripto & Menghindari Penipuan (Scam)"
      description="Pasar aset kripto menjanjikan return tinggi namun dibarengi risiko yang sangat ekstrem. Banyak oknum meluncurkan token bodong (shitcoins) dan skema pump-and-dump. Modul ini membantumu memahami fundamental aset digital dan cara menghindari scam."
      warningNote="Kripto adalah instrumen berisiko sangat tinggi (High Risk). Jangan pernah menggunakan uang panas, uang pinjol, atau seluruh dana daruratmu untuk berinvestasi di aset kripto."
      completed={completed}
    >
      {/* 3 Core Rules Card Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-400 mb-1">1. Not Your Keys, Not Your Coins</div>
          <div className="text-sm font-black text-slate-800 dark:text-slate-100">Cold Wallet Protection</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
            Exchange bisa bangkrut atau diretas. Simpan aset utama di hardware wallet terpisah.
          </p>
        </div>
        <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-400 mb-1">2. Hindari Shitcoin Scam</div>
          <div className="text-sm font-black text-slate-800 dark:text-slate-100">Cek Whitepaper & Tim</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
            Waspada janji return 1000% instan dan pengembang anonim tanpa produk nyata.
          </p>
        </div>
        <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-400 mb-1">3. Batasi Porsi Portofolio</div>
          <div className="text-sm font-black text-slate-800 dark:text-slate-100">Maksimal 5-10%</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
            Gunakan porsi kecil dari total kekayaan bersihmu karena volatilitas yang tajam.
          </p>
        </div>
      </div>

      {/* Quiz Section */}
      <QuizSection
        moduleId="crypto"
        questions={CRYPTO_QUESTIONS}
        completed={completed}
        onComplete={onComplete}
      />
    </ClassroomModuleLayout>
  );
}
