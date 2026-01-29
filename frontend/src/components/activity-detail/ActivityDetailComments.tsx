import React, { useState } from "react";
import { ActivityDetailCommentItem } from "./ActivityDetailCommentItem";
import { ActivityDetailCommentInput } from "./ActivityDetailCommentInput";

export interface Comment {
  id: string;
  authorId?: string;
  authorName: string;
  authorImageUrl?: string;
  text: string;
  timestamp: Date;
  replies?: Comment[];
}

interface ActivityDetailCommentsProps {
  comments: Comment[];
  onAddComment: (text: string, parentId?: string) => void;
  onDeleteComment: (commentId: string) => void;
  currentUserId: number;
  hostId?: string;
}

export const ActivityDetailComments: React.FC<ActivityDetailCommentsProps> = ({
  comments,
  onAddComment,
  onDeleteComment,
  currentUserId,
  hostId,
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleSubmitReply = (text: string, parentId?: string) => {
    onAddComment(text, parentId);
    setReplyingTo(null);
  };

  return (
    <div className="pb-32">
      {/* Comments List */}
      <div className="px-4 py-4 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Inga kommentarer än</p>
            <p className="text-gray-400 text-xs mt-1">
              Var först med att kommentera!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              replyingTo={replyingTo}
              onCancelReply={handleCancelReply}
              onSubmitReply={handleSubmitReply}
              onDelete={onDeleteComment}
              currentUserId={currentUserId}
              hostId={hostId}
              depth={0}
            />
          ))
        )}
      </div>

      {/* Fixed Comment Input at Bottom */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
        <ActivityDetailCommentInput
          onSubmit={(text) => handleSubmitReply(text)}
          placeholder="Skriv en kommentar..."
        />
      </div>
    </div>
  );
};

// Helper component for recursive comment rendering
interface CommentThreadProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onCancelReply: () => void;
  onSubmitReply: (text: string, parentId: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId: number;
  hostId?: string;
  depth: number;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  onReply,
  replyingTo,
  onCancelReply,
  onSubmitReply,
  onDelete,
  currentUserId,
  hostId,
  depth,
}) => {
  return (
    <div>
      <ActivityDetailCommentItem
        comment={comment}
        onReply={onReply}
        replyingTo={replyingTo}
        onCancelReply={onCancelReply}
        onSubmitReply={onSubmitReply}
        onDelete={onDelete}
        currentUserId={currentUserId}
        hostId={hostId}
      />
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              onReply={onReply}
              replyingTo={replyingTo}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              onDelete={onDelete}
              currentUserId={currentUserId}
              hostId={hostId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
