import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FinancialProfile } from '../../types/financial';
import { Save, Wallet, ShieldAlert, Target, DollarSign } from 'lucide-react';

interface FinancialProfileModalProps {
  currentProfile: FinancialProfile;
  onSave: (updated: FinancialProfile) => void;
  onClose: () => void;
}

export function FinancialProfileModal({ currentProfile, onSave, onClose }: FinancialProfileModalProps) {
  const [income, setIncome] = useState(currentProfile.monthlyIncome.toString());
  const [expenses, setExpenses] = useState(currentProfile.monthlyExpenses.toString());
  const [emergencyFund, setEmergencyFund] = useState(currentProfile.emergencyFund.toString());
  const [debt, setDebt] = useState(currentProfile.totalDebt.toString());
  const [monthlyDebt, setMonthlyDebt] = useState(currentProfile.monthlyDebtPayment.toString());
  const [cash, setCash] = useState(currentProfile.totalCash.toString());
  const [investments, setInvestments] = useState(currentProfile.totalInvestments.toString());
  const [risk, setRisk] = useState<'Konservatif' | 'Moderat' | 'Agresif'>(currentProfile.riskTolerance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FinancialProfile = {
      monthlyIncome: Number(income) || 0,
      monthlyExpenses: Number(expenses) || 0,
      emergencyFund: Number(emergencyFund) || 0,
      totalDebt: Number(debt) || 0,
      monthlyDebtPayment: Number(monthlyDebt) || 0,
      totalCash: Number(cash) || 0,
      totalInvestments: Number(investments) || 0,
      riskTolerance: risk,
      goals: currentProfile.goals
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
      >
        <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-black text-slate-850 dark:text-slate-100">
              Update Profil Keuangan Pengguna
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Data ini digunakan untuk menghitung Financial Health Score & personalisasi AI Advisor.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer border-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                Pemasukan Bulanan (Rp)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                Pengeluaran Bulanan (Rp)
              </label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                Total Dana Darurat Tersedia (Rp)
              </label>
              <input
                type="number"
                value={emergencyFund}
                onChange={(e) => setEmergencyFund(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                Saldo Kas / Bank Likuid (Rp)
              </label>
              <input
                type="number"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                Total Utang / Pinjaman (Rp)
              </label>
              <input
                type="number"
                value={debt}
                onChange={(e) => setDebt(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                Cicilan Utang Bulanan (Rp)
              </label>
              <input
                type="number"
                value={monthlyDebt}
                onChange={(e) => setMonthlyDebt(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                Toleransi Risiko Investasi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Konservatif', 'Moderat', 'Agresif'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRisk(r)}
                    className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      risk === r
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-150 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black rounded-xl cursor-pointer border-none"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl shadow-md cursor-pointer border-none flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Simpan Profil Keuangan
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
