import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const WAVES = [
  {
    color: "#fde3c8",
    path: "M0,20 C100,5 200,35 320,18 C400,8 480,28 560,20 L560,50 L0,50 Z",
    bottom: 52,
  },
  {
    color: "#f9c89a",
    path: "M0,26 C90,10 210,40 330,22 C420,10 490,32 560,24 L560,50 L0,50 Z",
    bottom: 36,
  },
  {
    color: "#f0a96e",
    path: "M0,30 C110,14 220,44 350,26 C430,14 500,34 560,28 L560,50 L0,50 Z",
    bottom: 20,
  },
  {
    color: "#e8933a",
    path: "M0,34 C120,18 230,46 360,30 C440,18 508,38 560,32 L560,50 L0,50 Z",
    bottom: 4,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/activity");
    } catch (err) {
      setError("Fel e-postadress eller lösenord.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Wave Section */}
      <div className="relative h-82 w-full overflow-hidden bg-orange-300/90 shrink-0 -mb-1">
        <img
          src="/logo-black.png"
          alt="Logo"
          className="absolute left-1/2 top-1/2 h-50  w-auto -translate-x-1/2 -translate-y-1/2"
        />

        {WAVES.map((wave, i) => (
          <svg
            key={i}
            className="absolute left-0 w-full"
            style={{ bottom: wave.bottom, height: 52 }}
            viewBox="0 0 560 50"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={wave.path} fill={wave.color} />
          </svg>
        ))}

        {/* Final connecting wave */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: 52 }}
          viewBox="0 0 560 50"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,28 C130,10 260,46 390,28 C460,18 520,36 560,28 L560,50 L0,50 Z"
            fill="#faf4ee"
          />
        </svg>
      </div>

      {/* Form Section */}
      <div className="flex items-start bg-[#faf4ee] pt-6 min-h-screen">
        <div className="bg-[#faf4ee]  px-8 w-full mx-3">
          {/* Email */}
          <div className="mb-6">
            <label className="block text-gray-600 text-sm">E-postadress:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              disabled={loading}
              className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 disabled:opacity-60 bg-transparent"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-600 text-sm">Lösenord:</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                disabled={loading}
                className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 pr-10 disabled:opacity-60 bg-transparent"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-0 top-1/2 -translate-y-1/2 pr-1"
              >
                <img
                  src={
                    showPassword
                      ? "/icons/eye-icon.svg"
                      : "/icons/eye-hidden-icon.svg"
                  }
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="w-5 h-5 opacity-70 transition-opacity"
                />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 text-red-600 text-sm text-center">{error}</div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200 disabled:opacity-60"
            >
              AVBRYT
            </button>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-light-green text-white font-bold py-4 rounded-full transition-colors duration-200 disabled:opacity-60"
            >
              {loading ? "Loggar in..." : "LOGGA IN"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
