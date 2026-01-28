import React, { useState, useEffect } from "react";
import { ActivityDetailHeader } from "../components/activity-detail/ActivityDetailHeader";
import { ActivityDetailHost } from "../components/activity-detail/ActivityDetailHost";
import { ActivityDetailMeta } from "../components/activity-detail/ActivityDetailMeta";
import { ActivityDetailDescription } from "../components/activity-detail/ActivityDetailDescription";
import { ActivityDetailAttendees } from "../components/activity-detail/ActivityDetailAttendees";
import { ActivityDetailJoinButton } from "../components/activity-detail/ActivityDetailJoinButton";
import { ActivityDetailComments } from "../components/activity-detail/ActivityDetailComments";
// import type { Comment } from "../components/activity-detail/ActivityDetailComments";
import BottomNav from "../components/layout/BottomNav";
import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { useEventParticipation } from "../hooks/useEventParticipation";
import { useComments } from "../hooks/useComments";

type TabType = "information" | "kommentarer";

export const ActivityDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("information");
  const [isJoined, setIsJoined] = useState(false);

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

  useEffect(() => {
    if (event) {
      setIsJoined(event.isUserParticipating);
    }
  }, [event]);

  // Fetch comments from backend
  const {
    comments: backendComments,
    loading: commentsLoading,
    error: commentsError,
    addComment,
    // removeComment,
  } = useComments(eventId);

  // Map backend comments to UI format
  const comments = backendComments.map((c) => ({
    id: c.id.toString(),
    authorId: c.authorId.toString(),
    authorName: c.authorName,
    authorImageUrl: c.authorImageUrl || "",
    text: c.content,
    timestamp: new Date(c.createdAt),
    replies: [],
  }));

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
          refetch();
        }
      } else {
        const success = await joinEvent(eventId);
        if (success) {
          setIsJoined(true);
          refetch();
        }
      }
    } catch (err) {
      console.error("Join/leave failed", err);
    }
  };

  const handleAddComment = async (text: string, parentId?: string) => {
    if (parentId) {
      // TODO: Fix replies in backend
      console.log("Replies not supported yet");
      return;
    }

    const success = await addComment(text);
    if (!success) {
      console.error("Failed to add comment");
    }
  };

  // Returnera participants i event object
  const attendees = event.participants.map((p) => ({
    id: p.userId.toString(),
    name: p.userName,
    imageUrl: p.profileImageUrl || "",
  }));

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
        <div>
          {commentsLoading ? (
            <div className="flex items-center justify-center p-6">
              <p className="text-gray-500">Laddar kommentarer...</p>
            </div>
          ) : commentsError ? (
            <div className="flex items-center justify-center p-6">
              <p className="text-red-500">{commentsError}</p>
            </div>
          ) : (
            <ActivityDetailComments
              comments={comments}
              onAddComment={handleAddComment}
              hostId={event.createdBy}
            />
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default ActivityDetail;
