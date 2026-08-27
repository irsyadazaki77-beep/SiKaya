import React, { ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = 'Terjadi Kesalahan',
  message,
  onRetry,
  action,
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`p-6 sm:p-8 text-center rounded-2xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="p-3 bg-rose-100 dark:bg-rose-900/40 rounded-2xl text-rose-600 dark:text-rose-400 shadow-xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="max-w-sm space-y-1">
        <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">{title}</h4>
        <p className="text-xs text-rose-700/80 dark:text-rose-350 leading-relaxed font-medium">
          {message}
        </p>
      </div>
      {(onRetry || action) && (
        <div className="pt-2 flex items-center gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Coba Lagi
            </button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
