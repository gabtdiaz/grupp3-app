export default function FilterBar() {
  return (
    <div className="relative flex items-center mt-3 px-6 h-10">
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        <img src="/location-icon.svg" alt="Location" className="w-5 h-5" />

        <select className="text-gray-500 border-none bg-transparent">
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <button className="ml-auto">
        <img src="/filter-icon.svg" alt="Filter" className="w-5 h-5" />
      </button>
    </div>
  );

}

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