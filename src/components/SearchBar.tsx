import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Clock, Globe } from 'lucide-react';
import { Location } from '../types/weather';
import { searchCities } from '../services/openMeteoApi';

interface SearchBarProps {
  onSelectCity: (location: Location) => void;
  recentSearches: Location[];
  onClearRecent: () => void;
}

const POPULAR_CITIES: Location[] = [
  { name: 'Tokyo', country: 'Japan', country_code: 'JP', latitude: 35.6762, longitude: 139.6503, admin1: 'Tokyo' },
  { name: 'New York', country: 'United States', country_code: 'US', latitude: 40.7128, longitude: -74.006, admin1: 'New York' },
  { name: 'Paris', country: 'France', country_code: 'FR', latitude: 48.8566, longitude: 2.3522, admin1: 'Île-de-France' },
  { name: 'Sydney', country: 'Australia', country_code: 'AU', latitude: -33.8688, longitude: 151.2093, admin1: 'New South Wales' },
  { name: 'Dubai', country: 'United Arab Emirates', country_code: 'AE', latitude: 25.2048, longitude: 55.2708, admin1: 'Dubai' },
  { name: 'Singapore', country: 'Singapore', country_code: 'SG', latitude: 1.3521, longitude: 103.8198, admin1: 'Singapore' },
  { name: 'Cairo', country: 'Egypt', country_code: 'EG', latitude: 30.0444, longitude: 31.2357, admin1: 'Cairo' },
  { name: 'Rio de Janeiro', country: 'Brazil', country_code: 'BR', latitude: -22.9068, longitude: -43.1729, admin1: 'Rio de Janeiro' },
];

export default function SearchBar({
  onSelectCity,
  recentSearches,
  onClearRecent,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFetchedQueryRef = useRef<string>('');

  // Debounced search for autocomplete dropdown
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setSearchError(null);
      setActiveIndex(-1);
      lastFetchedQueryRef.current = '';
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setSearchError(null);
    setActiveIndex(-1);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        if (cancelled) return;
        lastFetchedQueryRef.current = trimmed;
        setSuggestions(results);
        if (results.length === 0) {
          setSearchError(`No cities matching "${trimmed}" found.`);
        } else {
          setSearchError(null);
        }
      } catch (err: any) {
        if (cancelled) return;
        setSearchError(err.message || 'Error searching cities.');
        setSuggestions([]);
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: Location) => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSearchError(null);
    setActiveIndex(-1);
    lastFetchedQueryRef.current = '';
    onSelectCity(loc);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (trimmed.length < 2) {
      setIsOpen(true);
      setSearchError('Please enter at least 2 characters to search for a city.');
      return;
    }

    // If user explicitly highlighted a dropdown option via arrow keys, select it
    if (isOpen && activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelectLocation(suggestions[activeIndex]);
      return;
    }

    let results = suggestions;
    if (lastFetchedQueryRef.current.toLowerCase() !== trimmed.toLowerCase() || isSearching) {
      setIsSearching(true);
      setSearchError(null);
      setIsOpen(true);
      try {
        results = await searchCities(trimmed);
        lastFetchedQueryRef.current = trimmed;
        setSuggestions(results);
        if (results.length === 0) {
          setSearchError(`No location found for "${trimmed}". Check spelling.`);
          return;
        }
      } catch (err: any) {
        setSearchError(err.message || 'Error searching cities.');
        setSuggestions([]);
        return;
      } finally {
        setIsSearching(false);
      }
    }

    if (results.length === 0) {
      setIsOpen(true);
      setSearchError(`No location found for "${trimmed}". Check spelling.`);
      return;
    }

    // Only select automatically if there is an exact city name match
    const exactMatch = results.find(
      (loc) => loc.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exactMatch) {
      handleSelectLocation(exactMatch);
    } else {
      // Keep dropdown open so the user can pick a city from the list
      setIsOpen(true);
      setActiveIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveIndex(-1);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3" ref={containerRef}>
      {/* Search Input Bar & Dropdown Wrapper */}
      <div className="relative">
        <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search city by name (e.g., Tokyo, New York, Paris, San Francisco)..."
              aria-autocomplete="list"
              aria-expanded={isOpen && (suggestions.length > 0 || Boolean(searchError))}
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm dark:shadow-lg transition-all"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setSearchError(null);
                  setActiveIndex(-1);
                  lastFetchedQueryRef.current = '';
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Weather Button */}
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-3.5 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-2 shrink-0"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="hidden sm:inline">Search Weather</span>
            <span className="sm:hidden">Search</span>
          </button>
        </form>

        {/* Autocomplete Dropdown */}
        {isOpen && (query.trim().length >= 2 || suggestions.length > 0 || searchError) && (
          <div className="absolute left-0 right-0 z-40 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 backdrop-blur-xl">
            {isSearching && (
              <div className="p-4 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500 dark:text-sky-400" />
                <span>Searching Open-Meteo geocoding database...</span>
              </div>
            )}

            {searchError && !isSearching && (
              <div className="p-4 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {!isSearching && suggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60">
                  Select a matching city from the list below
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {suggestions.map((loc, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={`${loc.latitude}-${loc.longitude}-${idx}`}
                        type="button"
                        onClick={() => handleSelectLocation(loc)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors group ${
                          isActive ? 'bg-sky-50 dark:bg-sky-500/15' : 'hover:bg-sky-50/70 dark:hover:bg-sky-500/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-sky-500 dark:text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
                          <div>
                            <div className={`text-sm font-semibold ${isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300'}`}>
                              {loc.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                              {loc.admin1 && <span>{loc.admin1}</span>}
                              {loc.admin1 && loc.country && <span>·</span>}
                              {loc.country && <span>{loc.country}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-[11px] font-mono text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                          {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Quick Access City Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 text-[11px]">
          <Globe className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" /> Popular Cities:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => onSelectCity(city)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900/80 hover:bg-sky-50 dark:hover:bg-sky-500/15 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500/40 text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 transition-all font-medium text-xs whitespace-nowrap shadow-xs dark:shadow-none"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches Pills */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-800/40">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent:
            </span>
            {recentSearches.slice(0, 5).map((city, idx) => (
              <button
                key={`${city.name}-${idx}`}
                type="button"
                onClick={() => onSelectCity(city)}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-[11px]"
              >
                {city.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClearRecent}
            className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors underline"
          >
            Clear history
          </button>
        </div>
      )}
    </div>
  );
}
