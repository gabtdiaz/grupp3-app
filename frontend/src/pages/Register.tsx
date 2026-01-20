import { useNavigate } from "react-router-dom";
import { useMultiStepForm } from "../hooks/useMultiStepForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { step, formData, handleNext, handleBack, handleChange, handleSubmit } =
    useMultiStepForm();

  return (
    <>
      <div
        className="fixed inset-0 -z-10 bg-no-repeat"
        style={{
          backgroundImage: `url("/login-background.png")`,
          backgroundSize: "26rem",
        }}
      />

      <div className="flex items-center min-h-screen pt-20">
        <div className="bg-white rounded-3xl p-8 w-full">
          {step === 1 && (
            <>
              <div className="fixed top-39 left-26 text-center">
                <h1 className="text-4xl font-[Spicy_Rice] text-white">
                  Vad heter du?
                </h1>
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-2">
                  Ditt förnamn
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700"
                />
              </div>

              <div className="mb-8">
                <label className="block text-gray-600 text-sm mb-2">
                  Ditt efternamn
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  AVBRYT
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#FF7070] hover:bg-[#DB4949] text-white font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  FORTSÄTT
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="fixed top-39 left-26 text-center">
                <h1 className="text-4xl font-[Spicy_Rice] text-white">
                  Och din e-post
                </h1>
              </div>

              <div className="mb-8 py-3">
                <label className="block text-gray-600 text-sm mb-2">
                  Din e-postadress
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  TILLBAKA
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#FF7070] hover:bg-[#DB4949] text-white font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  FORTSÄTT
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="fixed top-30 left-6 text-center">
                <h1 className="text-4xl font-[Spicy_Rice] text-white">
                  Välj ett lösenord
                </h1>
              </div>

              <div className="fixed top-45 left-17 text-center">
                <h1 className="font-[Spicy_Rice] text-white">
                  Ett starkt lösenord gör ditt konto extra säkert
                </h1>
              </div>

              <div className="fixed top-55 left-7">
                <h1 className="font-[Spicy_Rice] text-white">
                  Använd gärna en mix av stora och små bokstäver, <br />
                  siffror och specialtecken
                </h1>
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-2">
                  Ditt lösenord
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700"
                />
              </div>

              <div className="mb-8">
                <label className="block text-gray-600 text-sm mb-2">
                  Repetera lösenord
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  TILLBAKA
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#FF7070] hover:bg-[#DB4949] text-white font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  REGISTRERA
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
