import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Activity, ChevronRight, AlertCircle, CheckCircle2, Info, Edit3, HeartPulse } from 'lucide-react';
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
        return 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/20';
      case 'B':
        return 'from-teal-500 to-cyan-600 text-white shadow-teal-500/20';
      case 'C':
        return 'from-amber-500 to-orange-600 text-white shadow-amber-500/20';
      default:
        return 'from-rose-500 to-red-600 text-white shadow-rose-500/20';
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
        {/* Subtle background gradient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-2xl border border-teal-100 dark:border-teal-900/40">
              <HeartPulse className="w-6 h-6 animate-pulse" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black tracking-widest text-teal-600 dark:text-teal-400 uppercase bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-100 dark:border-teal-900/50">
                  METRIK DIAGNOSTIK
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-850 dark:text-slate-100 mt-0.5">
                Financial Health Score
              </h3>
            </div>
          </div>

          {onEditProfile && (
            <button
              onClick={onEditProfile}
              className="text-xs font-bold text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer border-none"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Data Keuangan</span>
            </button>
          )}
        </div>

        {/* Score & Badge Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 dark:bg-slate-950/70 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/80">
          <div className="md:col-span-4 flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradeColor(healthResult.grade)} flex flex-col items-center justify-center font-black shadow-lg shrink-0`}>
              <span className="text-2xl leading-none">{healthResult.grade}</span>
              <span className="text-[10px] opacity-90 tracking-wider uppercase font-mono mt-0.5">GRADE</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {healthResult.overallScore}
                </span>
                <span className="text-xs font-bold text-slate-400">/100</span>
              </div>
              <p className="text-xs font-black text-teal-600 dark:text-teal-400 mt-0.5">
                {healthResult.statusLabel}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                {healthResult.summary}
              </p>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            {Object.values(healthResult.ratios).map((ratio, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/60 shadow-2xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{ratio.name}</p>
                <p className="text-sm font-black text-slate-850 dark:text-slate-100 mt-1">{ratio.formattedValue}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] font-semibold text-slate-400">Target: {ratio.target}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                    ratio.status === 'A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    ratio.status === 'B' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' :
                    ratio.status === 'C' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {ratio.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>Skor dihitung otomatis dari 4 rasio utama perencana keuangan independen.</span>
          </p>

          <button
            onClick={() => setShowDetailModal(true)}
            className="text-xs font-black text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none shrink-0"
          >
            <span>Analisis Lengkap & Saran</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Diagnosis Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getGradeColor(healthResult.grade)} flex items-center justify-center font-black text-xl shadow-md`}>
                    {healthResult.grade}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-850 dark:text-slate-100">
                      Rincian Diagnostik Kesehatan Keuangan
                    </h3>
                    <p className="text-xs font-extrabold text-teal-600 dark:text-teal-400">
                      Skor Keseluruhan: {healthResult.overallScore}/100 • {healthResult.statusLabel}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer border-none"
                >
                  ✕
                </button>
              </div>

              {/* Breakdown of 4 Ratios */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Evaluasi 4 Pilar Utama
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.values(healthResult.ratios).map((ratio, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">{ratio.name}</span>
                        <span className="text-xs font-black px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                          {ratio.formattedValue} (Target: {ratio.target})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {ratio.advice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/50 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-black text-teal-900 dark:text-teal-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  Rekomendasi Langkah Nyata
                </h4>
                <ul className="space-y-2 pl-2">
                  {healthResult.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-start gap-2">
                      <span className="text-teal-600 font-black">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-black rounded-xl cursor-pointer border-none shadow-md"
                >
                  Tutup & Terapkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
