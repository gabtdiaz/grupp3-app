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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initialize filter state
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    cities: [],
    genderRestriction: null,
    availableOnly: false,
    maxParticipants: { min: null, max: null },
    useAgeRestriction: false,
    minimumAge: { min: 18, max: 100 },
  });

  // Fetch events from backend (filtered based on user' age/gender)
  const { events, loading, error } = useEvents();

  useEffect(() => {
    if (location.state?.message) {
      setTimeout(() => {
        setShowSuccessMessage(true);
      }, 0);
      // Hide message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      // Clean state so the message doesn't show again on navigation
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Comprehensive filtering function
  const filteredEvents = events.filter((event) => {
    // Search filter (searches in title and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = event.title?.toLowerCase().includes(query);
      const matchesDescription = event.description
        ?.toLowerCase()
        .includes(query);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    // Category filter from header (priority)
    if (selectedCategoryId && event.categoryId !== selectedCategoryId) {
      return false;
    }

    // Category filter from modal
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(event.categoryId)
    ) {
      return false;
    }

    // City filter from FilterBar dropdown (priority)
    if (selectedCity && event.location !== selectedCity) {
      return false;
    }

    // City filter from modal
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

    // Minimum age filter (only when enabled)
    if (filters.useAgeRestriction && event.minimumAge !== null) {
      if (
        event.minimumAge < filters.minimumAge.min ||
        event.minimumAge > filters.minimumAge.max
      ) {
        return false;
      }
    }

    return true;
  });

  const isEmpty = !loading && filteredEvents.length === 0;

  const handleCardClick = (eventId: number) => {
    navigate(`/activity/${eventId}`);
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(
      selectedCategoryId === categoryId ? null : categoryId,
    );
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
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
        className="relative h-56"
        style={{
          backgroundImage: `url("/activity-header-background.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "26rem",
        }}
      >
        <Header
          selectedCategoryId={selectedCategoryId}
          onCategoryClick={handleCategoryClick}
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
