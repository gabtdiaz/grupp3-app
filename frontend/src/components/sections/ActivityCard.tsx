interface ActivityCardProps {
  title: string;
  description: string;
  participants: number;
  imageSrc?: string;
  onClick?: () => void;
}

export default function ActivityCard({
  title,
  description,
  participants,
  imageSrc,
  onClick,
}: ActivityCardProps) {
  return (
    <div
      className="relative flex items-center gap-4 px-6 py-3 bg-white"
      onClick={onClick}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="w-18 h-18 rounded-full object-cover border shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <h3 className="font-futura text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-gray-600 text-sm">{participants}</span>
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
