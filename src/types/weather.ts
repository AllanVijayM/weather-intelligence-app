export interface Location {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
}

export interface DailyForecast {
  time: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  rainSum: number;
  showersSum: number;
  snowfallSum: number;
  precipitationHours: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  humidity: number[];
  dewPoint: number[];
  apparentTemp: number[];
  precipProb: number[];
  precip: number[];
  weatherCode: number[];
  surfacePressure: number[];
  cloudCover: number[];
  visibility: number[];
  windSpeed: number[];
  uvIndex: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast;
  timezone: string;
  timezoneAbbreviation: string;
  utcOffsetSeconds: number;
  elevation: number;
  location: Location;
}

export type TemperatureUnit = 'C' | 'F';
export type WindSpeedUnit = 'km/h' | 'mph' | 'ms';

export interface Recommendation {
  id: string;
  title: string;
  category: 'gear' | 'clothing' | 'activity' | 'alert' | 'health';
  description: string;
  status: 'positive' | 'caution' | 'warning' | 'neutral';
  icon: string;
  actionableText?: string;
}

export interface ActivityScore {
  name: string;
  category: string;
  score: number; // 0 to 10
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  reason: string;
  iconName: string;
}
