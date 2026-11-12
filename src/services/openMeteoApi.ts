import { Location, WeatherData, CurrentWeather, DailyForecast, HourlyForecast } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<Location[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding server responded with status ${res.status}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      feature_code: item.feature_code,
      country_code: item.country_code,
      admin1: item.admin1,
      country: item.country,
      timezone: item.timezone,
      population: item.population,
    }));
  } catch (error: any) {
    console.error('Error fetching city search:', error);
    throw new Error(error.message || 'Failed to search cities. Please check your internet connection.');
  }
}

/**
 * Fetches full weather intelligence data for latitude & longitude from Open-Meteo Forecast API
 */
export async function fetchWeatherData(location: Location): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'surface_pressure',
    'cloud_cover',
    'visibility',
    'wind_speed_10m',
    'uv_index',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'rain_sum',
    'showers_sum',
    'snowfall_sum',
    'precipitation_hours',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant',
  ].join(',');

  const timezoneParam = location.timezone ? encodeURIComponent(location.timezone) : 'auto';

  const url = `${FORECAST_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=${timezoneParam}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo Weather API error (${res.status})`);
    }
    const data = await res.json();

    if (!data || !data.current || !data.daily || !data.hourly) {
      throw new Error('Invalid weather data structure returned by Open-Meteo API.');
    }

    // Map Current Weather
    const c = data.current;
    const current: CurrentWeather = {
      time: c.time,
      temperature: c.temperature_2m ?? 0,
      apparentTemperature: c.apparent_temperature ?? c.temperature_2m ?? 0,
      relativeHumidity: c.relative_humidity_2m ?? 0,
      isDay: c.is_day === 1,
      precipitation: c.precipitation ?? 0,
      rain: c.rain ?? 0,
      showers: c.showers ?? 0,
      snowfall: c.snowfall ?? 0,
      weatherCode: c.weather_code ?? 0,
      cloudCover: c.cloud_cover ?? 0,
      pressureMsl: c.pressure_msl ?? 1013,
      surfacePressure: c.surface_pressure ?? 1013,
      windSpeed: c.wind_speed_10m ?? 0,
      windDirection: c.wind_direction_10m ?? 0,
      windGusts: c.wind_gusts_10m ?? 0,
    };

    // Map Daily Forecast
    const d = data.daily;
    const dailyCount = d.time?.length || 0;
    const daily: DailyForecast[] = [];

    for (let i = 0; i < dailyCount; i++) {
      daily.push({
        time: d.time[i],
        weatherCode: d.weather_code?.[i] ?? 0,
        tempMax: d.temperature_2m_max?.[i] ?? 0,
        tempMin: d.temperature_2m_min?.[i] ?? 0,
        apparentMax: d.apparent_temperature_max?.[i] ?? 0,
        apparentMin: d.apparent_temperature_min?.[i] ?? 0,
        sunrise: d.sunrise?.[i] ?? '',
        sunset: d.sunset?.[i] ?? '',
        uvIndexMax: d.uv_index_max?.[i] ?? 0,
        precipitationSum: d.precipitation_sum?.[i] ?? 0,
        rainSum: d.rain_sum?.[i] ?? 0,
        showersSum: d.showers_sum?.[i] ?? 0,
        snowfallSum: d.snowfall_sum?.[i] ?? 0,
        precipitationHours: d.precipitation_hours?.[i] ?? 0,
        precipitationProbabilityMax: d.precipitation_probability_max?.[i] ?? 0,
        windSpeedMax: d.wind_speed_10m_max?.[i] ?? 0,
        windGustsMax: d.wind_gusts_10m_max?.[i] ?? 0,
        windDirectionDominant: d.wind_direction_10m_dominant?.[i] ?? 0,
      });
    }

    // Map Hourly Forecast
    const h = data.hourly;
    const hourly: HourlyForecast = {
      time: h.time || [],
      temperature: h.temperature_2m || [],
      humidity: h.relative_humidity_2m || [],
      dewPoint: h.dew_point_2m || [],
      apparentTemp: h.apparent_temperature || [],
      precipProb: h.precipitation_probability || [],
      precip: h.precipitation || [],
      weatherCode: h.weather_code || [],
      surfacePressure: h.surface_pressure || [],
      cloudCover: h.cloud_cover || [],
      visibility: h.visibility || [],
      windSpeed: h.wind_speed_10m || [],
      uvIndex: h.uv_index || [],
    };

    return {
      current,
      daily,
      hourly,
      timezone: data.timezone || 'UTC',
      timezoneAbbreviation: data.timezone_abbreviation || 'UTC',
      utcOffsetSeconds: data.utc_offset_seconds || 0,
      elevation: data.elevation || 0,
      location,
    };
  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    throw new Error(error.message || 'Unable to fetch weather forecast. Please try again.');
  }
}
