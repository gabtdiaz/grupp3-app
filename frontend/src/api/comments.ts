import { api } from "./api";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  authorImageUrl: string | null;
}

export interface CreateCommentDto {
  text: string;
}

// Fetch all comments for event
export async function getEventComments(eventId: number): Promise<Comment[]> {
  const response = await api.get<Comment[]>(`/api/events/${eventId}/comments`);
  return response.data;
}

// Create new comment
export async function createComment(
  eventId: number,
  text: string,
): Promise<Comment> {
  const response = await api.post<Comment>(`/api/events/${eventId}/comments`, {
    content: text,
  });
  return response.data;
}

// Delete comment
export async function deleteComment(
  eventId: number,
  commentId: number,
): Promise<void> {
  await api.delete(`/api/events/${eventId}/comments/${commentId}`);
}
