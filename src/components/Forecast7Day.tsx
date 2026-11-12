import { DailyForecast, TemperatureUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import {
  convertTemperature,
  formatTemp,
  getRelativeDayLabel,
  formatDateString,
} from '../utils/unitConversions';
import { Umbrella, Calendar } from 'lucide-react';

interface Forecast7DayProps {
  daily: DailyForecast[];
  tempUnit: TemperatureUnit;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  timezone?: string;
}

export default function Forecast7Day({
  daily,
  tempUnit,
  selectedDayIndex,
  onSelectDay,
  timezone,
}: Forecast7DayProps) {
  if (!daily || daily.length === 0) return null;

  const days = daily.slice(0, 7);

  // Use converted & rounded temperatures so bar positions match displayed Start/End values exactly
  const minValues = days.map((d) => convertTemperature(d.tempMin, tempUnit));
  const maxValues = days.map((d) => convertTemperature(d.tempMax, tempUnit));

  const minOverall = Math.min(...minValues);
  const maxOverall = Math.max(...maxValues);
  const rangeOverall = maxOverall - minOverall || 1;

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-4 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
            7-Day Weather Forecast
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Click day for hourly trend
        </span>
      </div>

      {/* Temperature Bar Scale Indicator (Start / End Values) */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-2.5 sm:px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/70 text-[11px]"
        aria-label={`7-day temperature bar scale starts at ${minOverall}°${tempUnit} and ends at ${maxOverall}°${tempUnit}`}
      >
        <span className="text-slate-600 dark:text-slate-400 font-medium">
          Degree bar scale
        </span>
        <div className="flex items-center gap-2 font-mono tabular-nums">
          <span className="text-sky-600 dark:text-sky-400 font-semibold">
            Start {minOverall}°{tempUnit}
          </span>
          <div className="flex items-center w-16 sm:w-20" aria-hidden="true">
            <span className="w-1 h-2.5 bg-sky-500 dark:bg-sky-400 rounded-full shrink-0" />
            <div className="flex-1 h-1.5 bg-gradient-to-r from-sky-400 via-amber-400 to-orange-500" />
            <span className="w-1 h-2.5 bg-orange-500 rounded-full shrink-0" />
          </div>
          <span className="text-orange-600 dark:text-orange-400 font-semibold">
            End {maxOverall}°{tempUnit}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800/60">
        {days.map((day, idx) => {
          const info = getWeatherCodeInfo(day.weatherCode);
          const IconComponent = info.icon;
          const isSelected = selectedDayIndex === idx;

          const dayMin = minValues[idx];
          const dayMax = maxValues[idx];

          // Proportional bar math aligned to the Start (minOverall) and End (maxOverall) scale
          const leftPercent = Math.max(0, ((dayMin - minOverall) / rangeOverall) * 100);
          const rawWidth = ((dayMax - dayMin) / rangeOverall) * 100;
          const widthPercent = Math.min(100 - leftPercent, Math.max(8, rawWidth));

          return (
            <button
              key={day.time}
              type="button"
              onClick={() => onSelectDay(idx)}
              className={`w-full text-left py-3 px-2.5 sm:px-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 sm:gap-3 min-w-0 ${
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-500/40 shadow-xs'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {/* Day & Date Label */}
              <div className="w-[78px] sm:w-[86px] shrink-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {getRelativeDayLabel(day.time, idx)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {formatDateString(day.time, timezone)}
                </div>
              </div>

              {/* Weather Icon & Condition Text */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <IconComponent
                  className="w-5 h-5 shrink-0"
                  style={{ color: info.accentColor }}
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium">
                  {info.label}
                </span>
              </div>

              {/* Rain Probability */}
              <div className="hidden sm:flex items-center justify-end gap-1 w-10 text-xs text-sky-600 dark:text-sky-400 font-mono shrink-0 tabular-nums">
                {day.precipitationProbabilityMax > 15 ? (
                  <>
                    <Umbrella className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
                    <span>{day.precipitationProbabilityMax}%</span>
                  </>
                ) : (
                  <span className="text-slate-400 dark:text-slate-600 font-mono text-[11px]">0%</span>
                )}
              </div>

              {/* Temperature Bar & Min/Max values */}
              <div
                className="flex items-center gap-1.5 sm:gap-2 shrink-0"
                title={`${getRelativeDayLabel(day.time, idx)}: ${dayMin}°${tempUnit} to ${dayMax}°${tempUnit} (Scale: ${minOverall}°${tempUnit} – ${maxOverall}°${tempUnit})`}
              >
                <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 font-mono w-9 text-right tabular-nums">
                  {formatTemp(day.tempMin, tempUnit)}
                </span>

                {/* Range Bar with Start/End Track Caps */}
                <div className="hidden sm:flex lg:hidden xl:flex items-center sm:w-20 xl:w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden shrink-0 ring-1 ring-slate-300/60 dark:ring-slate-700/50">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-orange-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono w-9 text-right tabular-nums">
                  {formatTemp(day.tempMax, tempUnit)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
