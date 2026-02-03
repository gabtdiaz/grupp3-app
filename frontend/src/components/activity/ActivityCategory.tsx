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
        w-18 h-18
        flex flex-col items-center justify-center
        rounded-md
        shadow-md
        transition-all duration-200
        ${
          isSelected
            ? "bg-indigo-600 scale-105 shadow-lg"
            : "bg-white hover:bg-gray-50 hover:scale-102"
        }
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
        className={`text-sm font-futura transition-colors duration-200 ${
          isSelected ? "text-white font-semibold" : "text-gray-800"
        }`}
      >
        {name}
      </span>{" "}
    </button>
  );
}
