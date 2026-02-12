import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import Info from "../components/profile/Info";
import NavigationTabs from "../components/sections/NavigationTabs";
import ActivityFeed from "../components/sections/ActivityFeed";
import BottomNav from "../components/layout/BottomNav";
import { useEvents } from "../hooks/useEvent";
import { useCurrentUser } from "../hooks/useCurrentUser";

type TabType = "SKAPADE" | "KOMMER" | "TIDIGARE";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("SKAPADE");

  const { user: currentUser } = useCurrentUser();
  const { events, loading, error } = useEvents();

  const handleCardClick = (eventId: number) => {
    navigate(`/activity/${eventId}`);
  };

  // Filtrera events baserat på vald tab
  const getFilteredEvents = () => {
    if (!currentUser) return [];

    const now = new Date();

    switch (activeTab) {
      case "SKAPADE":
        // Events som användaren har skapat
        return events.filter(
          (event) => event.createdByUserId === currentUser.id,
        );

      case "KOMMER":
        // Events som användaren ska delta i (kommande)
        return events.filter((event) => {
          const eventDate = new Date(event.startDateTime);
          return event.isUserParticipating && eventDate >= now;
        });

      case "TIDIGARE":
        // Events som användaren har deltagit i (tidigare)
        return events.filter((event) => {
          const eventDate = new Date(event.startDateTime);
          return event.isUserParticipating && eventDate < now;
        });

      default:
        return [];
    }
  };

  const filteredEvents = getFilteredEvents();
  const isEmpty = !loading && filteredEvents.length === 0;

  // Olika tomma meddelanden för varje tab
  const getEmptyMessage = () => {
    switch (activeTab) {
      case "SKAPADE":
        return "Du har inte skapat några aktiviteter än";
      case "KOMMER":
        return "Du har inga kommande aktiviteter";
      case "TIDIGARE":
        return "Du har inga tidigare aktiviteter";
      default:
        return "Inga aktiviteter";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ProfileHeader />
      <Info />

      <div className="px-6 mt-8 border-b border-gray-200">
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex-1 flex pb-10 bg-white">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">Laddar aktiviteter...</p>
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center px-6">
            <p className="text-red-500">{error}</p>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-1 items-center justify-center text-center px-6">
            <p
              className="text-gray-400 text-xl"
              style={{ fontFamily: "'Segoe Print', cursive" }}
            >
              {getEmptyMessage()}
            </p>
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
