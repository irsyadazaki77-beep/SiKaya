import { useState } from 'react';
import { BookOpen, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { User } from '../../context/AuthContext';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function ReksadanaModule({ user, onComplete, completed }: ModuleProps) {
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [simulationCapital, setSimulationCapital] = useState<number>(5000000); // Rp 5,000,000

  // Simulation yields after 3 years
  const savingsYield = simulationCapital * Math.pow(1 + 0.01, 3); // 1% interest bank
  const rdpuYield = simulationCapital * Math.pow(1 + 0.055, 3); // 5.5% RDPU
  const sbnYield = simulationCapital * Math.pow(1 + 0.065, 3); // 6.5% SBN

  const questions = [
    {
      id: 1,
      q: 'Manakah jenis reksa dana yang memiliki tingkat risiko paling rendah dan paling cocok untuk tempat parkir sementara dana darurat?',
      options: [
        { text: 'A. Reksa Dana Saham (RDS) karena keuntungannya paling tinggi.', isCorrect: false },
        { text: 'B. Reksa Dana Pasar Uang (RDPU) karena portofolionya ditempatkan pada instrumen pasar uang berjangka pendek dan sangat likuid.', isCorrect: true },
        { text: 'C. Reksa Dana Campuran karena membagi porsi merata ke emas dan saham gorengan.', isCorrect: false }
      ],
      explanation: 'RDPU menempatkan dana pada deposito perbankan dan surat utang jangka pendek (<1 tahun), memiliki risiko paling rendah dan fluktuasi stabil, sangat cocok untuk dana darurat.'
    },
    {
      id: 2,
      q: 'Mengapa Surat Berharga Negara (SBN) ritel seperti ORI atau SR disebut investasi bebas risiko gagal bayar (Zero Default Risk)?',
      options: [
        { text: 'A. Karena dikelola oleh influencer bercentang biru di instagram.', isCorrect: false },
        { text: 'B. Karena pembayaran kupon (bunga) dan pengembalian modal pokok dijamin penuh oleh Undang-Undang APBN Negara RI.', isCorrect: true },
        { text: 'C. Karena SBN tidak menggunakan mata uang Rupiah.', isCorrect: false }
      ],
      explanation: 'SBN adalah surat utang negara resmi. Pembayaran bunga dan modal pokoknya dijamin 100% oleh Undang-Undang Republik Indonesia, menjadikannya sangat aman.'
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
            Modul 7 • Pendapatan Stabil
          </span>
          {completed && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              ✓ Selesai (+100 XP)
            </span>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Menjinakkan Risiko via Reksa Dana & SBN (Surat Berharga Negara)
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
          Belajar menaruh uang tidak melulu soal mengejar profit harian yang ekstrem. Bagi pemula, memahami cara kerja <strong>Reksa Dana</strong> dan <strong>Surat Berharga Negara (SBN)</strong> adalah batu loncatan terbaik untuk mengalahkan inflasi dengan aman.
        </p>
      </div>

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

      {/* Quiz */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Evaluasi Kompetensi Reksa Dana & SBN
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
          <BookOpen className="w-3 h-3" /> Referensi Kredibel OJK
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
          <p>• <strong>Direktorat Pengawasan Reksa Dana OJK</strong> - Panduan Edukasi Reksa Dana bagi Investor Pemula (Sikapi Uangmu).</p>
          <p>• <strong>Kementerian Keuangan RI (DJPPR)</strong> - Karakteristik Keamanan Instrumen SBN Ritel (ORI, SBR, SR, ST).</p>
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
          onClick={() => onComplete('reksadana')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
        >
          {completed ? 'Lanjut ke Modul 8' : 'Selesaikan & Klaim +100 XP'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
