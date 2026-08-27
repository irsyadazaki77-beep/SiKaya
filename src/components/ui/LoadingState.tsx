import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ 
  message = 'Memuat data...', 
  className = '',
  size = 'md'
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center space-y-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-teal-600 dark:text-teal-400 animate-spin`} />
      {message && (
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
}
