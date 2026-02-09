// FilterModal.tsx
import { useState, useEffect } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useCities } from "../../hooks/useCities";

export interface FilterOptions {
  categories: number[];
  cities: string[];
  genderRestriction: string | null;
  availableOnly: boolean;
  maxParticipants: {
    min: number | null;
    max: number | null;
  };

  // NEW: enable/disable age filtering
  useAgeRestriction: boolean;

  minimumAge: {
    min: number;
    max: number;
  };
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

const genderOptions = [
  { value: "OnlyMen", label: "Endast män" },
  { value: "OnlyWomen", label: "Endast kvinnor" },
];

export default function FilterModal({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
}: FilterModalProps) {
  const { categories } = useCategories();
  const { cities } = useCities();

  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  if (!isOpen) return null;

  const handleCategoryToggle = (categoryId: number) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleCityToggle = (cityName: string) => {
    setFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(cityName)
        ? prev.cities.filter((c) => c !== cityName)
        : [...prev.cities, cityName],
    }));
  };

  const handleGenderToggle = (gender: string) => {
    // Toggle: if the same gender is clicked again, deselect it.
    setFilters((prev) => ({
      ...prev,
      genderRestriction: prev.genderRestriction === gender ? null : gender,
    }));
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      categories: [],
      cities: [],
      genderRestriction: null,
      availableOnly: false,
      maxParticipants: { min: null, max: null },

      useAgeRestriction: false, // NEW

      minimumAge: { min: 18, max: 100 },
    };
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const activeFilterCount =
    filters.categories.length +
    filters.cities.length +
    (filters.genderRestriction ? 1 : 0) +
    (filters.availableOnly ? 1 : 0) +
    (filters.useAgeRestriction ? 1 : 0); // NEW

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-60 max-h-[66vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button onClick={handleReset} className="text-sm text-gray-500">
            Rensa alla
          </button>
          <h2 className="text-lg font-semibold">
            Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
          </h2>
          <button onClick={onClose} className="text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Kategorier
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.categories.includes(category.id)
                      ? "bg-red-400 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category.displayName}
                </button>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Städer</h3>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCityToggle(city.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.cities.includes(city.name)
                      ? "bg-red-400 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Gender restriction */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Könsrestriktion
            </h3>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleGenderToggle(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.genderRestriction === option.value
                      ? "bg-red-400 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Available only */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Visa endast events med lediga platser
              </span>
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    availableOnly: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded accent-red-400 ocus:ring-1 focus:ring-red-400"
              />
            </label>
          </div>

          {/* Max participants */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Max antal deltagare
            </h3>
            <div className="space-y-4">
              {/* Min */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Min:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => {
                        const currentMin = prev.maxParticipants.min ?? 0;
                        const nextMin = Math.max(0, currentMin - 1);
                        const nextMax =
                          prev.maxParticipants.max != null
                            ? Math.max(prev.maxParticipants.max, nextMin)
                            : prev.maxParticipants.max;

                        return {
                          ...prev,
                          maxParticipants: { min: nextMin, max: nextMax },
                        };
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold transition-colors"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    value={filters.maxParticipants.min ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;

                      if (raw === "") {
                        setFilters((prev) => ({
                          ...prev,
                          maxParticipants: {
                            ...prev.maxParticipants,
                            min: null,
                          },
                        }));
                        return;
                      }

                      const value = parseInt(raw, 10);
                      if (Number.isNaN(value)) return;

                      setFilters((prev) => {
                        const nextMin = Math.max(0, value);
                        const nextMax =
                          prev.maxParticipants.max != null
                            ? Math.max(prev.maxParticipants.max, nextMin)
                            : prev.maxParticipants.max;

                        return {
                          ...prev,
                          maxParticipants: { min: nextMin, max: nextMax },
                        };
                      });
                    }}
                    min={0}
                    max={filters.maxParticipants.max ?? undefined}
                    className="no-spinners w-20 text-center border border-gray-200 rounded-lg py-2 focus:outline-none focus:border-red-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => {
                        const currentMin = prev.maxParticipants.min ?? 0;
                        const nextMin = currentMin + 1;
                        const nextMax =
                          prev.maxParticipants.max != null
                            ? Math.max(prev.maxParticipants.max, nextMin)
                            : prev.maxParticipants.max;

                        return {
                          ...prev,
                          maxParticipants: { min: nextMin, max: nextMax },
                        };
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Max */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Max:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => {
                        const currentMax = prev.maxParticipants.max ?? 0;
                        const nextMax = Math.max(0, currentMax - 1);
                        const nextMin =
                          prev.maxParticipants.min != null
                            ? Math.min(prev.maxParticipants.min, nextMax)
                            : prev.maxParticipants.min;

                        return {
                          ...prev,
                          maxParticipants: { min: nextMin, max: nextMax },
                        };
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold transition-colors"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    value={filters.maxParticipants.max ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;

                      if (raw === "") {
                        setFilters((prev) => ({
                          ...prev,
                          maxParticipants: {
                            ...prev.maxParticipants,
                            max: null,
                          },
                        }));
                        return;
                      }

                      const value = parseInt(raw, 10);
                      if (Number.isNaN(value)) return;

                      setFilters((prev) => {
                        const nextMax = Math.max(0, value);
                        const nextMin =
                          prev.maxParticipants.min != null
                            ? Math.min(prev.maxParticipants.min, nextMax)
                            : prev.maxParticipants.min;

                        return {
                          ...prev,
                          maxParticipants: { min: nextMin, max: nextMax },
                        };
                      });
                    }}
                    min={filters.maxParticipants.min ?? 0}
                    className="no-spinners w-20 text-center border border-gray-200 rounded-lg py-2 focus:outline-none focus:border-red-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => {
                        const currentMax = prev.maxParticipants.max ?? 0;
                        const nextMax = currentMax + 1;
                        const nextMin =
                          prev.maxParticipants.min != null
                            ? Math.min(prev.maxParticipants.min, nextMax)
                            : prev.maxParticipants.min;

                        return {
                          ...prev,
                          maxParticipants: { min: nextMin, max: nextMax },
                        };
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Age restriction */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Åldersintervall
              </h3>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <span>Använd</span>
                <input
                  type="checkbox"
                  checked={filters.useAgeRestriction}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      useAgeRestriction: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded accent-red-400 focus:ring-red-400"
                />
              </label>
            </div>

            <p
              className={`text-sm mb-2 ${
                filters.useAgeRestriction ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {filters.useAgeRestriction
                ? `Åldersintervall: ${filters.minimumAge.min} - ${filters.minimumAge.max}`
                : "Aktivera för att välja åldersintervall"}
            </p>

            <div
              className={`space-y-2 ${
                filters.useAgeRestriction
                  ? ""
                  : "opacity-50 pointer-events-none"
              }`}
            >
              <input
                type="range"
                min="18"
                max="100"
                value={filters.minimumAge.min}
                disabled={!filters.useAgeRestriction}
                onChange={(e) => {
                  const nextMin = parseInt(e.target.value, 10);
                  setFilters((prev) => ({
                    ...prev,
                    minimumAge: {
                      min: nextMin,
                      max: Math.max(prev.minimumAge.max, nextMin),
                    },
                  }));
                }}
                className="w-full accent-light-green"
              />
              <input
                type="range"
                min="18"
                max="100"
                value={filters.minimumAge.max}
                disabled={!filters.useAgeRestriction}
                onChange={(e) => {
                  const nextMax = parseInt(e.target.value, 10);
                  setFilters((prev) => ({
                    ...prev,
                    minimumAge: {
                      min: Math.min(prev.minimumAge.min, nextMax),
                      max: nextMax,
                    },
                  }));
                }}
                className="w-full accent-light-green"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleApply}
            className="w-full bg-red-400 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            Visa resultat
          </button>
        </div>
      </div>

      <style>{`
        /* Hide number input spinners (Chrome, Safari, Edge) */
        .no-spinners::-webkit-outer-spin-button,
        .no-spinners::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Hide number input spinners (Firefox) */
        .no-spinners {
          -moz-appearance: textfield;
          appearance: textfield;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
