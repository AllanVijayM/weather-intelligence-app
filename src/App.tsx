import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import Forecast7Day from './components/Forecast7Day';
import WeatherCharts from './components/WeatherCharts';
import RecommendationsCard from './components/RecommendationsCard';
import SavedCitiesDrawer from './components/SavedCitiesDrawer';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import ErrorDisplay from './components/ErrorDisplay';
import { Location, WeatherData, TemperatureUnit, WindSpeedUnit } from './types/weather';
import { fetchWeatherData, searchCities } from './services/openMeteoApi';
import { CloudSun, ExternalLink } from 'lucide-react';

const FAVORITES_KEY = 'weather_intelligence_favorites_v1';
const RECENT_KEY = 'weather_intelligence_recent_v1';
const TEMP_UNIT_KEY = 'weather_intelligence_temp_unit';
const WIND_UNIT_KEY = 'weather_intelligence_wind_unit';
const THEME_KEY = 'weather_intelligence_theme';

export default function App() {
  // Initial location is NULL until user searches or selects a location
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // User Preferences
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(() => {
    return (localStorage.getItem(TEMP_UNIT_KEY) as TemperatureUnit) || 'C';
  });

  const [windUnit, setWindUnit] = useState<WindSpeedUnit>(() => {
    return (localStorage.getItem(WIND_UNIT_KEY) as WindSpeedUnit) || 'km/h';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === 'dark';
    return true; // Default dark
  });

  // Favorites & Recent Searches
  const [favorites, setFavorites] = useState<Location[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      return [];
    }
    return [];
  });

  const [recentSearches, setRecentSearches] = useState<Location[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      return [];
    }
    return [];
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Sync dark theme with HTML element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  // Load weather data when selectedLocation changes
  const loadWeather = useCallback(async (locationToFetch: Location, isSilentRefresh = false) => {
    if (!isSilentRefresh) setIsLoading(true);
    else setIsRefreshing(true);

    setError(null);

    try {
      const data = await fetchWeatherData(locationToFetch);
      setWeatherData(data);

      // Add to recent searches history if unique
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (item) => item.name.toLowerCase() !== locationToFetch.name.toLowerCase()
        );
        const updated = [locationToFetch, ...filtered].slice(0, 8);
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      setError(
        err.message || `Unable to retrieve weather forecast for ${locationToFetch.name}. Please check spelling or internet connection.`
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      loadWeather(selectedLocation);
    }
  }, [selectedLocation, loadWeather]);

  // Toggle favorite location
  const isCurrentFavorite = selectedLocation
    ? favorites.some((f) => f.name.toLowerCase() === selectedLocation.name.toLowerCase())
    : false;

  const handleToggleFavorite = () => {
    if (!selectedLocation) return;
    setFavorites((prev) => {
      let updated: Location[];
      if (isCurrentFavorite) {
        updated = prev.filter((f) => f.name.toLowerCase() !== selectedLocation.name.toLowerCase());
      } else {
        updated = [selectedLocation, ...prev];
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFavorite = (nameToRemove: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.name.toLowerCase() !== nameToRemove.toLowerCase());
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const handleQuickPopularSelect = (cityName: string) => {
    searchCities(cityName).then((results) => {
      if (results.length > 0) {
        setSelectedLocation(results[0]);
      }
    });
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200 flex flex-col font-sans`}>
      {/* Top Bar Header */}
      <Header
        weatherData={weatherData}
        tempUnit={tempUnit}
        onToggleTempUnit={() => {
          const next = tempUnit === 'C' ? 'F' : 'C';
          setTempUnit(next);
          localStorage.setItem(TEMP_UNIT_KEY, next);
        }}
        windUnit={windUnit}
        onToggleWindUnit={() => {
          const next = windUnit === 'km/h' ? 'mph' : windUnit === 'mph' ? 'ms' : 'km/h';
          setWindUnit(next);
          localStorage.setItem(WIND_UNIT_KEY, next);
        }}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onRefresh={() => selectedLocation && loadWeather(selectedLocation, true)}
        isRefreshing={isRefreshing}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoriteCount={favorites.length}
        isCurrentFavorite={isCurrentFavorite}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Search Bar & Quick City Controls */}
        <SearchBar
          onSelectCity={(loc) => {
            setSelectedLocation(loc);
            setSelectedDayIndex(0);
          }}
          recentSearches={recentSearches}
          onClearRecent={handleClearRecent}
        />

        {/* Initial Empty State Hero - Shown before user selects or searches a city */}
        {!selectedLocation && !isLoading && !error && (
          <div className="w-full max-w-2xl mx-auto my-12 p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-xl shadow-slate-200/60 dark:shadow-2xl dark:shadow-black/50 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-sky-50 dark:bg-gradient-to-tr dark:from-sky-500/20 dark:via-blue-500/10 dark:to-indigo-500/20 border border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-inner">
              <CloudSun className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Search Any City for Weather Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Enter a city name in the search box above or choose a popular destination to unlock real-time weather analytics.
              </p>
            </div>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Error Display State */}
        {error && !isLoading && (
          <ErrorDisplay
            message={error}
            onRetry={() => selectedLocation && loadWeather(selectedLocation)}
            onSelectPopular={handleQuickPopularSelect}
          />
        )}

        {/* Weather Intelligence Dashboard Content */}
        {!isLoading && !error && weatherData && (
          <div className="space-y-6">
            {/* Row 1: Current Weather & Atmospheric Metrics */}
            <CurrentWeatherCard
              weatherData={weatherData}
              tempUnit={tempUnit}
              windUnit={windUnit}
              isDark={isDark}
            />

            {/* Row 2: 7-Day Weather Forecast & Interactive Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 7-Day Forecast */}
              <div className="lg:col-span-5 min-w-0">
                <Forecast7Day
                  daily={weatherData.daily}
                  tempUnit={tempUnit}
                  selectedDayIndex={selectedDayIndex}
                  onSelectDay={(idx) => setSelectedDayIndex(idx)}
                  timezone={weatherData.timezone}
                />
              </div>

              {/* Right Column: Weather Charts */}
              <div className="lg:col-span-7 min-w-0">
                <WeatherCharts
                  weatherData={weatherData}
                  tempUnit={tempUnit}
                  windUnit={windUnit}
                  selectedDayIndex={selectedDayIndex}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Row 3: Weather Recommendations & Outdoor Activity Suitability */}
            <RecommendationsCard
              weatherData={weatherData}
              tempUnit={tempUnit}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-400">Weather Intelligence Dashboard</span>
            <span>·</span>
            <span>Powered by Open-Meteo Public APIs</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              API Reference <ExternalLink className="w-3 h-3" />
            </a>
            <span>·</span>
            <span>No API Keys Required</span>
          </div>
        </div>
      </footer>

      {/* Saved Locations Drawer */}
      <SavedCitiesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectFavorite={(loc) => {
          setSelectedLocation(loc);
          setSelectedDayIndex(0);
        }}
        onRemoveFavorite={handleRemoveFavorite}
      />
    </div>
  );
}
