import { useNavigate } from "react-router-dom";
import { BackgroundImage } from "../components/BackgroundImage";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <BackgroundImage />

      <div className="flex justify-center gap-6 absolute bottom-20 left-0 right-0">
        <button
          onClick={() => navigate("/login")}
          className="bg-[#FF7070] hover:bg-[#DB4949] text-white font-bold px-10 py-5 rounded-full transition-colors duration-200 shadow-lg"
        >
          LOGGA IN
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-[#FF7070] hover:bg-[#DB4949] text-white font-bold px-10 py-5 rounded-full transition-colors duration-200 shadow-lg"
        >
          REGISTRERA
        </button>
      </div>
    </>
  );
}
