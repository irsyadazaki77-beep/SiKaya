import React, { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xs text-slate-400 dark:text-slate-500">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <div className="max-w-sm space-y-1">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
