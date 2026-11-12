export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Current Weather Skeleton Card */}
      <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="w-28 h-5 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-48 h-12 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-64 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="w-36 h-4 rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* 8 Metric Cards Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-24 h-6 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="h-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="w-40 h-5 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
