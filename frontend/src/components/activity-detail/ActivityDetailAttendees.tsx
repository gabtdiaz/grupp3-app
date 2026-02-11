import React from "react";
import { useNavigate } from "react-router-dom";

interface Attendee {
  id: string;
  name: string;
  imageUrl?: string;
}

interface ActivityDetailAttendeesProps {
  attendees: Attendee[];
  isCreator?: boolean;
  onManageClick?: () => void;
}

export const ActivityDetailAttendees: React.FC<
  ActivityDetailAttendeesProps
> = ({ attendees, isCreator = false, onManageClick }) => {
  const navigate = useNavigate();

  const handleAttendeeClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="px-4 py-5 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg text-gray-900">Kommer</h2>

        {/* Manage button for event creator */}
        {isCreator && attendees.length > 0 && (
          <button
            onClick={onManageClick}
            className="text-sm font-medium text-gray-400"
            type="button"
          >
            Hantera
          </button>
        )}
      </div>

      {/* Horizontal scroll row */}
      <div className="overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4">
        <div className="flex items-center gap-2 pb-3">
          {attendees.length === 0 ? (
            <p className="text-gray-500 text-sm">Inga deltagare än</p>
          ) : (
            attendees.map((attendee) => (
              <button
                key={attendee.id}
                onClick={() => handleAttendeeClick(attendee.id)}
                title={attendee.name}
                className="flex-shrink-0"
                type="button"
              >
                {attendee.imageUrl ? (
                  <img
                    src={attendee.imageUrl}
                    alt={attendee.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gray-200 border-2 border-gray-300" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailAttendees;
