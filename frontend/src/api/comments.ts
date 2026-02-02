import { api } from "./api";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  authorImageUrl: string | null;
  parentCommentId: number | null;
  replies: Comment[];
}

export interface CreateCommentDto {
  content: string;
  parentCommentId?: number | null;
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
  parentCommentId?: number | null,
): Promise<Comment> {
  const response = await api.post<Comment>(`/api/events/${eventId}/comments`, {
    content: text,
    parentCommentId: parentCommentId || null,
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
