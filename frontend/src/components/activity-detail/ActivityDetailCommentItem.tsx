import React, { useState } from "react";
import { ActivityDetailCommentInput } from "./ActivityDetailCommentInput";

interface Comment {
  id: string;
  authorId?: string;
  authorName: string;
  authorImageUrl?: string;
  text: string;
  timestamp: Date;
}

interface ActivityDetailCommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onCancelReply: () => void;
  onSubmitReply: (text: string, parentId: string) => void;
  isReply?: boolean;
  hostId?: string;
}

export const ActivityDetailCommentItem: React.FC<
  ActivityDetailCommentItemProps
> = ({
  comment,
  onReply,
  replyingTo,
  onCancelReply,
  onSubmitReply,
  isReply = false,
  hostId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150;
  const shouldTruncate = comment.text.length > MAX_LENGTH;
  const displayText =
    shouldTruncate && !isExpanded
      ? comment.text.slice(0, MAX_LENGTH) + "..."
      : comment.text;

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just nu";
    if (diffMins < 60) return `${diffMins} min sedan`;
    if (diffHours < 24) return `${diffHours} tim sedan`;
    if (diffDays < 7) return `${diffDays} dag${diffDays > 1 ? "ar" : ""} sedan`;

    // Format as "14 jan kl. 16:30"
    const day = date.getDate();
    const month = date.toLocaleDateString("sv-SE", { month: "short" });
    const time = date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day} ${month} kl. ${time}`;
  };

  const isCurrentlyReplying = replyingTo === comment.id;
  const isHost = hostId && comment.authorId === hostId;

  return (
    <div className="relative">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
            {comment.authorImageUrl ? (
              <img
                src={comment.authorImageUrl}
                alt={comment.authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Author and Timestamp */}
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <span className=" text-gray-900">{comment.authorName}</span>
            {isHost && (
              <span className="text-xs bg-light-green text-white px-2 py-0.5 rounded">
                Arrangör
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatTimestamp(comment.timestamp)}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-gray-700 text-sm mb-2">{displayText}</p>

          {/* Show More/Less Button */}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-500  pr-3"
            >
              {isExpanded ? "visa mindre" : "visa mer"}
            </button>
          )}

          {/* Reply Button */}
          <button
            onClick={() =>
              isCurrentlyReplying ? onCancelReply() : onReply(comment.id)
            }
            className="text-xs text-gray-500"
          >
            {isCurrentlyReplying ? "avbryt" : "svara"}
          </button>

          {/* Reply Input */}
          {isCurrentlyReplying && (
            <div className="mt-3">
              <ActivityDetailCommentInput
                onSubmit={(text) => onSubmitReply(text, comment.id)}
                placeholder={`Svara ${comment.authorName}...`}
                autoFocus
                showCancel
                onCancel={onCancelReply}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
