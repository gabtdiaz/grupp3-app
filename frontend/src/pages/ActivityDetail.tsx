import React, { useState } from "react";
import { ActivityDetailHeader } from "../components/activity-detail/ActivityDetailHeader";
import { ActivityDetailHost } from "../components/activity-detail/ActivityDetailHost";
import { ActivityDetailMeta } from "../components/activity-detail/ActivityDetailMeta";
import { ActivityDetailDescription } from "../components/activity-detail/ActivityDetailDescription";
import { ActivityDetailAttendees } from "../components/activity-detail/ActivityDetailAttendees";
import { ActivityDetailJoinButton } from "../components/activity-detail/ActivityDetailJoinButton";
import { ActivityDetailComments } from "../components/activity-detail/ActivityDetailComments";
import type { Comment } from "../components/activity-detail/ActivityDetailComments";
import BottomNav from "../components/layout/BottomNav";
import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { useEventParticipation } from "../hooks/useEventParticipation";

type TabType = "information" | "kommentarer";

export const ActivityDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("information");
  const [isJoined, setIsJoined] = useState(false);

  // Mockup comments
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      authorId: "user_001",
      authorName: "Anna A.",
      authorImageUrl: "",
      text: "Låter superkul! Vilka spel ska vi spela?",
      timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      replies: [
        {
          id: "1-1",
          authorId: "host_benjamin",
          authorName: "Benjamin B.",
          authorImageUrl: "",
          text: "Vi kör Dungeons & Dragons! Har förberett en campagne.",
          timestamp: new Date(Date.now() - 3600000),
        },
      ],
    },
    {
      id: "2",
      authorId: "user_002",
      authorName: "Björn B.",
      authorImageUrl: "",
      text: "Perfekt timing! Jag har precis köpt nya tärningar. Finns det plats för en till spelare?",
      timestamp: new Date(Date.now() - 1800000), // 30 mins ago
    },
    {
      id: "3",
      authorId: "user_003",
      authorName: "Cecilia C.",
      authorImageUrl: "",
      text: "Detta är en längre kommentar för att visa hur 'visa mer/visa mindre' funktionen fungerar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      timestamp: new Date(Date.now() - 900000), // 15 mins ago
    },
  ]);

  // Fetch eventId from URL
  const { id } = useParams<{ id: string }>();
  const eventId = id ? Number(id) : null;

  // Fetch event from API
  const { event, loading, error, refetch } = useEvent(eventId);

  // Join and leave functionality
  const {
    joinEvent,
    leaveEvent,
    loading: participationLoading,
  } = useEventParticipation();

  // Loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Laddar aktivitet...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Kunde inte ladda aktiviteten</p>
      </div>
    );
  }

  // Format date and time from backend
  const start = new Date(event.startDateTime);
  const end = event.endDateTime ? new Date(event.endDateTime) : null;

  const date = start.toLocaleDateString("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  const time = end
    ? `${start.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${end.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : start.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });

  const handleJoin = async () => {
    if (!eventId || participationLoading) return;

    try {
      if (isJoined) {
        const success = await leaveEvent(eventId);
        if (success) {
          setIsJoined(false);
          refetch(); // Refresh event data
        }
      } else {
        const success = await joinEvent(eventId);
        if (success) {
          setIsJoined(true);
          refetch(); // Refresh event data
        }
      }
    } catch (err) {
      console.error("Join/leave failed", err);
    }
  };

  const handleAddComment = (text: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      authorId: "current_user_id",
      authorName: "Du",
      authorImageUrl: "",
      text: text,
      timestamp: new Date(),
    };

    if (parentId) {
      // Add as reply - recursively find and update the parent comment
      const addReplyToComment = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments((prevComments) => addReplyToComment(prevComments));
    } else {
      setComments((prevComments) => [...prevComments, newComment]);
    }
  };

  // TODO: Backend ska returnera participants i event object
  // För nu använder vi tom array
  const attendees: any[] = [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with title and tabs */}
      <ActivityDetailHeader
        title={event.title}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content Area */}
      {activeTab === "information" ? (
        <div>
          {/* Host Section */}
          <ActivityDetailHost
            hostName={event.createdBy}
            hostRole="Arrangör"
            hostImageUrl=""
          />

          {/* Meta Information */}
          <ActivityDetailMeta
            location={event.location}
            date={date}
            time={time}
          />

          {/* Description */}
          <ActivityDetailDescription
            description={event.description ?? "Ingen beskrivning angiven"}
          />

          {/* Attendees */}
          <ActivityDetailAttendees attendees={attendees} />

          {/* Join Button */}
          <div className="fixed bottom-14 left-0 right-0 px-4 z-40">
            <ActivityDetailJoinButton onJoin={handleJoin} isJoined={isJoined} />
          </div>
        </div>
      ) : (
        <ActivityDetailComments
          comments={comments}
          onAddComment={handleAddComment}
          hostId={event.createdBy}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default ActivityDetail;
