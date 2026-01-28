import { useState } from "react";
import eventService from "../api/eventService";

export const useEventParticipation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinEvent = async (eventId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.joinEvent(eventId);

      // Backend returnerar användarvänligt meddelande
      console.log("Join success:", response.message);
      return true;
    } catch (err: any) {
      // Backend returnerar felmeddelande (t.ex. "Event är fullt")
      const errorMessage =
        err.response?.data?.message || "Kunde inte joina event";
      setError(errorMessage);
      console.error("Error joining event:", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const leaveEvent = async (eventId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await eventService.leaveEvent(eventId);
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Kunde inte lämna event";
      setError(errorMessage);
      console.error("Error leaving event:", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { joinEvent, leaveEvent, loading, error, clearError };
};

export const useMyEvents = () => {
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getMyJoinedEvents();
      setMyEvents(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Kunde inte hämta dina events");
      console.error("Error fetching my events:", err);
    } finally {
      setLoading(false);
    }
  };

  return { myEvents, loading, error, refetch: fetchMyEvents };
};
