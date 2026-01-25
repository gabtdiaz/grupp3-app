export default function Footer() {
  return (
    <div
      className="flex h-full w-full bg-cover"
      style={{
        backgroundImage: "url('/footer-background.png')",
      }}
    >
      <button className="flex-1 flex items-center justify-center">
        <img src="/icons/calendar-icon.svg" alt="Calendar" className="w-5 h-5" />
      </button>

      <button className="flex-1 flex items-center justify-center">
        <img
          src="/icons/notification-icon.svg"
          alt="Notifications"
          className="w-6 h-6"
        />
      </button>

      <button className="flex-1 flex items-center justify-center">
        <img src="/icons/profile-icon.svg" alt="Profile" className="w-5 h-5" />
      </button>
    </div>
  );
}
