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

  const handleJoin = () => {
    setIsJoined(!isJoined);
    console.log(isJoined ? "Left event" : "Joined event");
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
      // Add as top-level comment
      setComments((prevComments) => [...prevComments, newComment]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with title and tabs */}
      <ActivityDetailHeader
        title="Brädspelskväll!! D&D"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content Area */}
      {activeTab === "information" ? (
        <div>
          {/* Host Section */}
          <ActivityDetailHost
            hostName="Benjamin B."
            hostRole="Arrangör"
            hostImageUrl=""
          />

          {/* Meta Information */}
          <ActivityDetailMeta
            location="Brogatan 11, 211 44 Malmö"
            date="Mån, 14 januari"
            time="16:00 - 20:00"
          />

          {/* Description */}
          <ActivityDetailDescription
            description="Vivamus nulla risus, aliquet sed lacus in, tempus convallis erat.
Curabitur non felis ut magna placerat viverra. Donec sit amet leo id sapien varius commodo.
Aliquam erat volutpat. Sed ut risus in libero facilisis luctus.

apien varius commodo.
Aliquam erat volutpat. Sed ut risus in libero facilisis luctus."
          />

          {/* Attendees */}
          <ActivityDetailAttendees
            attendees={[
              { id: "1", name: "Anna A.", imageUrl: "" },
              { id: "2", name: "Björn B.", imageUrl: "" },
              { id: "3", name: "Cecilia C.", imageUrl: "" },
              { id: "4", name: "David D.", imageUrl: "" },
              { id: "5", name: "Emma E.", imageUrl: "" },
              { id: "6", name: "Fredrik F.", imageUrl: "" },
              { id: "7", name: "Gustav G.", imageUrl: "" },
              { id: "8", name: "Helena H.", imageUrl: "" },
              { id: "9", name: "Ivan I.", imageUrl: "" },
              { id: "10", name: "Julia J.", imageUrl: "" },
              { id: "11", name: "Karl K.", imageUrl: "" },
              { id: "12", name: "Lisa L.", imageUrl: "" },
            ]}
          />

          {/* Join Button */}
          <div className="fixed bottom-14 left-0 right-0 px-4 z-40">
            <ActivityDetailJoinButton onJoin={handleJoin} isJoined={isJoined} />
          </div>
        </div>
      ) : (
        <ActivityDetailComments
          activityId="123"
          comments={comments}
          onAddComment={handleAddComment}
          hostId="host_benjamin"
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default ActivityDetail;
