import { useNavigate } from "react-router-dom";
import { useMultiStepForm } from "../hooks/useMultiStepForm";
import { useCities } from "../hooks/useCities";
import { TermsModal } from "../components/modals/TermsModal";
import { PrivacyModal } from "../components/modals/PrivacyModal";
import { useState } from "react";

export default function RegisterPage() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const navigate = useNavigate();
  const { cities } = useCities();
  const {
    step,
    formData,
    error,
    isSubmitting,
    fieldErrors,
    handleNext,
    handleBack,
    handleChange,
    handleSubmit,
  } = useMultiStepForm();

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
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.firstName}
                  </p>
                )}
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
                {fieldErrors?.lastName && (
                  <p className="text-red-500 text-sm mb-4 text-center">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
              )}
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
               {error && (
                <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
              )}

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
                  Använd en mix av stora och små bokstäver
                  <br />
                  och siffror
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
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.password}
                  </p>
                )}
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
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
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
                  className="flex-1 bg-[#FF7070] hover:bg-[#DB4949] disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  FORTSÄTT
                </button>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <div className="fixed top-39 left-26 text-center">
                <h1 className="text-4xl font-[Spicy_Rice] text-white">
                  Lite mer om dig
                </h1>
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-2">Stad</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700"
                >
                  <option value="">Välj stad</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.city}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-2">
                  Födelsedatum
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700"
                />
                {fieldErrors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.dateOfBirth}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <label className="block text-gray-600 text-sm mb-2">Kön</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
                >
                  <option value="">Välj</option>
                  <option value="0">Man</option>
                  <option value="1">Kvinna</option>
                  <option value="2">Annat</option>
                </select>
                {fieldErrors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.gender}
                  </p>
                )}
              </div>

              {/* Checkboxes för villkor */}
              <div className="mb-6 space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 accent-[#ffffff]"
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm text-gray-700"
                  >
                    Jag accepterar{" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-[#000000] font-bold hover:underline"
                    >
                      användarvillkoren
                    </button>
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="privacyAccepted"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 accent-[#ffffff]"
                  />
                  <label
                    htmlFor="privacyAccepted"
                    className="text-sm text-gray-700"
                  >
                    Jag accepterar{" "}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="text-[#000000] font-bold hover:underline"
                    >
                      integritetspolicyn
                    </button>
                  </label>
                </div>

                {(!termsAccepted || !privacyAccepted) && error && (
                  <p className="text-red-500 text-sm">
                    Du måste acceptera både användarvillkoren och
                    integritetspolicyn
                  </p>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  TILLBAKA
                </button>

                <button
                  onClick={() => handleSubmit(termsAccepted, privacyAccepted)}
                  disabled={isSubmitting || !termsAccepted || !privacyAccepted}
                  className="flex-1 bg-[#FF7070] hover:bg-[#DB4949] disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  {isSubmitting ? "REGISTRERAR..." : "REGISTRERA"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modaler */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
}
