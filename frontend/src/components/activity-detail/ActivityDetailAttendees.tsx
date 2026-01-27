import React from "react";

interface Attendee {
  id: string;
  name: string;
  imageUrl?: string;
}

interface ActivityDetailAttendeesProps {
  attendees: Attendee[];
}

export const ActivityDetailAttendees: React.FC<
  ActivityDetailAttendeesProps
> = ({ attendees }) => {
  return (
    <div className="px-4 py-5 border-b border-gray-100">
      <h2 className="text-lg text-gray-900 mb-2">Kommer</h2>

      {/* Horizontal scroll row */}
      <div className="overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4">
        <div className="flex items-center gap-2 pb-3">
          {attendees.map((attendee) => (
            <div key={attendee.id} title={attendee.name}>
              {attendee.imageUrl ? (
                <img
                  src={attendee.imageUrl}
                  alt={attendee.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="h-10 w-10 rounded-full border-2 border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
