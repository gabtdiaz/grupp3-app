import React, { useState, useEffect, useRef } from "react";
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

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
}
const FieldRow: React.FC<FieldRowProps> = ({ label, children }) => (
  <div className="px-4 py-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}
const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="space-y-3">
    <h2 className="text-lg font-semibold">{title}</h2>
    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
      {children}
    </div>
  </div>
);

export default function CreateActivity() {
  const navigate = useNavigate();
  const { cities } = useCities();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    imageUrl: "",
    imageFile: null as File | null,
    category: 2,
    maxParticipants: 10,
    genderRestriction: 1,
    useAgeRestriction: false,
    minimumAge: { min: 18, max: 100 },
  });

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
        name === "genderRestriction"
          ? parseInt(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) return setError("Titel är obligatorisk");
    if (!formData.city.trim()) return setError("Plats är obligatorisk");
    if (!formData.startDate || !formData.startTime)
      return setError("Starttid är obligatorisk");

    const startDateTime = `${formData.startDate}T${formData.startTime}:00.000Z`;
    let endDateTime: string | undefined;
    if (formData.endDate && formData.endTime)
      endDateTime = `${formData.endDate}T${formData.endTime}:00.000Z`;

    try {
      setLoading(true);

      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        location: formData.city,
        startDateTime,
        endDateTime,
        categoryId: formData.category,
        maxParticipants: formData.maxParticipants,
        genderRestriction: formData.genderRestriction,
        minimumAge: formData.useAgeRestriction ? formData.minimumAge.min : 18,
      };

      const createdEvent = await eventService.createEvent(eventData);

      if (formData.imageFile) {
        const fd = new FormData();
        fd.append("file", formData.imageFile);
        await eventService.uploadEventImage(createdEvent.id, fd);
      }

      navigate("/activity", {
        state: { message: "Aktivitet skapad!", type: "success" },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Kunde inte skapa aktiviteten. Försök igen.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 px-6 py-5" />

      <form onSubmit={handleSubmit} className="px-4 py-6 pb-16 space-y-6">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Image */}
        <div className="flex flex-col items-center pt-1">
          <div className="relative">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center"
            >
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Aktivitetsbild"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-light-green border-2 border-white flex items-center justify-center shadow"
            >
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Info */}
        <Section title="Grundinfo">
          <FieldRow label="Titel *">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="T.ex. Brädspelskväll!"
              className={inputCls}
              required
            />
          </FieldRow>

          <FieldRow label="Beskrivning">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Beskriv din aktivitet..."
              rows={3}
              className={inputCls}
            />
          </FieldRow>

          <FieldRow label="Kategori *">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputCls}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FieldRow>
        </Section>

        {/* Location */}
        <Section title="Plats">
          <FieldRow label="Stad *">
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputCls}
              required
            >
              <option value="">Välj stad</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </FieldRow>
        </Section>

        {/* Time */}
        <Section title="Tid">
          <FieldRow label="Starttid *">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={inputCls}
                required
              />
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={inputCls}
                required
              />
            </div>
          </FieldRow>

          <FieldRow label="Sluttid (valfri)">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={inputCls}
              />
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </FieldRow>
        </Section>

        {/* Participants  */}
        <Section title="Deltagare">
          <FieldRow label="Max antal deltagare *">
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="2"
              max="1000"
              className={inputCls}
              required
            />
          </FieldRow>

          <FieldRow label="Könsrestriktion">
            <select
              name="genderRestriction"
              value={formData.genderRestriction}
              onChange={handleChange}
              className={inputCls}
            >
              {genderRestrictions.map((gr) => (
                <option key={gr.value} value={gr.value}>
                  {gr.label}
                </option>
              ))}
            </select>
          </FieldRow>

          {/* Age restriction toggle + range */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Åldersintervall
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-500">
                <span>Använd</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.useAgeRestriction}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      useAgeRestriction: !prev.useAgeRestriction,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    formData.useAgeRestriction
                      ? "bg-light-green"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      formData.useAgeRestriction
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
            </div>

            <p
              className={`text-sm mb-3 ${
                formData.useAgeRestriction ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {formData.useAgeRestriction
                ? `Minimiålder: ${formData.minimumAge.min} år`
                : "Aktivera för att välja minimiålder"}
            </p>

            <div
              className={`space-y-2 transition-opacity ${
                formData.useAgeRestriction
                  ? "opacity-100"
                  : "opacity-40 pointer-events-none"
              }`}
            >
              <input
                type="range"
                min="18"
                max="100"
                value={formData.minimumAge.min}
                disabled={!formData.useAgeRestriction}
                onChange={(e) => {
                  const nextMin = parseInt(e.target.value, 10);
                  setFormData((prev) => ({
                    ...prev,
                    minimumAge: { ...prev.minimumAge, min: nextMin },
                  }));
                }}
                className="w-full accent-light-green"
              />
            </div>
          </div>
        </Section>

        {/* Submit  */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white text-sm transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-light-green"
          }`}
        >
          {loading ? "Skapar..." : "Skapa aktivitet"}
        </button>
      </form>

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
