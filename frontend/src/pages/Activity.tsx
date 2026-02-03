import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/activity/ActivityHeader";
import NavigationTabs from "../components/sections/NavigationTabs";
import FilterBar from "../components/sections/FilterBar";
import ActivityFeed from "../components/sections/ActivityFeed";
import BottomNav from "../components/layout/BottomNav";
import { useEvents } from "../hooks/useEvent";

export default function Activity() {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Hämta events från backend (filtrerade baserat på user age/gender)
  const { events, loading, error } = useEvents();

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

      <div className="px-6 pt-3 border-b border-gray-200 relative">
        <NavigationTabs />
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
