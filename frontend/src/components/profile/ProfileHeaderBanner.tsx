export default function ProfileHeaderBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-orange-300/90">
      <svg
        className="absolute bottom-0 left-0 h-40 w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,120 C220,40 520,220 820,120 C1120,20 1280,100 1440,140 L1440,220 L0,220 Z"
          fill="#fff"
        />
      </svg>

      <img
        src="/phone-icon.svg"
        alt=""
        aria-hidden="true"
        className="absolute right-6 top-1/2 h-36 w-36 -translate-y-1/2 object-contain"
      />
    </div>
  );
}
