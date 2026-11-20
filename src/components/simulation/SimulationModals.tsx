import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface SimulationModalsProps {
  showGoalModal: boolean;
  setShowGoalModal: (show: boolean) => void;
  financialGoal: { name: string; target: number };
  setFinancialGoal: React.Dispatch<React.SetStateAction<{ name: string; target: number }>>;
  showRiskModal: boolean;
  setShowRiskModal: (show: boolean) => void;
  riskAnswers: number[];
  riskResult: string;
  handleSelectRiskAnswer: (score: number) => void;
  handleResetRisk: () => void;
  showResetModal: boolean;
  setShowResetModal: (show: boolean) => void;
  confirmHardReset: () => void;
}

export function SimulationModals({
  showGoalModal,
  setShowGoalModal,
  financialGoal,
  setFinancialGoal,
  showRiskModal,
  setShowRiskModal,
  riskAnswers,
  riskResult,
  handleSelectRiskAnswer,
  handleResetRisk,
  showResetModal,
  setShowResetModal,
  confirmHardReset,
}: SimulationModalsProps) {
  return (
    <>
      {/* MODAL 1: CHANGE FINANCIAL GOAL */}
      <AnimatePresence>
        {showGoalModal && (
          <div
            className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowGoalModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-2xl p-6 border border-slate-200 dark:border-slate-850 space-y-4 my-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold uppercase text-slate-800 dark:text-slate-100">Setel Ulang Target Finansial</h3>
                <button onClick={() => setShowGoalModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Nama Rencana Target</label>
                  <input
                    type="text"
                    value={financialGoal.name}
                    onChange={(e) => setFinancialGoal(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base sm:text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Jumlah Uang Target (Rupiah)</label>
                  <input
                    type="number"
                    value={financialGoal.target}
                    onChange={(e) => setFinancialGoal(p => ({ ...p, target: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base sm:text-xs font-bold"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowGoalModal(false)}
                className="w-full py-2.5 text-xs font-black uppercase text-white bg-teal-600 rounded-xl hover:bg-teal-500 transition-all"
              >
                Simpan Rencana
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: RISK PROFILE DIAGNOSTICS */}
      <AnimatePresence>
        {showRiskModal && (
          <div
            className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowRiskModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-slate-200 space-y-4 shadow-xl my-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Evaluasi Profil Risiko</h3>
                <button onClick={() => setShowRiskModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              {riskAnswers.length < 3 ? (
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(step => (
                      <div key={step} className={`h-1.5 flex-1 rounded-full ${riskAnswers.length >= step - 1 ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                    ))}
                  </div>

                  {riskAnswers.length === 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">1. Jika portofolio Anda turun 15% dalam 1 minggu, apa reaksi pertama Anda?</p>
                      <div className="space-y-2">
                        <button onClick={() => handleSelectRiskAnswer(1)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Panik dan langsung menjual semua aset demi mengamankan sisa dana (Konservatif)</button>
                        <button onClick={() => handleSelectRiskAnswer(2)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Menganalisis alasan penurunan dan menahan portofolio sementara waktu (Moderat)</button>
                        <button onClick={() => handleSelectRiskAnswer(3)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Melihatnya sebagai peluang diskon belanja saham besar-besaran (Agresif)</button>
                      </div>
                    </div>
                  )}

                  {riskAnswers.length === 1 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">2. Apa tujuan investasi utama yang ingin Anda kejar dalam 3 tahun ke depan?</p>
                      <div className="space-y-2">
                        <button onClick={() => handleSelectRiskAnswer(1)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Melindungi uang pokok dari inflasi dengan aman dan stabil</button>
                        <button onClick={() => handleSelectRiskAnswer(2)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Mendapatkan keuntungan pertumbuhan modal sedang dan dividen tunai berkelanjutan</button>
                        <button onClick={() => handleSelectRiskAnswer(3)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Memaksimalkan peningkatan modal gila-gilaan dari aset growth berisiko tinggi</button>
                      </div>
                    </div>
                  )}

                  {riskAnswers.length === 2 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">3. Berapa porsi dana investasi dari seluruh kekayaan bersih cair Anda?</p>
                      <div className="space-y-2">
                        <button onClick={() => handleSelectRiskAnswer(1)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Kurang dari 10% (Sangat hati-hati)</button>
                        <button onClick={() => handleSelectRiskAnswer(2)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Antara 10% sampai 40% (Porsi moderat seimbang)</button>
                        <button onClick={() => handleSelectRiskAnswer(3)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Lebih dari 40% (Alokasi agresif)</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center py-4">
                  <span className="text-4xl block">🎯</span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 block">Profil Risiko Anda</span>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">{riskResult}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Kami menyarankan Anda menyesuaikan rasio alokasi aset agar emosi trading Anda tetap terjaga dengan baik dalam simulasi real-time.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleResetRisk}
                      className="flex-1 py-2 text-xs font-black border border-slate-200 rounded-xl hover:bg-slate-50 transition-all uppercase"
                    >
                      Ulangi Tes
                    </button>
                    <button
                      onClick={() => setShowRiskModal(false)}
                      className="flex-1 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all uppercase"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CONFIRM RESET SIMULATION */}
      <AnimatePresence>
        {showResetModal && (
          <div
            className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowResetModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-850 space-y-4 shadow-xl my-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">Reset Simulasi</h3>
                <button onClick={() => setShowResetModal(false)} className="cursor-pointer"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin menyetel ulang seluruh portofolio simulasi, transaksi, dan saldo ke modal awal? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmHardReset}
                  className="flex-1 py-2.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Ya, Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
