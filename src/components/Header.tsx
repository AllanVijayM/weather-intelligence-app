import { useState, useEffect } from 'react';
import { Sun, Moon, CloudSun, Bookmark, RefreshCw, Compass } from 'lucide-react';
import { TemperatureUnit, WindSpeedUnit, WeatherData } from '../types/weather';

interface HeaderProps {
  weatherData: WeatherData | null;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  windUnit: WindSpeedUnit;
  onToggleWindUnit: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenFavorites: () => void;
  favoriteCount: number;
  isCurrentFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function Header({
  weatherData,
  tempUnit,
  onToggleTempUnit,
  windUnit,
  onToggleWindUnit,
  isDark,
  onToggleDark,
  onRefresh,
  isRefreshing,
  onOpenFavorites,
  favoriteCount,
  isCurrentFavorite,
  onToggleFavorite,
}: HeaderProps) {
  const [localTime, setLocalTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      if (weatherData?.timezone) {
        try {
          const now = new Date();
          const formatted = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: weatherData.timezone,
          }).format(now);
          setLocalTime(formatted);
        } catch {
          setLocalTime(new Date().toLocaleTimeString());
        }
      } else {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [weatherData?.timezone]);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        {/* Top Row on Mobile / Zone 1 on Desktop: Brand wordmark + mobile location summary */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
              <CloudSun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                Weather Intelligence
              </h1>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Public Open-Meteo Engine
              </p>
            </div>
          </div>

          {/* Mobile compact loaded location + time */}
          {weatherData && (
            <div className="flex md:hidden items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 shrink-0 max-w-[155px]">
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {weatherData.location.name}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="tabular-nums font-mono text-sky-600 dark:text-sky-400 shrink-0">
                {localTime ? localTime.replace(/:\d{2}\s/, ' ') : ''}
              </span>
            </div>
          )}
        </div>

        {/* Zone 2 (Desktop): Contextual location & live local time */}
        {weatherData && (
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-spin-slow" />
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">
                {weatherData.location.name}
              </span>
              {weatherData.location.country_code && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-transparent text-slate-600 dark:text-slate-400 uppercase font-mono">
                  {weatherData.location.country_code}
                </span>
              )}
            </div>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <div className="tabular-nums font-mono text-sky-600 dark:text-sky-400">
              {localTime || 'Live Time'}
            </div>
          </div>
        )}

        {/* Zone 3: Interactive controls & settings (all visible on mobile & desktop) */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Favorite Toggle for loaded city */}
            {weatherData && (
              <button
                onClick={onToggleFavorite}
                title={isCurrentFavorite ? 'Remove from favorites' : 'Save to favorites'}
                aria-label={isCurrentFavorite ? 'Remove from favorites' : 'Save to favorites'}
                className={`p-2 rounded-lg border transition-all ${
                  isCurrentFavorite
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isCurrentFavorite ? 'fill-amber-500 dark:fill-amber-400' : ''}`} />
              </button>
            )}

            {/* Saved Cities drawer button */}
            <button
              onClick={onOpenFavorites}
              aria-label="Open saved locations"
              className="flex items-center gap-1.5 px-2.5 py-2 sm:py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Saved</span>
              {favoriteCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-sky-500 text-white text-[10px] font-bold font-mono">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Refresh data button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing || !weatherData}
              title="Refresh current weather"
              aria-label="Refresh current weather"
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-500 dark:text-sky-400' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Unit selector segmented control */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                onClick={onToggleTempUnit}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  tempUnit === 'C'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                onClick={onToggleTempUnit}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  tempUnit === 'F'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Wind Speed Unit Toggle */}
            <button
              onClick={onToggleWindUnit}
              title="Toggle wind speed unit"
              className="flex px-2 py-1.5 sm:py-1 text-[11px] font-mono font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {windUnit}
            </button>

            {/* Theme toggle */}
            <button
              onClick={onToggleDark}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
