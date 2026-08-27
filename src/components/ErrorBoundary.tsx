import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-600"></div>
            
            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-450 mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mb-3 font-display">
              Oops! Terjadi Masalah
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mb-6 leading-relaxed">
              Ada kesalahan saat memuat halaman ini. Silakan muat ulang halaman atau kembali ke Beranda.
            </p>

            {this.state.error && (
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-4 mb-6 text-left max-h-32 overflow-y-auto">
                <p className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-3 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 hover:opacity-90 rounded-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Muat Uang Halaman
              </button>
              <a
                href="/"
                className="px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-750 rounded-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Home className="w-3.5 h-3.5" />
                Kembali ke Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
