export default function ActivityHeaderBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-orange-300/90">
      <svg
        className="absolute bottom-0 left-0 h-40 w-full"
        viewBox="0 0 1440 143"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,143 C360,130 1080,150 1440,140 L1440,220 SSSSS L0,220 Z"
          fill="#fff"
        />
      </svg>
    </div>
  );
}
