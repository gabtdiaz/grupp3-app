import React from "react";

interface Attendee {
  id: string;
  name: string;
  imageUrl?: string;
}

interface RemoveParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendees: Attendee[];
  onRemoveParticipant: (userId: string) => void;
  isRemoving: boolean;
}

export const ActivityDetailRemoveParticipantModal: React.FC<
  RemoveParticipantModalProps
> = ({ isOpen, onClose, attendees, onRemoveParticipant, isRemoving }) => {
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setHasAnimated(true);
    } else {
      // Reset when modal closes
      setHasAnimated(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className={`fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-60 max-h-[66vh] overflow-hidden flex flex-col ${!hasAnimated ? "animate-slideUp" : ""}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Deltagare ({attendees.length})
          </h2>
          <button onClick={onClose} className="text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Attendees List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {attendees.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Inga deltagare än</p>
          ) : (
            <div className="space-y-3">
              {attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between py-2"
                >
                  {/* Attendee Info */}
                  <div className="flex items-center gap-3">
                    {attendee.imageUrl ? (
                      <img
                        src={attendee.imageUrl}
                        alt={attendee.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 border-2 border-gray-300" />
                    )}
                    <span className="text-gray-900 font-medium">
                      {attendee.name}
                    </span>
                  </div>
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveParticipant(attendee.id)}
                    disabled={isRemoving}
                    className="px-4 py-2 text-sm font-medium text-red-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isRemoving ? "..." : "Ta bort"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
