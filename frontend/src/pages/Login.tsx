import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/"); // eller /events, /profile etc
    } catch (err) {
      setError("Fel e-postadress eller lösenord.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div
        className="fixed inset-0 -z-5 bg-no-repeat"
        style={{
          backgroundImage: `url("/logo-black.png")`,
          backgroundSize: "20rem",
          backgroundPosition: "top 2rem center",
        }}
      />

      <div
        className="fixed inset-0 -z-10 bg-no-repeat"
        style={{
          backgroundImage: `url("/login-background.png")`,
          backgroundSize: "26rem",
        }}
      />

      <div className="flex items-center min-h-screen pt-20">
        <div className="bg-white rounded-3xl p-8 w-full">
          <div className="mb-6">
            <label className="block text-gray-600 text-sm">E-postadress:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 text-sm">Lösenord:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700"
            />
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200"
            >
              AVBRYT
            </button>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-[#FF7070] hover:bg-[#DB4949] text-white font-bold py-4 rounded-full transition-colors duration-200"
            >
              LOGGA IN
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
