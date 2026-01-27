import React from "react";

interface ActivityDetailMetaProps {
  location: string;
  date: string;
  time: string;
}

export const ActivityDetailMeta: React.FC<ActivityDetailMetaProps> = ({
  location,
  date,
  time,
}) => {
  return (
    <div className="bg-white px-4 py-4 border-b border-gray-100">
      {/* Location */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src="/icons/location-icon.svg"
          alt="Plats"
          className="h-5 w-5 flex-shrink-0"
        />
        <p className="text-sm text-gray-700">{location}</p>
      </div>

      {/* Date and Time */}
      <div className="flex items-start gap-3">
        <img
          src="/icons/calendar-icon.svg"
          alt="Datum och tid"
          className="h-4 w-5 flex-shrink-0"
        />
        <p className="text-sm text-gray-700">
          {date} <span className="mx-1">•</span> {time}
        </p>
      </div>
    </div>
  );
};
