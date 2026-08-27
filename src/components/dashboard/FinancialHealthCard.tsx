import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Activity, ChevronRight, AlertCircle, CheckCircle2, Info, Edit3, HeartPulse, X } from 'lucide-react';
import { FinancialProfile, FinancialHealthScoreResult } from '../../types/financial';
import { calculateFinancialHealthScore } from '../../lib/financialHealth';

interface FinancialHealthCardProps {
  profile: FinancialProfile;
  onEditProfile?: () => void;
}

export function FinancialHealthCard({ profile, onEditProfile }: FinancialHealthCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const healthResult: FinancialHealthScoreResult = calculateFinancialHealthScore(profile);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800';
      case 'B':
        return 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800';
      case 'C':
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800';
      default:
        return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800';
    }
  };

  return (
    <>
      <div className="ui-card flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-lg">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="ui-card-title">Kesehatan Finansial</h3>
              <p className="ui-card-sub">Berdasarkan profil yang Anda masukkan.</p>
            </div>
          </div>
          {onEditProfile && (
            <button
              onClick={onEditProfile}
              className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" /> Edit Profil
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <div className="md:col-span-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-4 md:pb-0 md:pr-4">
            <div className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center shrink-0 ${getGradeColor(healthResult.grade)}`}>
              <span className="text-2xl font-bold">{healthResult.grade}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {healthResult.overallScore}
                </span>
                <span className="text-sm text-slate-500">/ 100</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
                {healthResult.statusLabel}
              </p>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 gap-4">
            {Object.values(healthResult.ratios).map((ratio, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500">{ratio.name}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{ratio.formattedValue}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  ratio.status === 'A' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                  ratio.status === 'B' ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400' :
                  ratio.status === 'C' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                  'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                }`}>
                  {ratio.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Diperbarui otomatis
          </p>
          <button
            onClick={() => setShowDetailModal(true)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Lihat Analisis Detail <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="ui-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-2xl font-bold ${getGradeColor(healthResult.grade)}`}>
                  {healthResult.grade}
                </div>
                <div>
                  <h3 className="ui-card-title">Rincian Diagnostik Keuangan</h3>
                  <p className="text-sm text-slate-500 mt-1">Skor Keseluruhan: {healthResult.overallScore}/100</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Evaluasi 4 Pilar Utama</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.values(healthResult.ratios).map((ratio, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{ratio.name}</span>
                        <span className="text-xs font-semibold px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300">
                          {ratio.formattedValue} (T: {ratio.target})
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {ratio.advice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50 p-5 rounded-xl">
                <h4 className="text-sm font-semibold text-teal-900 dark:text-teal-300 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  Rekomendasi Langkah Nyata
                </h4>
                <ul className="space-y-2">
                  {healthResult.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="ui-btn-primary"
                >
                  Tutup Analisis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
