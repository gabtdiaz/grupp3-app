// ActivityCategory.tsx
interface ActivityCategoryProps {
  name: string;
  icon: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ActivityCategory({
  name,
  icon,
  isSelected = false,
  onClick,
}: ActivityCategoryProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-17 h-17
        flex flex-col items-center justify-center
        rounded-md
        shadow-md
        transition-all duration-200
        ${isSelected ? "bg-light-green shadow-sm" : "bg-white"}
      `}
    >
      <img
        src={icon}
        alt={name}
        className={`w-6 h-6 mb-1 transition-all duration-200 ${
          isSelected ? "brightness-0 invert" : ""
        }`}
      />
      <span
        className={`text-xs font-bold  transition-colors duration-200 ${
          isSelected ? "text-white font-semibold" : ""
        }`}
      >
        {name}
      </span>
    </button>
  );
}
