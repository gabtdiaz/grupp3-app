// ActivityHeader.tsx
import ActivityCategory from "./ActivityCategory";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

interface ActivityHeaderProps {
  selectedCategoryId: number | null;
  onCategoryClick: (categoryId: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  selectedCategoryId,
  onCategoryClick,
  searchQuery,
  onSearchChange,
}: ActivityHeaderProps) {
  const { categories, loading, error } = useCategories();
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Top section with title and create button */}
      <div className="flex items-center justify-between px-6 pt-10">
        <h1 className="font-futura text-2xl text-white">AKTIVITETER</h1>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
          onClick={() => navigate("/activity/create")}
        >
          <img
            src="/icons/create-event-icon.svg"
            alt="Create event"
            className="h-7 w-7"
          />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-6 pt-13">
        <div className="relative flex h-9 w-full rounded-full bg-white/20 p-0.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Sök aktiviteter..."
            className="flex-1 rounded-full bg-white px-4 text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <img
              src="/icons/search-icon.svg"
              alt="Search"
              className="h-4 w-4"
            />
          </div>
        </div>
      </div>

      {/* Activity Categories */}
      <div className="mt-auto overflow-x-auto overflow-y-hidden px-4 pb-4">
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
  );
}
