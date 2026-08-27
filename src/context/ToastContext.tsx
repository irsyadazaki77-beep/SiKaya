import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const toast = {
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    info: (message: string) => showToast('info', message),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => {
            let icon = <Info className="w-4 h-4 text-blue-500" />;
            let bgClass = 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800';
            
            if (t.type === 'success') {
              icon = <CheckCircle className="w-4 h-4 text-emerald-500" />;
              bgClass = 'bg-emerald-50/95 dark:bg-emerald-950/25 border-emerald-200/60 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300';
            } else if (t.type === 'error') {
              icon = <AlertCircle className="w-4 h-4 text-rose-500" />;
              bgClass = 'bg-rose-50/95 dark:bg-rose-950/25 border-rose-200/60 dark:border-rose-900/40 text-rose-900 dark:text-rose-300';
            } else if (t.type === 'info') {
              icon = <Info className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
              bgClass = 'bg-teal-50/95 dark:bg-teal-950/25 border-teal-200/60 dark:border-teal-900/40 text-teal-900 dark:text-teal-300';
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                layout
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg ${bgClass} transition-colors`}
              >
                <div className="shrink-0 mt-0.5">{icon}</div>
                <div className="flex-1 text-[11px] sm:text-xs font-bold leading-relaxed">
                  {t.message}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
