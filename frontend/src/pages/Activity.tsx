// Activity.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/activity/ActivityHeader";
import FilterBar from "../components/sections/FilterBar";
import ActivityFeed from "../components/sections/ActivityFeed";
import BottomNav from "../components/layout/BottomNav";
import { useEvents } from "../hooks/useEvent";
import { type FilterOptions } from "../components/modals/FilterModal";

export default function Activity() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Single source of truth for all filters (used by Header, FilterBar, FilterModal)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    cities: [],
    genderRestriction: null,
    availableOnly: false,
    maxParticipants: { min: null, max: null },
    useAgeRestriction: false,
    minimumAge: { min: 18, max: 100 },
  });

  // Keep dropdown city selection (single city) but sync it into filters.cities
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Fetch events from backend (filtered based on user' age/gender)
  const { events, loading, error } = useEvents();

  useEffect(() => {
    if (location.state?.message) {
      setTimeout(() => setShowSuccessMessage(true), 0);

      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Header category toggle (multi-select)
  const handleCategoryToggle = (categoryId: number) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  // City dropdown change (single select) + keep modal in sync
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setFilters((prev) => ({
      ...prev,
      cities: city ? [city] : [],
    }));
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);

    // Keep dropdown in sync with modal:
    // - if exactly one city selected, show it in dropdown
    // - otherwise clear dropdown (so it doesn't lie)
    setSelectedCity(newFilters.cities.length === 1 ? newFilters.cities[0] : "");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCardClick = (eventId: number) => {
    navigate(`/activity/${eventId}`);
  };

  // Comprehensive filtering function
  const filteredEvents = events.filter((event) => {
    // Search filter (searches in title and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = event.title?.toLowerCase().includes(query);
      const matchesDescription = event.description
        ?.toLowerCase()
        .includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Category filter (multi)
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(event.categoryId)
    ) {
      return false;
    }

    // City filter (from dropdown or modal - both live in filters.cities)
    if (filters.cities.length > 0 && !filters.cities.includes(event.location)) {
      return false;
    }

    // Gender restriction filter
    if (
      filters.genderRestriction &&
      event.genderRestriction !== filters.genderRestriction
    ) {
      return false;
    }

    // Available only filter
    if (filters.availableOnly && event.isFull) {
      return false;
    }

    // Max participants filter (only apply when a bound is set)
    if (filters.maxParticipants.min != null) {
      if (event.maxParticipants < filters.maxParticipants.min) return false;
    }
    if (filters.maxParticipants.max != null) {
      if (event.maxParticipants > filters.maxParticipants.max) return false;
    }

    // Minimum age filter (single min slider in UI)
    // Keep your previous logic style, but effectively only checks min.
    if (filters.useAgeRestriction) {
      const eventMinAge = event.minimumAge ?? 18; // if null/undefined treat as 18
      if (eventMinAge < filters.minimumAge.min) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-light-green text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">Aktivitet skapad!</span>
          </div>
        </div>
      )}

      <div
        className="relative h-56 mb-4"
        style={{
          backgroundImage: `url("/activity-header-background.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "26rem",
        }}
      >
        <Header
          selectedCategoryIds={filters.categories}
          onCategoryToggle={handleCategoryToggle}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </div>

      <div className="relative px-6 h-10">
        <FilterBar
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          onFiltersChange={handleFiltersChange}
          activeFilters={filters}
        />
      </div>

      <div className="flex-1 flex pb-10 bg-white">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">Laddar events...</p>
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center px-6">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ActivityFeed events={filteredEvents} onCardClick={handleCardClick} />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
