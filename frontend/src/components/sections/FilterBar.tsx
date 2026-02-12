// FilterBar.tsx
import { useState } from "react";
import { useCities } from "../../hooks/useCities";
import FilterModal, { type FilterOptions } from "../modals/FilterModal";

interface FilterBarProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onFiltersChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

export default function FilterBar({
  selectedCity,
  onCityChange,
  onFiltersChange,
  activeFilters,
}: FilterBarProps) {
  const { cities } = useCities();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Count active filters (excluding city since it's handled separately)
  const activeFilterCount =
    activeFilters.categories.length +
    activeFilters.cities.length +
    (activeFilters.genderRestriction ? 1 : 0) +
    (activeFilters.availableOnly ? 1 : 0);

  return (
    <>
      <div className="relative flex items-center justify-content-between h-full">
        {/* Centered location selector */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <img
            src="/icons/location-icon.svg"
            alt="Location"
            className="w-5 h-5"
          />
          <select
            className="text-gray-500 border-none bg-transparent focus:outline-none"
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
          >
            <option value="">Alla städer</option>
            {cities.map((city) => (
              <option key={city.id}>{city.name}</option>
            ))}
          </select>
        </div>

        {/* Right-aligned filter button */}
        <button
          className="ml-auto relative"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <img src="/icons/filter-icon.svg" alt="Filter" className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={activeFilters}
        onApplyFilters={onFiltersChange}
      />
    </>
  );
}
