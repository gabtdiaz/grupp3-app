interface ActivityCategoryProps {
  name: string;
  icon: string;
  onClick?: () => void;
}

export default function ActivityCategory({
  name,
  icon,
  onClick,
}: ActivityCategoryProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-18 h-18
        flex flex-col items-center justify-center
        rounded-md
        bg-white
        shadow-md
      "
    >
      <img src={icon} alt={name} className="w-6 h-6 mb-1" />

      <span className="text-sm font-futura">{name}</span>
    </button>
  );
}
