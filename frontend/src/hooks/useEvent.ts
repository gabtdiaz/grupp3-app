import { useState, useEffect } from "react";
import eventService from "../api/eventService";
import type { Event } from "../api/eventService";

export const useEvents = (category?: string, city?: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getAllEvents(category, city);
      setEvents(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Kunde inte hämta events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, city]);

  return { events, loading, error, refetch: fetchEvents };
};

export const useEvent = (eventId: number | null) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Kunde inte hämta event");
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
    }
  }, [eventId]);

  return {
    event,
    loading,
    error,
    refetch: () => eventId && fetchEvent(eventId),
  };
};
