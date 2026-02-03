import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eventService from "../api/eventService";
import categoryService from "../api/categoryService";
import { type Category } from "../api/categoryService";
import { useCities } from "../hooks/useCities";
import BottomNav from "../components/layout/BottomNav";

const genderRestrictions = [
  { value: 1, label: "Alla" },
  { value: 2, label: "Endast män" },
  { value: 3, label: "Endast kvinnor" },
];

export default function CreateActivity() {
  const navigate = useNavigate();
  const { cities } = useCities();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    imageUrl: "",
    category: 2, // Social som default
    maxParticipants: 10,
    genderRestriction: 1, // Alla som default
    minimumAge: 18,
  });

  // HÄMTA KATEGORIER VID MOUNT
  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((cats) => setCategories(cats))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "category" ||
        name === "maxParticipants" ||
        name === "genderRestriction" ||
        name === "minimumAge"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validering
    if (!formData.title.trim()) {
      setError("Titel är obligatorisk");
      return;
    }
    if (!formData.city.trim()) {
      setError("Plats är obligatorisk");
      return;
    }
    if (!formData.startDate || !formData.startTime) {
      setError("Starttid är obligatorisk");
      return;
    }

    // Skapa ISO datetime strings
    const startDateTime = `${formData.startDate}T${formData.startTime}:00.000Z`;
    let endDateTime: string | undefined;

    if (formData.endDate && formData.endTime) {
      endDateTime = `${formData.endDate}T${formData.endTime}:00.000Z`;
    }

    try {
      setLoading(true);

      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        location: formData.city,
        startDateTime,
        endDateTime,
        imageUrl: formData.imageUrl || undefined,
        categoryId: formData.category,
        maxParticipants: formData.maxParticipants,
        genderRestriction: formData.genderRestriction,
        minimumAge: formData.minimumAge,
      };

      await eventService.createEvent(eventData);

      // Success! Gå till activity feed
      navigate("/activity");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Kunde inte skapa activity. Försök igen.",
      );
      console.error("Error creating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Tillbaka
          </button>
          <h1 className="text-xl font-semibold">Skapa Activity</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Titel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titel *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="T.ex. Brädspelskväll!"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Beskrivning */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beskrivning
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Beskriv din activity..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Plats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plats *
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Välj stad</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <select />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Starttid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Starttid *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Sluttid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sluttid (valfri)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Max deltagare */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max antal deltagare *
          </label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min="2"
            max="1000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Könsrestriktion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Könsrestriktion
          </label>
          <select
            name="genderRestriction"
            value={formData.genderRestriction}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {genderRestrictions.map((gr) => (
              <option key={gr.value} value={gr.value}>
                {gr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Minimiålder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimiålder
          </label>
          <input
            type="number"
            name="minimumAge"
            value={formData.minimumAge}
            onChange={handleChange}
            min="18"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bild URL (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bild URL (valfri)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Skapar..." : "Skapa Activity"}
        </button>
      </form>

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
