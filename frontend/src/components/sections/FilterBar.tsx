const cities = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Västerås",
  "Örebro",
  "Linköping",
  "Helsingborg",
  "Jönköping",
  "Lund",
];

export default function FilterBar() {
  return (
    <div className="relative flex items-center justify-content-between h-full">
      
      {/* Centered location selector */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        <img src="/icons/location-icon.svg" alt="Location" className="w-5 h-5" />

        <select className="text-gray-500 border-none bg-transparent focus:outline-none">
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Right-aligned filter button */}
      <button className="ml-auto">
        <img src="/icons/filter-icon.svg" alt="Filter" className="w-5 h-5" />
      </button>
    </div>
  );
}
