import { useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import ActivityCategory from "./ActivityCategory";
import ActivityHeaderBanner from "./ActivityHeaderBanner";
import ActivitySearchBar from "./ActivitySearchBar";

interface ActivityHeaderProps {
  selectedCategoryId: number | null;
  onCategoryClick: (categoryId: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ActivityHeader({
  selectedCategoryId,
  onCategoryClick,
  searchQuery,
  onSearchChange,
}: ActivityHeaderProps) {
  const { categories, loading, error } = useCategories();
  const navigate = useNavigate();

  return (
    <div className="relative h-56 bg-[#faf4ee]">
      <ActivityHeaderBanner />

      <div className="relative z-10 flex h-full flex-col">
        {/* Title + create button */}
        <div className="flex items-center justify-between px-6 pt-7">
          <h1 className="text-2xl text-white flex font-bold">AKTIVITETER</h1>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-xs"
            onClick={() => navigate("/activity/create")}
          >
            <img
              src="/icons/create-event-icon.svg"
              alt="Create event"
              className="h-6 w-6"
            />
          </button>
        </div>

        <ActivitySearchBar value={searchQuery} onChange={onSearchChange} />

        {/* Categories — pushed to bottom of the banner */}
        <div className="mt-auto overflow-x-auto overflow-y-hidden px-4 pb-5">
          <div className="flex min-w-max gap-6">
            {loading ? (
              <p className="text-white">Laddar kategorier...</p>
            ) : error ? (
              <p className="text-white">{error}</p>
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
    </div>
  );
}
