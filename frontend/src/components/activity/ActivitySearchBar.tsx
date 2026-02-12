interface ActivitySearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ActivitySearchBar({
  value,
  onChange,
}: ActivitySearchBarProps) {
  return (
    <div className="px-4 pt-5">
      <div className="relative flex h-10 w-full rounded-full bg-white/20 p-0.5">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Sök aktiviteter..."
          className="flex-1 rounded-full bg-white px-4 text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
        <div className="flex h-8 w-8 shrink-0 items-center justify-center">
          <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
