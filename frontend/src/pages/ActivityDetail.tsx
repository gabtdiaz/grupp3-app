import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActivityDetailHeader } from "../components/activity-detail/ActivityDetailHeader";
import { ActivityDetailHost } from "../components/activity-detail/ActivityDetailHost";
import { ActivityDetailMeta } from "../components/activity-detail/ActivityDetailMeta";
import { ActivityDetailDescription } from "../components/activity-detail/ActivityDetailDescription";
import ActivityDetailAttendees from "../components/activity-detail/ActivityDetailAttendees";
import { ActivityDetailJoinButton } from "../components/activity-detail/ActivityDetailJoinButton";
import { ActivityDetailComments } from "../components/activity-detail/ActivityDetailComments";
import DeleteActivityModal from "../components/modals/DeleteActivityModal";
import { ActivityDetailRemoveParticipantModal } from "../components/activity-detail/ActivityDetailRemoveParticipantModal";

import BottomNav from "../components/layout/BottomNav";
import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { useEventParticipation } from "../hooks/useEventParticipation";
import { useComments } from "../hooks/useComments";
import { useCurrentUser } from "../hooks/useCurrentUser";
import eventService from "../api/eventService";

type TabType = "information" | "kommentarer";

export const ActivityDetail: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("information");
  const [isJoined, setIsJoined] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [isRemovingParticipant, setIsRemovingParticipant] = useState(false);

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

  // Get current user
  const { user: currentUser } = useCurrentUser();

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
    removeComment,
  } = useComments(eventId);

  // Map backend comments to UI format
  const comments = backendComments.map((c) => ({
    id: c.id.toString(),
    authorId: c.authorId.toString(),
    authorName: c.authorName,
    authorImageUrl: c.authorImageUrl || "",
    text: c.content,
    timestamp: new Date(c.createdAt),
    replies: c.replies.map((r) => ({
      id: r.id.toString(),
      authorId: r.authorId.toString(),
      authorName: r.authorName,
      authorImageUrl: r.authorImageUrl || "",
      text: r.content,
      timestamp: new Date(r.createdAt),
      replies: [],
    })),
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
    const parentCommentId = parentId ? Number(parentId) : null;

    const success = await addComment(text, parentCommentId);
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

  const handleDeleteComment = async (commentId: string) => {
    const success = await removeComment(Number(commentId));
    if (!success) {
      console.error("Failed to delete comment");
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventId || isDeleting) return;

    try {
      setIsDeleting(true);
      await eventService.deleteEvent(eventId);

      // Navigera tillbaka till Activity efter delete
      navigate("/activity", {
        state: {
          message: "Aktivitet raderad",
          type: "success",
        },
      });
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Kunde inte radera aktiviteten");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (!eventId || isRemovingParticipant) return;

    try {
      setIsRemovingParticipant(true);
      await eventService.removeParticipant(eventId, Number(userId));
      await refetch();
    } catch (err) {
      console.error("Failed to remove participant", err);
      alert("Kunde inte ta bort deltagare");
    } finally {
      setIsRemovingParticipant(false);
    }
  };

  const isCreator = !!currentUser && event.createdByUserId === currentUser.id;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          {/*Tillbakaknapp*/}
          <button onClick={() => navigate(-1)} className="text-gray-600">
            ← Tillbaka
          </button>
        </div>
      </div>

      {/* Header with title and tabs */}
      <ActivityDetailHeader
        title={event.title}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        imageUrl={event.imageUrl || ""} 
      />


      {/* Content Area */}
      {activeTab === "information" ? (
        <div>
          {/* Host Section */}
          <ActivityDetailHost
            hostId={event.createdByUserId?.toString() || event.createdBy}
            hostName={event.createdBy}
            hostRole="Arrangör"
            hostImageUrl={event.createdByProfileImageUrl || ""}
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
          <ActivityDetailAttendees
            attendees={attendees}
            isCreator={isCreator}
            onManageClick={() => setShowParticipantsModal(true)}
          />

          {/* Join Button eller Delete Button */}
          <div className="fixed bottom-14 left-0 right-0 px-4 z-40">
            {isCreator ? (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-4 rounded-lg text-white font-futura"
                style={{ backgroundColor: "#DC2626" }}
              >
                Ta bort aktivitet
              </button>
            ) : (
              <ActivityDetailJoinButton
                onJoin={handleJoin}
                isJoined={isJoined}
              />
            )}
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
              onDeleteComment={handleDeleteComment}
              currentUserId={currentUser?.id || 0}
              hostId={event.createdBy}
            />
          )}
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      <DeleteActivityModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteEvent}
        eventTitle={event.title}
      />

      {/* Remove Participant Modal */}
      <ActivityDetailRemoveParticipantModal
        isOpen={showParticipantsModal}
        onClose={() => setShowParticipantsModal(false)}
        attendees={attendees}
        onRemoveParticipant={handleRemoveParticipant}
        isRemoving={isRemovingParticipant}
      />

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default ActivityDetail;
