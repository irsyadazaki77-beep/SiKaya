import { useState } from 'react';
import { User } from '../../types/user';
import { ClassroomModuleLayout } from './ClassroomModuleLayout';
import { QuizSection } from './QuizSection';
import { REKSADANA_QUESTIONS } from '../../data/classroom/moduleQuestions';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function ReksadanaModule({ onComplete, completed }: ModuleProps) {
  const [simulationCapital, setSimulationCapital] = useState<number>(5000000); // Rp 5,000,000

  // Simulation yields after 3 years
  const savingsYield = simulationCapital * Math.pow(1 + 0.01, 3); // 1% interest bank
  const rdpuYield = simulationCapital * Math.pow(1 + 0.055, 3); // 5.5% RDPU
  const sbnYield = simulationCapital * Math.pow(1 + 0.065, 3); // 6.5% SBN

  return (
    <ClassroomModuleLayout
      category="Pendapatan Stabil"
      title="Menjinakkan Risiko via Reksa Dana & SBN (Surat Berharga Negara)"
      description="Belajar menaruh uang tidak melulu soal mengejar profit harian yang ekstrem. Bagi pemula, memahami cara kerja Reksa Dana dan Surat Berharga Negara (SBN) adalah batu loncatan terbaik untuk mengalahkan inflasi dengan aman."
      completed={completed}
    >
      {/* Comparison Sandbox Simulator */}
      <div className="bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
        <div>
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Simulator Pertumbuhan: Tabungan Biasa vs RDPU vs SBN</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Atur modal awalmu untuk melihat estimasi hasil dalam jangka <strong>3 tahun</strong>:</p>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>Modal Investasi Awal</span>
            <span className="text-indigo-600 font-extrabold">Rp {simulationCapital.toLocaleString('id-ID')}</span>
          </div>
          <input
            type="range"
            min="1000000"
            max="20000000"
            step="1000000"
            value={simulationCapital}
            onChange={(e) => setSimulationCapital(parseInt(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        {/* Dynamic Cards */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          {/* Bank */}
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Tabungan Bank Biasa (~1%)</p>
            <p className="text-sm font-black text-rose-500">Rp {Math.round(savingsYield).toLocaleString('id-ID')}</p>
            <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">Tergerus biaya admin bulanan dan pajak bunga 20%.</p>
          </div>

          {/* RDPU */}
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <p className="text-[9px] font-bold text-teal-600 uppercase">Reksa Dana RDPU (~5.5%)</p>
            <p className="text-sm font-black text-teal-600">Rp {Math.round(rdpuYield).toLocaleString('id-ID')}</p>
            <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">Bebas pajak, likuid dicairkan kapan saja tanpa denda.</p>
          </div>

          {/* SBN */}
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1">
            <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">SBN Negara Ritel (~6.5%)</p>
            <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">Rp {Math.round(sbnYield).toLocaleString('id-ID')}</p>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">100% dijamin undang-undang, kupon dikirim ke rekening tiap bulan.</p>
          </div>
        </div>
      </div>

      <QuizSection
        moduleId="reksadana"
        questions={REKSADANA_QUESTIONS}
        completed={completed}
        onComplete={onComplete}
      />
    </ClassroomModuleLayout>
  );
}
