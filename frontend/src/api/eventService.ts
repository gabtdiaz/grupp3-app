import { api } from "./api";

// Types baserat på backend EventDto
export interface Event {
  id: number;
  title: string;
  description: string | null;
  location: string;
  startDateTime: string; // ISO string
  endDateTime: string | null;
  imageUrl: string | null;
  categoryId: number; // ID för filtrering
  category: string; // Displayname
  genderRestriction: string; // "All", "OnlyMen", "OnlyWomen"
  maxParticipants: number;
  currentParticipants: number;
  minimumAge: number | null;
  isActive: boolean;
  createdBy: string; // "Anna A."
  createdByUserId: number;
  createdByProfileImageUrl?: string; // Arrangörens profilbild
  createdAt: string;
  isFull: boolean; // Helper från backend
  participants: Participant[];
  isUserParticipating: boolean;
}

export interface Participant {
  userId: number;
  userName: string;
  profileImageUrl: string | null;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  location: string;
  startDateTime: string;
  endDateTime?: string;
  imageUrl?: string;
  categoryId: number; // 1-9 (Sport, Social, Kultur, etc.)
  maxParticipants: number;
  genderRestriction: number; // 1=All, 2=OnlyMen, 3=OnlyWomen
  minimumAge?: number;
}

export interface JoinedEvent extends Event {
  joinedAt: string;
  status: string; // "Confirmed", "Cancelled"
}

class EventService {
  /**
   * GET /api/events - Hämta alla events
   * Backend filtrerar automatiskt baserat på user age/gender
   * "Fulla" events visas fortfarande
   */
  async getAllEvents(categoryId?: number, city?: string): Promise<Event[]> {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId.toString());
    if (city) params.append("city", city);
    const url = `/api/events${params.toString() ? `?${params}` : ""}`;
    const response = await api.get<Event[]>(url);
    return response.data;
  }

  /**
   * GET /api/events/{id} - Hämta specifikt event
   */
  async getEventById(id: number): Promise<Event> {
    const response = await api.get<Event>(`/api/events/${id}`);
    return response.data;
  }

  /**
   * POST /api/events - Skapa nytt event
   */
  async createEvent(eventData: CreateEventDto): Promise<Event> {
    const response = await api.post<Event>("/api/events", eventData);
    return response.data;
  }

  /**
   * PUT /api/events/{id} - Uppdatera event (endast creator)
   */
  async updateEvent(
    id: number,
    eventData: Partial<CreateEventDto>,
  ): Promise<void> {
    await api.put(`/api/events/${id}`, eventData);
  }

  /**
   * DELETE /api/events/{id} - Ta bort event (endast creator)
   */
  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/api/events/${id}`);
  }

  /**
   * POST /api/events/{id}/join - Joina event
   * Returnerar status från backend (EventFull, CanJoin, etc.)
   */
  async joinEvent(id: number): Promise<{ message: string; status?: string }> {
    const response = await api.post<{ message: string; status?: string }>(
      `/api/events/${id}/join`,
    );
    return response.data;
  }

  /**
   * DELETE /api/events/{id}/leave - Lämna event
   */
  async leaveEvent(id: number): Promise<void> {
    await api.delete(`/api/events/${id}/leave`);
  }

  /**
   * GET /api/events/me/joined - Hämta mina joinade events
   */
  async getMyJoinedEvents(): Promise<JoinedEvent[]> {
    const response = await api.get<JoinedEvent[]>("/api/events/me/joined");
    return response.data;
  }

  /**
   * DELETE /api/events/{eventId}/participants/{userId} - Ta bort deltagare från event (endast creator)
   */
  async removeParticipant(eventId: number, userId: number): Promise<void> {
    await api.delete(`/api/events/${eventId}/participants/${userId}`);
  }
}

export default new EventService();
