interface ActivityCardProps {
  eventId: number;
  title: string;
  description: string;
  participants: number;
  maxParticipants: number;
  imageSrc?: string;
  isFull?: boolean;
  onClick?: () => void;
}

export default function ActivityCard({
  eventId,
  title,
  description,
  participants,
  maxParticipants,
  imageSrc,
  isFull = false,
  onClick,
}: ActivityCardProps) {
  const src =
    imageSrc && imageSrc.trim() !== ""
      ? imageSrc.startsWith("http")
        ? imageSrc
        : `http://localhost:5011/${imageSrc}`
      : `http://localhost:5011/api/events/${eventId}/image`;

  return (
    <div
      className="relative flex items-center gap-4 px-6 py-3 bg-white"
      onClick={onClick}
    >
      <div className="w-18 h-18 rounded-full border-gray-300 shrink-0 overflow-hidden flex items-center justify-center bg-gray-200">
        <img src={src} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>

      <div className="flex items-center gap-1">
        {isFull && (
          <span className="text-red-500 text-xs font-semibold mr-2">FULLT</span>
        )}
        <span className="text-gray-600 text-sm">
          {participants}/{maxParticipants}
        </span>
        <img
          src="/icons/group-icon.svg"
          alt="participants"
          className="w-5 h-5"
        />
      </div>

      {/* Divider */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gray-200" />
    </div>
  );
}
