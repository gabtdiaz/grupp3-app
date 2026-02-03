import ActivityCategory from "./ActivityCategory";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

interface ActivityHeaderProps {
  selectedCategoryId: number | null;
  onCategoryClick: (categoryId: number) => void;
}

export default function Header({
  selectedCategoryId,
  onCategoryClick,
}: ActivityHeaderProps) {
  const { categories, loading, error } = useCategories();
  const navigate = useNavigate();

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Create button */}
      <div className="absolute top-10 right-7 z-10">
        <button
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md"
          onClick={() => navigate("/activity/create")}
        >
          <img
            src="/icons/create-event-icon.svg"
            alt="Create event"
            className="w-7 h-7"
          />
        </button>
      </div>

      {/* Title  */}
      <div className="absolute top-24 pl-3">
        <h1 className="text-2xl font-futura text-white">AKTIVITETER</h1>
      </div>

      {/* Activity Categories */}
      <div className="mt-auto px-4 pb-4 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 min-w-max">
          {loading ? (
            <p className="text-white">Laddar kategorier...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            categories.map((category) => (
              <ActivityCategory
                key={category.id}
                name={category.displayName}
                icon={category.iconUrl}
                isSelected={selectedCategoryId === category.id}
                onClick={() => onCategoryClick(category.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
