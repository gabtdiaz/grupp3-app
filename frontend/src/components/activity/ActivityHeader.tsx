import ActivityCategory from "./ActivityCategory";

export default function Header() {
  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Create button */}
      <div className="absolute top-10 right-7 z-10">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
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
      <div className="mt-auto px-4 pb-4 flex gap-6 justify-center align-center">
        <ActivityCategory name="RÖRELSE" icon="/icons/sport-icon.svg" />
        <ActivityCategory name="SOCIALT" icon="/icons/social-icon.svg" />
        <ActivityCategory name="SPEL" icon="/icons/games-icon.svg" />
        <ActivityCategory name="KULTUR" icon="/icons/culture-icon.svg" />
      </div>
    </div>
  );
}
