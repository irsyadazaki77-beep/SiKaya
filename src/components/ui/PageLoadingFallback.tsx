import React from 'react';

export function PageLoadingFallback() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
      <div className="w-full max-w-5xl space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-28 bg-teal-100 dark:bg-teal-950/60 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-4 w-full max-w-md bg-slate-150 dark:bg-slate-850 rounded-lg animate-pulse" />
        </div>

        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="h-44 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 space-y-4 animate-pulse">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
          <div className="h-44 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 space-y-4 animate-pulse">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
          <div className="h-44 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 space-y-4 animate-pulse">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="h-64 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 space-y-4 animate-pulse">
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default PageLoadingFallback;
