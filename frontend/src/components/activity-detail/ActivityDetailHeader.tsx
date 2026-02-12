import React from "react";

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
  const src = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${window.location.origin}/${imageUrl}`
    : `http://localhost:5011/api/events/${eventId}/image`;

  return (
    <div className="bg-white">
      {/* Title Section */}
      <div className="px-4 pt-6 pb-4 flex flex-col items-center">
        <h1 className="text-center text-2xl">{title}</h1>

        {/* Rund eventbild under rubriken */}
        <div className="w-28 h-28 flex items-center justify-center rounded-full border border-gray-300 bg-white overflow-hidden shadow-sm">
          {src ? (
            <img
              src={src}
              alt={title}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  parent.innerHTML = `<span style="font-size:36px; font-weight:600; color:#555;">${title.charAt(0).toUpperCase()}</span>`;
                }
              }}
            />
          ) : (
            <span className="text-gray-500 text-4xl font-semibold">
              {title.charAt(0).toUpperCase()}
            </span>
          )}
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
            activeTab === "kommentarer"
              ? "border-b"
              : "text-gray-400"
          }`}
        >
          KOMMENTARER
        </button>
      </div>
    </div>
  );
};
