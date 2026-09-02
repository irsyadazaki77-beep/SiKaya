import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse, Edit3, ChevronRight, X, Sparkles, BookOpen, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FinancialProfile, FinancialHealthScoreResult } from '../../types/financial';
import { calculateFinancialHealthScore } from '../../lib/financialHealth';

interface FinancialHealthCardProps {
  profile: FinancialProfile;
  onEditProfile?: () => void;
}

export function FinancialHealthCard({ profile, onEditProfile }: FinancialHealthCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<'all' | 'cashflow' | 'emergencyFund' | 'debtRatio' | 'savingsRate' | 'investmentAllocation'>('all');
  const healthResult: FinancialHealthScoreResult = calculateFinancialHealthScore(profile);
  const navigate = useNavigate();

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

  const getStatusBadge = (status: 'A' | 'B' | 'C' | 'D' | 'F') => {
    switch (status) {
      case 'A':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'B':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 border-teal-200 dark:border-teal-800';
      case 'C':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    }
  };

  const pillarsList = Object.entries(healthResult.pillars).map(([key, p]) => ({
    key,
    ...p
  }));

  return (
    <>
      <div className="ui-card flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-xl border border-teal-100 dark:border-teal-900/50">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="ui-card-title">Kesehatan Finansial</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  5 Pilar Diagnostik
                </span>
              </div>
              <p className="ui-card-sub">Dihitung otomatis dari profil keuangan Anda.</p>
            </div>
          </div>
          {onEditProfile && (
            <button
              onClick={onEditProfile}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Sesuaikan Data
            </button>
          )}
        </div>

        {/* Score & 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-slate-50/80 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          {/* Main Score Column */}
          <div className="md:col-span-4 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-4 md:pb-0 md:pr-4">
            <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center mb-3 shadow-xs ${getGradeColor(healthResult.grade)}`}>
              <span className="text-3xl font-black font-display tracking-tight">{healthResult.grade}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-display">
                {healthResult.overallScore}
              </span>
              <span className="text-xs font-bold text-slate-400 font-mono">/ 100</span>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
              {healthResult.statusLabel}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] leading-snug">
              {healthResult.summary}
            </p>
          </div>

          {/* 5 Pillars Metric Breakdown */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pillarsList.map((pillar) => (
              <div
                key={pillar.key}
                onClick={() => {
                  setSelectedPillar(pillar.key as any);
                  setShowDetailModal(true);
                }}
                className="flex items-center justify-between bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">{pillar.name}</p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      {pillar.formattedValue}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({pillar.scoreOutOf20}/20)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${getStatusBadge(pillar.status)}`}>
                    {pillar.status}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer & Action Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Rekomendasi adaptif tersedia berdasarkan evaluasi Anda</span>
          </div>
          <button
            onClick={() => {
              setSelectedPillar('all');
              setShowDetailModal(true);
            }}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Buka Rincian Diagnostik (Why & How)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DETAIL MODAL WITH WHY THIS SCORE & HOW TO IMPROVE */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-black font-display shrink-0 ${getGradeColor(healthResult.grade)}`}>
                    {healthResult.grade}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                      Diagnostik Kesehatan Finansial
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Skor Total: <span className="font-bold text-slate-900 dark:text-white font-mono">{healthResult.overallScore}/100</span> • Status: <span className="font-semibold text-teal-600">{healthResult.statusLabel}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 5 Pillars Cards */}
              <div className="space-y-4 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Rincian 5 Pilar: Mengapa Skor Ini & Cara Meningkatkan
                </h4>

                <div className="grid gap-3.5">
                  {pillarsList.map((pillar) => (
                    <div
                      key={pillar.key}
                      className={`p-4 rounded-2xl border transition-all ${
                        selectedPillar === pillar.key || selectedPillar === 'all'
                          ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80'
                          : 'bg-white dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white font-display">
                            {pillar.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            (Target: {pillar.target})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                            Skor: {pillar.scoreOutOf20}/20
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${getStatusBadge(pillar.status)}`}>
                            Grade {pillar.status}
                          </span>
                        </div>
                      </div>

                      {/* Why & How */}
                      <div className="grid sm:grid-cols-2 gap-3 text-xs mt-2">
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                          <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 mb-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>MENGAPA SKOR INI:</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {pillar.whyThisScore}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>CARA MENINGKATKAN:</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {pillar.howToImprove}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations with Direct Module Navigation */}
              <div className="bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 font-bold text-sm text-teal-900 dark:text-teal-200 mb-3">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>Rekomendasi Modul Belajar Relevan:</span>
                </div>
                <div className="space-y-2.5">
                  {healthResult.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-teal-100 dark:border-teal-900/40"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {rec.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {rec.description}
                        </p>
                      </div>
                      {rec.moduleId && (
                        <button
                          onClick={() => {
                            setShowDetailModal(false);
                            navigate(`/classroom?module=${rec.moduleId}`);
                          }}
                          className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <span>Pelajari Modul</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
