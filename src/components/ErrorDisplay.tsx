import { AlertCircle, RefreshCw, Search } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  onSelectPopular?: (city: string) => void;
}

export default function ErrorDisplay({
  message,
  onRetry,
  onSelectPopular,
}: ErrorDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/90 border border-rose-200 dark:border-rose-500/30 shadow-xl dark:shadow-2xl text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Weather Data Unavailable
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
      </div>

      {onSelectPopular && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <span>Or try searching for one of these major global capitals:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {['Tokyo', 'New York', 'Paris', 'Sydney', 'Singapore'].map((city) => (
              <button
                key={city}
                onClick={() => onSelectPopular(city)}
                className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 transition-colors text-xs flex items-center gap-1"
              >
                <Search className="w-3 h-3" /> {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
