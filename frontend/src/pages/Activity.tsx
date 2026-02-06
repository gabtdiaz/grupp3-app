import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/activity/ActivityHeader";
import FilterBar from "../components/sections/FilterBar";
import ActivityFeed from "../components/sections/ActivityFeed";
import BottomNav from "../components/layout/BottomNav";
import { useEvents } from "../hooks/useEvent";

export default function Activity() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Hämta events från backend (filtrerade baserat på user age/gender)
  const { events, loading, error } = useEvents();

  useEffect(() => {
    if (location.state?.message) {
      setTimeout(() => {
        setShowSuccessMessage(true);
      }, 0);
      // Dölj meddelandet efter 3 sekunder
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      // Rensa state så meddelandet inte visas igen vid navigation
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Filtrera events baserat på CategoryId och stad
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      !selectedCategoryId || event.categoryId === selectedCategoryId;
    const matchesCity = !selectedCity || event.location === selectedCity;
    return matchesCategory && matchesCity;
  });

  const isEmpty = !loading && filteredEvents.length === 0;

  const handleCardClick = (eventId: number) => {
    navigate(`/activity/${eventId}`);
  };

  const handleCategoryClick = (categoryId: number) => {
    // Toggla kategori - om man klickar på samma kategori igen, avmarkeras den
    setSelectedCategoryId(
      selectedCategoryId === categoryId ? null : categoryId,
    );
  };
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Success message */}

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
        />
      </div>

      <div className="relative px-6 h-10">
        <FilterBar
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
        />
      </div>

      <div
        className={`flex-1 flex pb-10 ${isEmpty ? "" : "bg-white"}`}
        style={
          isEmpty
            ? {
                backgroundImage: "url('/activity-feed-background.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center 20%",
                backgroundSize: "90%",
              }
            : undefined
        }
      >
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
