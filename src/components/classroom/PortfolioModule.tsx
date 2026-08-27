import { useState } from 'react';
import { BookOpen, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { User } from '../../context/AuthContext';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function PortfolioModule({ user, onComplete, completed }: ModuleProps) {
  // Current values
  const [rdpuVal, setRdpuVal] = useState<number>(4000000); // 4M RDPU
  const [sbnVal, setSbnVal] = useState<number>(1000000);  // 1M SBN
  const [sahamVal, setSahamVal] = useState<number>(5000000); // 5M Stock

  // Target percentages (must total 100%)
  const [rdpuTarget, setRdpuTarget] = useState<number>(20); // Target 20% RDPU
  const [sbnTarget, setSbnTarget] = useState<number>(30);   // Target 30% SBN
  const [sahamTarget, setSahamTarget] = useState<number>(50); // Target 50% Saham

  const [rebalanced, setRebalanced] = useState<boolean>(false);

  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

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

  const questions = [
    {
      id: 1,
      q: 'Apa tujuan utama dari melakukan "Rebalancing" (penyeimbangan kembali) portofolio investasi secara berkala (misal tiap 6 atau 12 bulan sekali)?',
      options: [
        { text: 'A. Mengambil keuntungan dari aset yang naik tajam, lalu memindahkannya untuk membeli aset murah yang sedang terdiskon, guna meredam volatilitas portofolio sesuai profil risiko.', isCorrect: true },
        { text: 'B. Mencari sensasi trading harian agar portofolio berganti isi setiap hari.', isCorrect: false },
        { text: 'C. Membayar biaya administrasi bulanan perantara broker saham.', isCorrect: false }
      ],
      explanation: 'Rebalancing mengembalikan alokasi aset ke porsi idealnya. Saat saham naik tinggi, porsinya melebihi target dan meningkatkan profil risiko portofolio secara tidak sadar. Menjual sebagian saham (sell high) dan membeli aset yang underperforming (buy low) mengunci keuntunganmu secara otomatis!'
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
          <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[10px] font-black uppercase dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900">
            Modul 10 • Manajemen Risiko
          </span>
          {completed && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              ✓ Selesai (+100 XP)
            </span>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Klinik Portofolio & Penyeimbangan Kembali (Rebalancing)
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
          Seiring berjalannya waktu, pergerakan naik turunnya harga pasar membuat porsi investasimu bergeser (<em>Portfolio Drift</em>). Saham yang meroket tinggi akan mendominasi dan membuat portofoliomu jauh lebih berisiko dari profil awalmu. Melakukan penyeimbangan kembali (rebalancing) secara teratur mengunci keuntungan secara rasional.
        </p>
      </div>

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
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] font-black text-teal-600 uppercase">1. Reksa Dana RDPU (Aman/Cair)</span>
              <div className="flex items-center border dark:border-slate-850 rounded px-2 py-1 mt-1 bg-slate-50 dark:bg-slate-950/20 text-xs">
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
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] font-black text-indigo-600 uppercase">2. Surat Berharga SBN (Kupon)</span>
              <div className="flex items-center border dark:border-slate-850 rounded px-2 py-1 mt-1 bg-slate-50 dark:bg-slate-950/20 text-xs">
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
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] font-black text-amber-600 uppercase">3. Saham / ETF (Growth)</span>
              <div className="flex items-center border dark:border-slate-850 rounded px-2 py-1 mt-1 bg-slate-50 dark:bg-slate-950/20 text-xs">
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
                <span className="font-semibold text-slate-600 dark:text-slate-450">• Reksa Dana RDPU (Target {rdpuTarget}% | Saat Ini {rdpuPctActual.toFixed(0)}%)</span>
                <span className={`font-black ${rdpuDiff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {rdpuDiff === 0 ? '✓ Sesuai Target' : rdpuDiff > 0 ? `BELI Rp ${rdpuDiff.toLocaleString('id-ID')}` : `JUAL Rp ${Math.abs(rdpuDiff).toLocaleString('id-ID')}`}
                </span>
              </div>

              {/* SBN Instruction */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600 dark:text-slate-450">• SBN Surat Berharga (Target {sbnTarget}% | Saat Ini {sbnPctActual.toFixed(0)}%)</span>
                <span className={`font-black ${sbnDiff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {sbnDiff === 0 ? '✓ Sesuai Target' : sbnDiff > 0 ? `BELI Rp ${sbnDiff.toLocaleString('id-ID')}` : `JUAL Rp ${Math.abs(sbnDiff).toLocaleString('id-ID')}`}
                </span>
              </div>

              {/* Saham Instruction */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600 dark:text-slate-450">• Saham / ETF (Target {sahamTarget}% | Saat Ini {sahamPctActual.toFixed(0)}%)</span>
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

      {/* Quiz */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Evaluasi Rebalancing Portofolio</h4>

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
          <BookOpen className="w-3 h-3" /> Referensi Manajemen Portofolio
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
          <p>• <strong>Modern Portfolio Theory & Asset Allocation Model</strong> (Harry Markowitz) - Penerima Hadiah Nobel Ekonomi atas penelitian optimalisasi risiko investasi.</p>
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
          onClick={() => onComplete('portfolio')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
        >
          {completed ? 'Simpan Progres' : 'Selesaikan Kelas & Klaim Kelulusan! 🎓'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
