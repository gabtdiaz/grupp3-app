export default function Footer() {
  return (
    <div
      className="flex fixed bottom-0 left-0 right-0 h-10 bg-cover"
      style={{
        backgroundImage: "url('/footer-background.png')",
      }}
    >
      <button className="flex-1 flex items-center justify-center">
        <img src="/calendar-icon.svg" alt="Calendar" className="w-5 h-5" />
      </button>
      <button className="flex-1 flex items-center justify-center">
        <img src="/notification-icon.svg" alt="Filter" className="w-6 h-6" />
      </button>
      <button className="flex-1 flex items-center justify-center">
        <img src="/profile-icon.svg" alt="Filter" className="w-5 h-5" />
      </button>
    </div>
  );
}