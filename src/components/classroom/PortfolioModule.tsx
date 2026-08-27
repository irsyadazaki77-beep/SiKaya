import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { User } from '../../types/user';
import { ClassroomModuleLayout } from './ClassroomModuleLayout';
import { QuizSection } from './QuizSection';
import { PORTFOLIO_QUESTIONS } from '../../data/classroom/moduleQuestions';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function PortfolioModule({ onComplete, completed }: ModuleProps) {
  // Current values
  const [rdpuVal, setRdpuVal] = useState<number>(4000000); // 4M RDPU
  const [sbnVal, setSbnVal] = useState<number>(1000000);  // 1M SBN
  const [sahamVal, setSahamVal] = useState<number>(5000000); // 5M Stock

  // Target percentages (must total 100%)
  const [rdpuTarget, setRdpuTarget] = useState<number>(20); // Target 20% RDPU
  const [sbnTarget, setSbnTarget] = useState<number>(30);   // Target 30% SBN
  const [sahamTarget, setSahamTarget] = useState<number>(50); // Target 50% Saham

  const [rebalanced, setRebalanced] = useState<boolean>(false);

  const totalCurrentVal = rdpuVal + sbnVal + sahamVal;

  // Actual percentages
  const rdpuPctActual = totalCurrentVal > 0 ? (rdpuVal / totalCurrentVal) * 100 : 0;
  const sbnPctActual = totalCurrentVal > 0 ? (sbnVal / totalCurrentVal) * 100 : 0;
  const sahamPctActual = totalCurrentVal > 0 ? (sahamVal / totalCurrentVal) * 100 : 0;

  // Targets in IDR
  const rdpuTargetVal = (totalCurrentVal * rdpuTarget) / 100;
  const sbnTargetVal = (totalCurrentVal * sbnTarget) / 100;
  const sahamTargetVal = (totalCurrentVal * sahamTarget) / 100;

  // Drift diffs
  const rdpuDiff = rdpuTargetVal - rdpuVal;
  const sbnDiff = sbnTargetVal - sbnVal;
  const sahamDiff = sahamTargetVal - sahamVal;

  const handlePercentageChange = (type: 'rdpu' | 'sbn' | 'saham', val: number) => {
    setRebalanced(false);
    if (type === 'rdpu') {
      setRdpuTarget(val);
      const remaining = 100 - val;
      setSbnTarget(Math.round(remaining * 0.4));
      setSahamTarget(100 - val - Math.round(remaining * 0.4));
    } else if (type === 'sbn') {
      setSbnTarget(val);
      const remaining = 100 - val;
      setRdpuTarget(Math.round(remaining * 0.3));
      setSahamTarget(100 - val - Math.round(remaining * 0.3));
    } else {
      setSahamTarget(val);
      const remaining = 100 - val;
      setRdpuTarget(Math.round(remaining * 0.4));
      setSbnTarget(100 - val - Math.round(remaining * 0.4));
    }
  };

  return (
    <ClassroomModuleLayout
      category="Manajemen Risiko"
      title="Klinik Portofolio & Penyeimbangan Kembali (Rebalancing)"
      description="Seiring berjalannya waktu, pergerakan naik turunnya harga pasar membuat porsi investasimu bergeser (Portfolio Drift). Saham yang meroket tinggi akan mendominasi dan membuat portofoliomu jauh lebih berisiko dari profil awalmu. Melakukan penyeimbangan kembali (rebalancing) secara teratur mengunci keuntungan secara rasional."
      completed={completed}
    >
      {/* Interactive Rebalance Tool */}
      <div className="bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4">
        <div>
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-indigo-600" /> Klinik Rebalancing Portofolio Mandiri
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Input nilai asetmu saat ini dan target alokasi impianmu:</p>
        </div>

        {/* Input grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* RDPU Inputs */}
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] font-black text-teal-600 uppercase">1. Reksa Dana RDPU (Aman/Cair)</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded px-2 py-1 mt-1 bg-slate-50 dark:bg-slate-950/20 text-xs">
                <span className="text-slate-400 mr-1.5 font-bold">Rp</span>
                <input
                  type="number"
                  value={rdpuVal}
                  onChange={(e) => { setRdpuVal(parseInt(e.target.value) || 0); setRebalanced(false); }}
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-700 dark:text-slate-350"
                />
              </div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block">Target Porsi ({rdpuTarget}%)</span>
              <input
                type="range"
                min="10"
                max="80"
                value={rdpuTarget}
                onChange={(e) => handlePercentageChange('rdpu', parseInt(e.target.value))}
                className="w-full accent-teal-600 h-1 bg-slate-100 rounded"
              />
            </div>
          </div>

          {/* SBN Inputs */}
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] font-black text-indigo-600 uppercase">2. Surat Berharga SBN (Kupon)</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded px-2 py-1 mt-1 bg-slate-50 dark:bg-slate-950/20 text-xs">
                <span className="text-slate-400 mr-1.5 font-bold">Rp</span>
                <input
                  type="number"
                  value={sbnVal}
                  onChange={(e) => { setSbnVal(parseInt(e.target.value) || 0); setRebalanced(false); }}
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-700 dark:text-slate-350"
                />
              </div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block">Target Porsi ({sbnTarget}%)</span>
              <input
                type="range"
                min="10"
                max="80"
                value={sbnTarget}
                onChange={(e) => handlePercentageChange('sbn', parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1 bg-slate-100 rounded"
              />
            </div>
          </div>

          {/* Stock Inputs */}
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] font-black text-amber-600 uppercase">3. Saham / ETF (Growth)</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded px-2 py-1 mt-1 bg-slate-50 dark:bg-slate-950/20 text-xs">
                <span className="text-slate-400 mr-1.5 font-bold">Rp</span>
                <input
                  type="number"
                  value={sahamVal}
                  onChange={(e) => { setSahamVal(parseInt(e.target.value) || 0); setRebalanced(false); }}
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-700 dark:text-slate-350"
                />
              </div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block">Target Porsi ({sahamTarget}%)</span>
              <input
                type="range"
                min="10"
                max="80"
                value={sahamTarget}
                onChange={(e) => handlePercentageChange('saham', parseInt(e.target.value))}
                className="w-full accent-amber-600 h-1 bg-slate-100 rounded"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => setRebalanced(true)}
          className="w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
        >
          Hitung Instruksi Rebalance Portofolio
        </button>

        {rebalanced && (
          <div className="p-4 bg-white dark:bg-slate-900 border border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs border-b dark:border-slate-850 pb-2">
              <span className="text-slate-400 font-bold">Nilai Total Portofoliomu:</span>
              <span className="font-black text-slate-800 dark:text-slate-200">Rp {totalCurrentVal.toLocaleString('id-ID')}</span>
            </div>

            {/* Analysis rows */}
            <div className="space-y-2 text-xs">
              {/* RDPU Instruction */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600 dark:text-slate-400">• Reksa Dana RDPU (Target {rdpuTarget}% | Saat Ini {rdpuPctActual.toFixed(0)}%)</span>
                <span className={`font-black ${rdpuDiff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {rdpuDiff === 0 ? '✓ Sesuai Target' : rdpuDiff > 0 ? `BELI Rp ${rdpuDiff.toLocaleString('id-ID')}` : `JUAL Rp ${Math.abs(rdpuDiff).toLocaleString('id-ID')}`}
                </span>
              </div>

              {/* SBN Instruction */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600 dark:text-slate-400">• SBN Surat Berharga (Target {sbnTarget}% | Saat Ini {sbnPctActual.toFixed(0)}%)</span>
                <span className={`font-black ${sbnDiff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {sbnDiff === 0 ? '✓ Sesuai Target' : sbnDiff > 0 ? `BELI Rp ${sbnDiff.toLocaleString('id-ID')}` : `JUAL Rp ${Math.abs(sbnDiff).toLocaleString('id-ID')}`}
                </span>
              </div>

              {/* Saham Instruction */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600 dark:text-slate-400">• Saham / ETF (Target {sahamTarget}% | Saat Ini {sahamPctActual.toFixed(0)}%)</span>
                <span className={`font-black ${sahamDiff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {sahamDiff === 0 ? '✓ Sesuai Target' : sahamDiff > 0 ? `BELI Rp ${sahamDiff.toLocaleString('id-ID')}` : `JUAL Rp ${Math.abs(sahamDiff).toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>

            {/* Warning alert on transactional cost */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-[10px] text-amber-800 dark:text-amber-400 font-bold flex gap-1.5 items-start">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="leading-relaxed"><strong>Perhatian Transaksi Nyata:</strong> Saat melakukan rebalance di sekuritas asli, perhitungkan biaya transaksi (fee beli ~0.15%, fee jual ~0.25%) dan pajak final reksa dana serta saham agar tidak memakan keuntungan bersih penyeimbanganmu!</p>
            </div>
          </div>
        )}
      </div>

      <QuizSection
        moduleId="portfolio"
        questions={PORTFOLIO_QUESTIONS}
        completed={completed}
        onComplete={onComplete}
      />
    </ClassroomModuleLayout>
  );
}
