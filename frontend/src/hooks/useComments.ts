import { useState, useEffect } from "react";
import {
  getEventComments,
  createComment,
  deleteComment,
  type Comment,
} from "../api/comments";

export function useComments(eventId: number | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments
  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    async function fetchComments() {
      try {
        setLoading(true);
        setError(null);
        const data = await getEventComments(eventId!);
        setComments(data);
      } catch (err: any) {
        console.error("Failed to fetch comments:", err);
        setError("Could not load comments");
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [eventId]);

  // Add new comment
  const addComment = async (
    text: string,
    parentCommentId?: number | null,
  ): Promise<boolean> => {
    if (!eventId) return false;

    try {
      const newComment = await createComment(eventId, text, parentCommentId);
      if (!parentCommentId) {
        setComments((prev) => [...prev, newComment]);
      } else {
        // If reply, update parent comment's replies
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentCommentId
              ? { ...comment, replies: [...comment.replies, newComment] }
              : comment,
          ),
        );
      }
      return true;
    } catch (err: any) {
      console.error("Failed to create comment:", err);
      setError("Could not create comment");
      return false;
    }
  };

  // Delete comment
  const removeComment = async (commentId: number): Promise<boolean> => {
    if (!eventId) return false;

    try {
      await deleteComment(eventId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      return true;
    } catch (err: any) {
      console.error("Failed to delete comment:", err);
      setError("Could not delete comment");
      return false;
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
    removeComment,
  };
}
