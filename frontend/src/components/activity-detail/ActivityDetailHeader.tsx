import React from "react";

interface ActivityDetailHeaderProps {
  title: string;
  activeTab?: "information" | "kommentarer";
  onTabChange?: (tab: "information" | "kommentarer") => void;
  imageUrl?: string | null; 
}

export const ActivityDetailHeader: React.FC<ActivityDetailHeaderProps> = ({
  title,
  imageUrl,
  activeTab = "information",
  onTabChange,
}) => {
  return (
    <div className="bg-white">
      {/* Title Section */}
      <div className="px-4 pt-6 pb-4 flex flex-col items-center">
        <h1 className="text-center font-futura text-2xl">{title}</h1>

        {/* 🔹 Rund eventbild under rubriken */}
        <div className="mt-4 w-30 h-30 flex items-center justify-center bg-white rounded-full overflow-hidden border border-gray-200">
          {imageUrl ? (
            <img
              src={imageUrl.startsWith("http") ? imageUrl : `http://localhost:5011/${imageUrl}`}
              alt={title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-white text-gray-700 font-bold text-4xl border border-gray-200">
              {title.charAt(0).toUpperCase()}
            </div>
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
