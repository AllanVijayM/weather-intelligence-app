import { WeatherData, TemperatureUnit } from '../types/weather';
import { generateRecommendations } from '../utils/recommendations';
import {
  Compass,
  Umbrella,
  Sun,
  SunDim,
  Shirt,
  Wind,
  ThermometerSun,
  Footprints,
  Bike,
  Utensils,
  Mountain,
  Sparkles,
  Waves,
  LucideIcon,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface RecommendationsCardProps {
  weatherData: WeatherData;
  tempUnit: TemperatureUnit;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Umbrella,
  Sun,
  SunDim,
  Shirt,
  Wind,
  ThermometerSun,
  Footprints,
  Bike,
  Utensils,
  Mountain,
  Sparkles,
  Waves,
};

export default function RecommendationsCard({
  weatherData,
  tempUnit,
}: RecommendationsCardProps) {
  const { recommendations, activities, summaryText } = generateRecommendations(
    weatherData,
    tempUnit
  );

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Smart Planning Recommendations
        </h2>
      </div>

      {/* Atmospheric Summary Callout */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <p>{summaryText}</p>
      </div>

      {/* Section 1: Apparel & Gear Checklist Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Gear & Apparel Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recommendations.map((rec) => {
            const Icon = ICON_MAP[rec.icon] || Compass;

            let borderClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50';
            let iconClass = 'text-sky-600 dark:text-sky-400';
            let statusBadge = (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400">
                Recommended
              </span>
            );

            if (rec.status === 'warning') {
              borderClass = 'border-rose-200 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/15';
              iconClass = 'text-rose-600 dark:text-rose-400';
              statusBadge = (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Priority Alert
                </span>
              );
            } else if (rec.status === 'caution') {
              borderClass = 'border-amber-200 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-950/15';
              iconClass = 'text-amber-600 dark:text-amber-400';
              statusBadge = (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  Advisory
                </span>
              );
            } else if (rec.status === 'positive') {
              borderClass = 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/15';
              iconClass = 'text-emerald-600 dark:text-emerald-400';
              statusBadge = (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Clear
                </span>
              );
            }

            return (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border ${borderClass} space-y-2 flex flex-col justify-between transition-transform hover:-translate-y-0.5`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <Icon className={`w-5 h-5 ${iconClass}`} />
                    </div>
                    {statusBadge}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                    {rec.description}
                  </p>
                </div>

                {rec.actionableText && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/60 text-[11px] font-medium text-slate-600 dark:text-slate-400 font-mono">
                    → {rec.actionableText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Outdoor Activity Suitability Ratings */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Outdoor Activity Suitability
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((act) => {
            const Icon = ICON_MAP[act.iconName] || Compass;

            let scoreBg = 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40';
            if (act.score < 5) scoreBg = 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40';
            else if (act.score < 8) scoreBg = 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40';

            return (
              <div
                key={act.name}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sky-600 dark:text-sky-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {act.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${scoreBg} font-mono shrink-0`}>
                      {act.score}/10 {act.rating}
                    </span>
                  </div>

                  {/* Rating progress bar */}
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        act.score >= 8
                          ? 'bg-emerald-500 dark:bg-emerald-400'
                          : act.score >= 5
                          ? 'bg-amber-500 dark:bg-amber-400'
                          : 'bg-rose-500 dark:bg-rose-400'
                      }`}
                      style={{ width: `${act.score * 10}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight pt-0.5">
                    {act.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
