import { X, Bookmark, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { Location } from '../types/weather';

interface SavedCitiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Location[];
  onSelectFavorite: (location: Location) => void;
  onRemoveFavorite: (idOrName: string) => void;
}

export default function SavedCitiesDrawer({
  isOpen,
  onClose,
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
}: SavedCitiesDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 dark:text-amber-400 fill-amber-400/20" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Saved Locations ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No saved locations yet.
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the bookmark icon in the header while viewing weather for any city to save it for instant 1-click access.
              </p>
            </div>
          ) : (
            favorites.map((loc, idx) => (
              <div
                key={`${loc.latitude}-${loc.longitude}-${idx}`}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-sky-400 dark:hover:border-sky-500/40 transition-all flex items-center justify-between gap-3 group"
              >
                <button
                  onClick={() => {
                    onSelectFavorite(loc);
                    onClose();
                  }}
                  className="flex-1 text-left flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-sky-500 dark:text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country || 'Global'}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectFavorite(loc);
                      onClose();
                    }}
                    title="Load weather"
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/20 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(loc.name)}
                    title="Remove from saved"
                    className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
