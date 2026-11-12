import { WeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import {
  formatTemp,
  formatWindSpeed,
  getWindDirectionLabel,
  getUvIndexCategory,
  formatHourString,
} from '../utils/unitConversions';
import {
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Sun,
  Cloud,
  Sunrise,
  Sunset,
  Calendar,
  Clock,
  Compass,
} from 'lucide-react';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  isDark: boolean;
}

export default function CurrentWeatherCard({
  weatherData,
  tempUnit,
  windUnit,
  isDark,
}: CurrentWeatherCardProps) {
  const { current, daily, timezone } = weatherData;
  const info = getWeatherCodeInfo(current.weatherCode);
  const IconComponent = info.icon;
  const today = daily[0];
  const uvCat = getUvIndexCategory(today?.uvIndexMax ?? 0);

  // Solar progress percentage calculation
  let solarPercent = 50;
  if (today?.sunrise && today?.sunset) {
    try {
      const now = new Date().getTime();
      const rise = new Date(today.sunrise).getTime();
      const set = new Date(today.sunset).getTime();
      if (now <= rise) solarPercent = 0;
      else if (now >= set) solarPercent = 100;
      else solarPercent = Math.round(((now - rise) / (set - rise)) * 100);
    } catch {
      solarPercent = 50;
    }
  }

  // Current formatted date in location timezone
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });

  return (
    <div className="w-full space-y-4">
      {/* Primary Hero Weather Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 bg-gradient-to-br ${
          isDark ? info.bgGradientDark : info.bgGradientLight
        } p-6 sm:p-8 shadow-lg shadow-slate-200/60 dark:shadow-2xl dark:shadow-black/50 backdrop-blur-xl`}
      >
        {/* Subtle decorative glow ring */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: info.accentColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Column: Location & Main Temp */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${info.badgeBg} ${info.badgeText}`}>
                {info.label}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {formattedDate}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                {formatTemp(current.temperature, tempUnit)}
              </span>
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Feels like {formatTemp(current.apparentTemperature, tempUnit)}
                </div>
                {today && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      H: {formatTemp(today.tempMax, tempUnit)}
                    </span>
                    <span>·</span>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold">
                      L: {formatTemp(today.tempMin, tempUnit)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              {info.description}
            </p>
          </div>

          {/* Right Column: Dynamic Large Animated Weather Icon */}
          <div className="flex flex-col items-center md:items-end justify-center shrink-0">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/50 backdrop-blur-md shadow-md dark:shadow-xl flex items-center justify-center">
              <IconComponent
                className="w-20 h-20 sm:w-24 sm:h-24 transition-transform duration-500 hover:scale-105"
                style={{ color: info.accentColor }}
              />
            </div>
            <div className="mt-2 text-right">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                Updated just now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Metrics Grid (7 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Apparent Temp */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs dark:shadow-none transition-colors space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Feels Like</span>
            <Thermometer className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatTemp(current.apparentTemperature, tempUnit)}
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {current.apparentTemperature > current.temperature ? 'Warmer than actual' : 'Cooler than actual'}
          </p>
        </div>

        {/* Card 2: Humidity */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs dark:shadow-none transition-colors space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Relative Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {current.relativeHumidity}%
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {current.relativeHumidity > 70 ? 'Muggy / High moisture' : current.relativeHumidity < 30 ? 'Dry air' : 'Comfortable range'}
          </p>
        </div>

        {/* Card 3: Wind Speed & Direction */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs dark:shadow-none transition-colors space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Wind Speed</span>
            <Wind className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatWindSpeed(current.windSpeed, windUnit)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate font-mono">
            <Compass className="w-3 h-3 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <span>{getWindDirectionLabel(current.windDirection)} ({current.windDirection}°)</span>
          </p>
        </div>

        {/* Card 4: UV Index */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs dark:shadow-none transition-colors space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Peak UV Index</span>
            <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {(today?.uvIndexMax ?? 0).toFixed(1)}
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${uvCat.badgeBg}`}>
              {uvCat.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {today?.uvIndexMax && today.uvIndexMax > 5 ? 'Sun protection advised' : 'Low skin risk'}
          </p>
        </div>

        {/* Card 5: Surface Pressure */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs dark:shadow-none transition-colors space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Air Pressure</span>
            <Gauge className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {Math.round(current.pressureMsl)} hPa
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {current.pressureMsl > 1013 ? 'High pressure system' : 'Low pressure system'}
          </p>
        </div>

        {/* Card 6: Cloud Cover */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs dark:shadow-none transition-colors space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Cloud Coverage</span>
            <Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {current.cloudCover}%
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {current.cloudCover > 80 ? 'Heavy clouds' : current.cloudCover > 30 ? 'Partly cloudy' : 'Clear sky'}
          </p>
        </div>

        {/* Card 7: Sunrise & Sunset Solar Arch */}
        {today && (
          <div className="col-span-2 p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs dark:shadow-none transition-colors space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Sunrise className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Sun Schedule
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {formatHourString(today.sunrise, timezone)} - {formatHourString(today.sunset, timezone)}
              </span>
            </div>

            {/* Solar Arc Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-indigo-500 transition-all duration-700"
                  style={{ width: `${solarPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Sunrise className="w-3 h-3 text-amber-500 dark:text-amber-400" /> {formatHourString(today.sunrise, timezone)}
                </span>
                <span className="flex items-center gap-1">
                  <Sunset className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> {formatHourString(today.sunset, timezone)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
