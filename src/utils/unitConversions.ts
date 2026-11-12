import { TemperatureUnit, WindSpeedUnit } from '../types/weather';

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  const val = convertTemperature(celsius, unit);
  return `${val}°${unit}`;
}

export function convertWindSpeed(kmh: number, unit: WindSpeedUnit): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  if (unit === 'ms') {
    return Math.round((kmh * 1000) / 3600);
  }
  return Math.round(kmh);
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  const val = convertWindSpeed(kmh, unit);
  return `${val} ${unit}`;
}

export function getWindDirectionLabel(degree: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index] || 'N';
}

export function getUvIndexCategory(uv: number): { label: string; color: string; badgeBg: string } {
  if (uv <= 2) {
    return { label: 'Low', color: 'text-emerald-500', badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
  }
  if (uv <= 5) {
    return { label: 'Moderate', color: 'text-amber-500', badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
  }
  if (uv <= 7) {
    return { label: 'High', color: 'text-orange-500', badgeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' };
  }
  if (uv <= 10) {
    return { label: 'Very High', color: 'text-rose-500', badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' };
  }
  return { label: 'Extreme', color: 'text-purple-600', badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' };
}

export function formatDateString(dateStr: string, timezone?: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: timezone || undefined,
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatHourString(timeStr: string, timezone?: string): string {
  try {
    const date = new Date(timeStr);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || undefined,
    }).format(date);
  } catch {
    return timeStr.slice(11, 16);
  }
}

export function formatShortHour(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: true,
    }).format(date);
  } catch {
    return timeStr.slice(11, 13) + 'h';
  }
}

export function getRelativeDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  } catch {
    return dateStr;
  }
}
