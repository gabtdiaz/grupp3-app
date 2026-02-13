import { useNavigate } from "react-router-dom";
import { BackgroundImage } from "../components/ui/BackgroundImage";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 relative min-h-0">
      <BackgroundImage />
      <div className="flex-1" />
      <div
        className="flex justify-center gap-4 w-full px-6"
        style={{
          paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))",
        }}
      >
        <button
          onClick={() => navigate("/login")}
          className="flex-1 max-w-40 bg-red-400 text-white  rounded-full transition-colors duration-200 shadow-lg active:bg-red-500"
          style={{
            padding: "clamp(0.75rem, 3.5vw, 1.25rem) clamp(1rem, 5vw, 2.5rem)",
            fontSize: "clamp(0.8rem, 3.5vw, 1rem)",
          }}
        >
          LOGGA IN
        </button>
        <button
          onClick={() => navigate("/register")}
          className="flex-1 max-w-40 bg-red-400 text-white rounded-full transition-colors duration-200 shadow-lg active:bg-red-500"
          style={{
            padding: "clamp(0.75rem, 3.5vw, 1.25rem) clamp(1rem, 5vw, 2.5rem)",
            fontSize: "clamp(0.8rem, 3.5vw, 1rem)",
          }}
        >
          REGISTRERA
        </button>
      </div>
    </div>
  );
}
