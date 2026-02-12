import { useNavigate, useLocation } from "react-router-dom";

const WAVES = [
  {
    color: "#f5e9dc",
    path: "M0,6 C60,0 120,14 200,6 C275,0 330,10 390,4 L390,24 L0,24 Z",
    top: -16,
  },
  {
    color: "#ead8c5",
    path: "M0,10 C70,2 150,18 230,8 C300,0 350,12 390,8 L390,24 L0,24 Z",
    top: -14,
  },
  {
    color: "#dfc6ad",
    path: "M0,14 C80,4 170,22 260,12 C330,4 365,16 390,12 L390,24 L0,24 Z",
    top: -12,
  },
];

const TABS = [
  {
    id: "activity",
    route: "/activity",
    label: "Activity",
    icon: "/icons/activity-icon.svg",
  },
  {
    id: "profile",
    route: "/profile",
    label: "Profile",
    icon: "/icons/profile-icon.svg",
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="relative flex h-full w-full bg-[#dfc6ad]">
      <style>{`
        @keyframes dotBounce {
          0%   { transform: translateY(0) scaleX(1); }
          30%  { transform: translateY(-6px) scaleX(0.8); }
          60%  { transform: translateY(1px) scaleX(1.2); }
          80%  { transform: translateY(-2px) scaleX(0.95); }
          100% { transform: translateY(0) scaleX(1); }
        }
        @keyframes iconPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35) rotate(-8deg); }
          70%  { transform: scale(0.95) rotate(4deg); }
          100% { transform: scale(1.1) rotate(0deg); }
        }
      `}</style>

      {WAVES.map((wave, i) => (
        <svg
          key={i}
          className="absolute left-0 w-full h-6 pointer-events-none"
          style={{ top: wave.top }}
          viewBox="0 0 390 24"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={wave.path} fill={wave.color} />
        </svg>
      ))}

      {TABS.map((tab) => {
        const isActive = location.pathname === tab.route;
        return (
          <button
            key={tab.id}
            className="flex-1 flex flex-col items-center justify-center gap-1 relative"
            onClick={() => navigate(tab.route)}
          >
            {/* Icon wrapper — animation applied here, not on the img */}
            <div
              style={{
                animation: isActive ? "iconPop 0.45s ease forwards" : "none",
                opacity: isActive ? 1 : 0.5,
                transition: "opacity 0.3s ease",
              }}
            >
              <img src={tab.icon} alt={tab.label} className="w-4 h-4" />
            </div>

            {/* Bouncing dot indicator */}
            <div
              style={{
                width: isActive ? 6 : 4,
                height: isActive ? 6 : 4,
                borderRadius: "50%",
                background: isActive ? "#4f3c28" : "transparent",
                animation: isActive
                  ? "dotBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                  : "none",
                transition: "background 0.3s, width 0.3s, height 0.3s",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
