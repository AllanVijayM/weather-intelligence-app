import { useState } from 'react';
import { WeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import {
  formatTemp,
  formatWindSpeed,
  formatShortHour,
  getRelativeDayLabel,
} from '../utils/unitConversions';
import { LineChart, BarChart2, CloudRain, Wind, Activity } from 'lucide-react';

interface WeatherChartsProps {
  weatherData: WeatherData;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  selectedDayIndex: number;
  isDark: boolean;
}

type ChartTab = 'hourly' | 'daily' | 'precip' | 'uvwind';

export default function WeatherCharts({
  weatherData,
  tempUnit,
  windUnit,
  selectedDayIndex,
  isDark,
}: WeatherChartsProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>('hourly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { hourly, daily } = weatherData;

  // Theme-aware SVG colors
  const gridStroke = isDark ? '#334155' : '#e2e8f0';
  const axisLabelFill = isDark ? '#94a3b8' : '#64748b';
  const activeLabelFill = isDark ? '#ffffff' : '#0f172a';
  const pointBgFill = isDark ? '#0f172a' : '#ffffff';
  const skyStroke = isDark ? '#38bdf8' : '#0284c7';
  const amberStroke = isDark ? '#f59e0b' : '#d97706';
  const indigoStroke = isDark ? '#818cf8' : '#4f46e5';

  // Filter 24 hours for the selected day index (0 = today, 1 = tomorrow, etc.)
  const startIndex = selectedDayIndex * 24;
  const endIndex = startIndex + 24;

  const hoursSlice = hourly.time.slice(startIndex, endIndex);
  const tempsSlice = hourly.temperature.slice(startIndex, endIndex);
  const precipProbSlice = hourly.precipProb.slice(startIndex, endIndex);
  const windSlice = hourly.windSpeed.slice(startIndex, endIndex);
  const codesSlice = hourly.weatherCode.slice(startIndex, endIndex);

  // Fallback if index out of bounds
  const hoursCount = hoursSlice.length || 24;

  // Helper SVG curve path generator
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-5 overflow-hidden">
      {/* Chart Header & Segmented Tab Controls */}
      <div className="flex flex-col gap-3.5 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Activity className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Weather Charts
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Viewing forecast for {getRelativeDayLabel(daily[selectedDayIndex]?.time || '', selectedDayIndex)}
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto w-fit max-w-full">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'hourly'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" /> 24-Hr Temp
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'daily'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> 7-Day High/Low
          </button>

          <button
            onClick={() => setActiveTab('precip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'precip'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain & Humidity
          </button>

          <button
            onClick={() => setActiveTab('uvwind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'uvwind'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> UV & Wind
          </button>
        </div>
      </div>

      {/* CHART VIEW 1: 24-Hour Hourly Temperature Curve */}
      {activeTab === 'hourly' && (
        <div className="space-y-3">
          <div className="relative w-full h-64 sm:h-72 pt-4">
            {(() => {
              const svgWidth = 800;
              const svgHeight = 240;
              const padding = { top: 28, right: 24, bottom: 36, left: 48 };
              const chartWidth = svgWidth - padding.left - padding.right;
              const chartHeight = svgHeight - padding.top - padding.bottom;

              const minTemp = Math.min(...tempsSlice);
              const maxTemp = Math.max(...tempsSlice);
              const tempRange = maxTemp - minTemp || 1;

              const points = tempsSlice.map((t, idx) => {
                const x = padding.left + (idx / (hoursCount - 1)) * chartWidth;
                const y = padding.top + chartHeight - ((t - minTemp) / tempRange) * chartHeight;
                return { x, y, temp: t, hour: hoursSlice[idx], code: codesSlice[idx], precip: precipProbSlice[idx] };
              });

              const curvePath = createSmoothPath(points);
              const areaPath = `${curvePath} L ${padding.left + chartWidth} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

              return (
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full"
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <defs>
                    <linearGradient id="hourlyTempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={skyStroke} stopOpacity={isDark ? '0.4' : '0.28'} />
                      <stop offset="100%" stopColor={skyStroke} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                    const y = padding.top + chartHeight * ratio;
                    const tempVal = maxTemp - ratio * tempRange;
                    return (
                      <g key={idx}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={padding.left + chartWidth}
                          y2={y}
                          stroke={gridStroke}
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={padding.left - 8}
                          y={y + 4}
                          fill={axisLabelFill}
                          fontSize="11"
                          textAnchor="end"
                          className="font-mono"
                        >
                          {formatTemp(tempVal, tempUnit)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fill */}
                  <path d={areaPath} fill="url(#hourlyTempGrad)" />

                  {/* Curve Line */}
                  <path d={curvePath} fill="none" stroke={skyStroke} strokeWidth="3" strokeLinecap="round" />

                  {/* Data Points & Interactive hover zones */}
                  {points.map((pt, idx) => {
                    const isHovered = hoveredIndex === idx;
                    const showLabel = idx % 3 === 0 || isHovered;

                    return (
                      <g
                        key={idx}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        className="cursor-pointer group"
                      >
                        {/* Hover line */}
                        {isHovered && (
                          <line
                            x1={pt.x}
                            y1={padding.top}
                            x2={pt.x}
                            y2={padding.top + chartHeight}
                            stroke={skyStroke}
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                          />
                        )}

                        {/* Point Circle */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 3.5}
                          fill={isHovered ? skyStroke : pointBgFill}
                          stroke={skyStroke}
                          strokeWidth="2"
                          className="transition-all"
                        />

                        {/* Hour Label */}
                        {showLabel && (
                          <text
                            x={pt.x}
                            y={padding.top + chartHeight + 20}
                            fill={isHovered ? activeLabelFill : axisLabelFill}
                            fontSize="11"
                            textAnchor="middle"
                            className="font-mono"
                          >
                            {formatShortHour(pt.hour)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
          </div>

          {/* Hovered Details Callout */}
          {hoveredIndex !== null && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-sky-300 dark:border-sky-500/40 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-300 font-mono shadow-sm dark:shadow-lg">
              <span className="text-slate-900 dark:text-white font-bold">
                Time: {formatShortHour(hoursSlice[hoveredIndex])}
              </span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">
                Temp: {formatTemp(tempsSlice[hoveredIndex], tempUnit)}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">
                Rain Chance: {precipProbSlice[hoveredIndex]}%
              </span>
              <span className="text-amber-600 dark:text-amber-400">
                Condition: {getWeatherCodeInfo(codesSlice[hoveredIndex]).label}
              </span>
            </div>
          )}
        </div>
      )}

      {/* CHART VIEW 2: 7-Day Temperature Range Line Chart */}
      {activeTab === 'daily' && (
        <div className="space-y-3">
          <div className="relative w-full h-64 sm:h-72 pt-4">
            {(() => {
              const svgWidth = 800;
              const svgHeight = 240;
              const padding = { top: 28, right: 24, bottom: 36, left: 48 };
              const chartWidth = svgWidth - padding.left - padding.right;
              const chartHeight = svgHeight - padding.top - padding.bottom;

              const maxTemps = daily.slice(0, 7).map((d) => d.tempMax);
              const minTemps = daily.slice(0, 7).map((d) => d.tempMin);

              const overallMin = Math.min(...minTemps);
              const overallMax = Math.max(...maxTemps);
              const range = overallMax - overallMin || 1;

              const maxPoints = maxTemps.map((t, idx) => ({
                x: padding.left + (idx / 6) * chartWidth,
                y: padding.top + chartHeight - ((t - overallMin) / range) * chartHeight,
                temp: t,
                day: daily[idx]?.time || '',
              }));

              const minPoints = minTemps.map((t, idx) => ({
                x: padding.left + (idx / 6) * chartWidth,
                y: padding.top + chartHeight - ((t - overallMin) / range) * chartHeight,
                temp: t,
                day: daily[idx]?.time || '',
              }));

              const maxPath = createSmoothPath(maxPoints);
              const minPath = createSmoothPath(minPoints);

              return (
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                  {/* Grid Lines */}
                  {[0, 0.5, 1].map((ratio, idx) => {
                    const y = padding.top + chartHeight * ratio;
                    const val = overallMax - ratio * range;
                    return (
                      <g key={idx}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={padding.left + chartWidth}
                          y2={y}
                          stroke={gridStroke}
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={padding.left - 8}
                          y={y + 4}
                          fill={axisLabelFill}
                          fontSize="11"
                          textAnchor="end"
                          className="font-mono"
                        >
                          {formatTemp(val, tempUnit)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Max Temp Curve (Amber) */}
                  <path d={maxPath} fill="none" stroke={amberStroke} strokeWidth="3" strokeLinecap="round" />

                  {/* Min Temp Curve (Sky Blue) */}
                  <path d={minPath} fill="none" stroke={skyStroke} strokeWidth="3" strokeLinecap="round" />

                  {/* Data Points */}
                  {maxPoints.map((pt, idx) => (
                    <g key={`max-${idx}`}>
                      <circle cx={pt.x} cy={pt.y} r="4.5" fill={amberStroke} stroke={pointBgFill} strokeWidth="2" />
                      <text x={pt.x} y={pt.y - 10} fill={amberStroke} fontSize="11" textAnchor="middle" className="font-mono font-bold">
                        {formatTemp(pt.temp, tempUnit)}
                      </text>
                    </g>
                  ))}

                  {minPoints.map((pt, idx) => (
                    <g key={`min-${idx}`}>
                      <circle cx={pt.x} cy={pt.y} r="4.5" fill={skyStroke} stroke={pointBgFill} strokeWidth="2" />
                      <text x={pt.x} y={pt.y + 18} fill={skyStroke} fontSize="11" textAnchor="middle" className="font-mono font-semibold">
                        {formatTemp(pt.temp, tempUnit)}
                      </text>

                      {/* Day Label */}
                      <text
                        x={pt.x}
                        y={padding.top + chartHeight + 25}
                        fill={axisLabelFill}
                        fontSize="12"
                        textAnchor="middle"
                        className="font-bold"
                      >
                        {getRelativeDayLabel(pt.day, idx)}
                      </text>
                    </g>
                  ))}
                </svg>
              );
            })()}
          </div>
        </div>
      )}

      {/* CHART VIEW 3: Rain & Humidity */}
      {activeTab === 'precip' && (
        <div className="space-y-3">
          <div className="relative w-full h-64 sm:h-72 pt-4">
            {(() => {
              const svgWidth = 800;
              const svgHeight = 240;
              const padding = { top: 28, right: 24, bottom: 36, left: 48 };
              const chartWidth = svgWidth - padding.left - padding.right;
              const chartHeight = svgHeight - padding.top - padding.bottom;
              const barWidth = (chartWidth / hoursCount) * 0.6;

              return (
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((val, idx) => {
                    const y = padding.top + chartHeight - (val / 100) * chartHeight;
                    return (
                      <g key={idx}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={padding.left + chartWidth}
                          y2={y}
                          stroke={gridStroke}
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text x={padding.left - 8} y={y + 4} fill={axisLabelFill} fontSize="10" textAnchor="end" className="font-mono">
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Precipitation Probability Bars */}
                  {precipProbSlice.map((prob, idx) => {
                    const x = padding.left + (idx / hoursCount) * chartWidth + (chartWidth / hoursCount - barWidth) / 2;
                    const h = (prob / 100) * chartHeight;
                    const y = padding.top + chartHeight - h;

                    return (
                      <g key={idx}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={Math.max(2, h)}
                          fill={prob > 40 ? skyStroke : isDark ? '#64748b' : '#94a3b8'}
                          rx="2"
                          className="opacity-85 hover:opacity-100 transition-opacity"
                        />
                        {idx % 3 === 0 && (
                          <text
                            x={x + barWidth / 2}
                            y={padding.top + chartHeight + 20}
                            fill={axisLabelFill}
                            fontSize="10"
                            textAnchor="middle"
                            className="font-mono"
                          >
                            {formatShortHour(hoursSlice[idx])}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
          </div>
        </div>
      )}

      {/* CHART VIEW 4: UV Index & Wind Speed */}
      {activeTab === 'uvwind' && (
        <div className="space-y-3">
          <div className="relative w-full h-64 sm:h-72 pt-4">
            {(() => {
              const svgWidth = 800;
              const svgHeight = 240;
              const padding = { top: 28, right: 24, bottom: 36, left: 60 };
              const chartWidth = svgWidth - padding.left - padding.right;
              const chartHeight = svgHeight - padding.top - padding.bottom;

              const maxWind = Math.max(...windSlice, 10);

              const windPoints = windSlice.map((w, idx) => ({
                x: padding.left + (idx / (hoursCount - 1)) * chartWidth,
                y: padding.top + chartHeight - (w / maxWind) * chartHeight,
                wind: w,
                hour: hoursSlice[idx],
              }));

              const windPath = createSmoothPath(windPoints);

              return (
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                  {/* Grid */}
                  {[0, 0.5, 1].map((ratio, idx) => {
                    const y = padding.top + chartHeight * ratio;
                    const val = maxWind * (1 - ratio);
                    return (
                      <g key={idx}>
                        <line x1={padding.left} y1={y} x2={padding.left + chartWidth} y2={y} stroke={gridStroke} strokeDasharray="4 4" strokeWidth="1" />
                        <text x={padding.left - 8} y={y + 4} fill={axisLabelFill} fontSize="10" textAnchor="end" className="font-mono">
                          {formatWindSpeed(val, windUnit)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Wind Curve (Indigo) */}
                  <path d={windPath} fill="none" stroke={indigoStroke} strokeWidth="3" strokeLinecap="round" />

                  {/* Data Points */}
                  {windPoints.map((pt, idx) => {
                    if (idx % 3 !== 0) return null;
                    return (
                      <g key={idx}>
                        <circle cx={pt.x} cy={pt.y} r="3.5" fill={indigoStroke} />
                        <text x={pt.x} y={padding.top + chartHeight + 20} fill={axisLabelFill} fontSize="10" textAnchor="middle" className="font-mono">
                          {formatShortHour(pt.hour)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
