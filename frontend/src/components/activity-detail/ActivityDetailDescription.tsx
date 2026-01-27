import React, { useState } from "react";

interface ActivityDetailDescriptionProps {
  description: string;
  previewLength?: number;
}

export const ActivityDetailDescription: React.FC<
  ActivityDetailDescriptionProps
> = ({ description, previewLength = 200 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldShowToggle = description.length > previewLength;
  const displayText =
    isExpanded || !shouldShowToggle
      ? description
      : description.slice(0, previewLength);

  return (
    <div className="px-4 py-3 border-b border-gray-100">
      {/* Title */}
      <h2 className="text-lg text-gray-900 mb-2">Beskrivning</h2>

      {/* Description Text */}
      <div className="text-sm text-gray-700 whitespace-pre-wrap">
        {displayText}
        {!isExpanded && shouldShowToggle && "..."}
      </div>

      {/* Toggle Button */}
      {shouldShowToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-900 underline"
        >
          {isExpanded ? "visa mindre..." : "visa mer..."}
        </button>
      )}
    </div>
  );
};
