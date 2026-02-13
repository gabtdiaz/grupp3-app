import React from "react";
import { getImageUrl } from "../../api/api";
import { EventImage } from "../common/EventImage";

interface ActivityDetailHeaderProps {
  eventId: number;
  title: string;
  activeTab?: "information" | "kommentarer";
  imageUrl?: string | null;
  onTabChange?: (tab: "information" | "kommentarer") => void;
}

export const ActivityDetailHeader: React.FC<ActivityDetailHeaderProps> = ({
  eventId,
  title,
  imageUrl,
  activeTab = "information",
  onTabChange,
}) => {
  const eventImageUrl = imageUrl
    ? getImageUrl(imageUrl)
    : getImageUrl(`/api/events/${eventId}/image`);

  return (
    <div className="bg-white">
      {/* Title Section */}
      <div className="px-4 pt-6 pb-4 flex flex-col items-center">
        <h1 className="text-center text-2xl">{title}</h1>

        {/* Rund eventbild under rubriken - Använd EventImage-komponenten! */}
        <div className="mt-4">
          <EventImage
            src={eventImageUrl}
            alt={title}
            size="md"
            shape="circle"
            className="!h-28 !w-28 border border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Tabs Section */}

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange?.("information")}
          className={`flex-1 py-3 text-sm font-mediumtransition-all ${
            activeTab === "information" ? "border-b" : "text-gray-400"
          }`}
        >
          INFORMATION
        </button>

        <button
          onClick={() => onTabChange?.("kommentarer")}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === "kommentarer" ? "border-b" : "text-gray-400"
          }`}
        >
          KOMMENTARER
        </button>
      </div>
    </div>
  );
};
