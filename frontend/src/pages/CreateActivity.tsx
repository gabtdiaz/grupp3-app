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
    imageFile: null as File | null,
    category: 2, // Social som default
    maxParticipants: 10,
    genderRestriction: 1, // Alla som default
    minimumAge: 18,
  });

  // Hämta kategorier vid mount
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

    // Enkel validering
    if (!formData.title.trim()) return setError("Titel är obligatorisk");
    if (!formData.city.trim()) return setError("Plats är obligatorisk");
    if (!formData.startDate || !formData.startTime)
      return setError("Starttid är obligatorisk");

    // Skapa ISO datetime strings
    const startDateTime = `${formData.startDate}T${formData.startTime}:00.000Z`;
    let endDateTime: string | undefined;
    if (formData.endDate && formData.endTime)
      endDateTime = `${formData.endDate}T${formData.endTime}:00.000Z`;

    try {
      setLoading(true);

      // Skapa event först
      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        location: formData.city,
        startDateTime,
        endDateTime,
        categoryId: formData.category,
        maxParticipants: formData.maxParticipants,
        genderRestriction: formData.genderRestriction,
        minimumAge: formData.minimumAge,
      };

      const createdEvent = await eventService.createEvent(eventData);

      // Ladda upp bild om användaren valt en
      if (formData.imageFile) {
        const fd = new FormData();
        fd.append("file", formData.imageFile);
        await eventService.uploadEventImage(createdEvent.id, fd);
      }

      // Navigera tillbaka till feed
      navigate("/activity", {
        state: {
          message: "Aktivitet skapad!",
          type: "success",
        },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Kunde inte skapa aktiviteten. Försök igen.",
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
          <button onClick={() => navigate(-1)} className="text-gray-600">
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
                {cat.name}
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

        {/* Bild URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ladda upp bild (valfri)
          </label>

          {/* Knappen */}
          <button
            type="button"
            onClick={() => document.getElementById("image-upload")?.click()}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 transition"
          >
            Välj bild
          </button>

          {/* Själva file-input, hidden */}
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFormData((prev) => ({
                ...prev,
                imageFile: file,
                imageUrl: URL.createObjectURL(file), // for local preview only
              }));
            }}
            className="hidden"
          />

          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Förhandsvisning"
              className="mt-4 w-32 h-32 rounded-full object-cover mx-auto"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
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
