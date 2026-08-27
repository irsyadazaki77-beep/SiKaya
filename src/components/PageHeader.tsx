import React from 'react';

interface PageHeaderProps {
  category: 'Belajar' | 'Keuangan' | 'Simulasi' | 'Komunitas' | 'Asisten AI';
  title: string;
  description: string;
  actions?: React.ReactNode;
  badge?: string;
}

export function PageHeader({ category, title, description, actions, badge }: PageHeaderProps) {
  const getCategoryColor = () => {
    switch (category) {
      case 'Belajar':
        return 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/80';
      case 'Keuangan':
        return 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-300/80 dark:border-slate-700/80';
      case 'Simulasi':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80';
      case 'Komunitas':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80';
      case 'Asisten AI':
        return 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/80';
      default:
        return 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/80';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80 mb-6 sm:mb-8">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border font-mono ${getCategoryColor()}`}>
            {category}
          </span>
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/80 uppercase tracking-wider font-mono">
              {badge}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto pt-1 md:pt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
