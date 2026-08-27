import React, { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ClassroomModuleLayoutProps {
  category: string;
  badgeColor?: string;
  title: string;
  description: string;
  warningNote?: string;
  completed: boolean;
  xpReward?: number;
  children: ReactNode;
}

export function ClassroomModuleLayout({
  category,
  title,
  description,
  warningNote,
  completed,
  xpReward = 100,
  children
}: ClassroomModuleLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-widest">
            {category}
          </span>
          {completed && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> Selesai (+{xpReward} XP)
            </span>
          )}
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-3">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed max-w-3xl">
          {description}
        </p>
  
        {warningNote && (
          <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-sm text-amber-800 dark:text-amber-300 flex items-start gap-3 mt-4">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-amber-900 dark:text-amber-100">Catatan Penting: </strong>
              {warningNote}
            </p>
          </div>
        )}
      </div>

      {/* Main Module Interactive Body */}
      {children}
    </div>
  );
}
