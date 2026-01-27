import React, { useState } from "react";
import { ActivityDetailHeader } from "../components/activity-detail/ActivityDetailHeader";
import { ActivityDetailHost } from "../components/activity-detail/ActivityDetailHost";
import { ActivityDetailMeta } from "../components/activity-detail/ActivityDetailMeta";
import { ActivityDetailDescription } from "../components/activity-detail/ActivityDetailDescription";
import { ActivityDetailAttendees } from "../components/activity-detail/ActivityDetailAttendees";
import { ActivityDetailJoinButton } from "../components/activity-detail/ActivityDetailJoinButton";
import BottomNav from "../components/layout/BottomNav";

type TabType = "information" | "kommentarer";

export const ActivityDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("information");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = () => {
    setIsJoined(!isJoined);
    console.log(isJoined ? "Left event" : "Joined event");
  };

  return (
    <div className="min-h-screen">
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
              { id: "1", name: "Anna Andersson", imageUrl: "" },
              { id: "2", name: "Björn Bergström", imageUrl: "" },
              { id: "3", name: "Cecilia Carlsson", imageUrl: "" },
              { id: "4", name: "David Danielsson", imageUrl: "" },
              { id: "5", name: "Emma Eriksson", imageUrl: "" },
              { id: "6", name: "Fredrik Fredriksson", imageUrl: "" },
              { id: "7", name: "Gustav Gustafsson", imageUrl: "" },
              { id: "8", name: "Helena Hansson", imageUrl: "" },
              { id: "9", name: "Ivan Ivarsson", imageUrl: "" },
              { id: "10", name: "Julia Johansson", imageUrl: "" },
              { id: "11", name: "Karl Karlsson", imageUrl: "" },
              { id: "12", name: "Lisa Larsson", imageUrl: "" },
            ]}
          />

          {/* Join Button */}
          <div className="fixed bottom-14 left-0 right-0 px-4 z-40">
            <ActivityDetailJoinButton onJoin={handleJoin} isJoined={isJoined} />
          </div>

          <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
            <BottomNav />
          </div>
        </div>
      ) : (
        <div className="px-4 py-6">
          {/* Comments content */}
          <p className="text-gray-500">Comments section...</p>
        </div>
      )}
    </div>
  );
};

export default ActivityDetail;
