import { useState, useEffect } from "react";
import ActivityCategory from "./ActivityCategory";
import { useNavigate } from "react-router-dom";
import categoryService from "../../api/categoryService";
import type Category from "../../api/categoryService";

interface Category {
  id: number;
  name: string;
  displayName: string;
  iconUrl: string;
}

export default function Header() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ BÄTTRE: Använd categoryService
    categoryService
      .getAllCategories()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setError("Kunde inte ladda kategorier");
        setLoading(false);
      });
  }, []);

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

      {/* Title */}
      <div className="absolute top-24 pl-3">
        <h1 className="text-2xl font-futura text-white">AKTIVITETER</h1>
      </div>

      {/* Activity Categories */}
      <div className="mt-auto px-4 pb-4 flex gap-6 justify-center">
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
            />
          ))
        )}
      </div>
    </div>
  );
}
