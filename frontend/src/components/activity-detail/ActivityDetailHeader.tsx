import React from "react";

interface ActivityDetailHeaderProps {
  title: string;
  activeTab?: "information" | "kommentarer";
  onTabChange?: (tab: "information" | "kommentarer") => void;
}

export const ActivityDetailHeader: React.FC<ActivityDetailHeaderProps> = ({
  title,
  activeTab = "information",
  onTabChange,
}) => {
  return (
    <div className="bg-white">
      {/* Title Section */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-center font-futura text-2xl">{title}</h1>
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
