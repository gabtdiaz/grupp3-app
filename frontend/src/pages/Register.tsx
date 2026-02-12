import { useNavigate } from "react-router-dom";
import { useMultiStepForm } from "../hooks/useMultiStepForm";
import { useCities } from "../hooks/useCities";
import { TermsModal } from "../components/modals/TermsModal";
import { PrivacyModal } from "../components/modals/PrivacyModal";
import { useState } from "react";

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

const STEP_TITLES: Record<number, { title: string; subtitle?: string }> = {
  1: { title: "Vad heter du?" },
  2: { title: "Och din e-post" },
  3: {
    title: "Välj ett lösenord",
    subtitle: "En mix av stora/små bokstäver och siffror gör det extra säkert",
  },
  4: { title: "Lite mer om dig" },
};

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

  const { title, subtitle } = STEP_TITLES[step] ?? { title: "" };

  return (
    <>
      {/* ── Wave header ── */}
      <div className="relative h-82 w-full overflow-hidden bg-orange-300/90 shrink-0 -mb-1">
        {/* Step title */}
        <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-6 text-center">
          <h1 className="text-3xl font-[Spicy_Rice] text-white">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm font-[Spicy_Rice] text-white/80">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mountain waves */}
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

        {/* Final cream wave */}
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

      {/* ── Form section ── */}
      <div className="flex items-start bg-[#faf4ee] pt-6 min-h-screen">
        <div className="bg-[#faf4ee] px-8 w-full mx-3">
          {step === 1 && (
            <>
              <div className="mb-6">
                <label className="block text-gray-600 text-sm ">
                  Ditt förnamn
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
                />
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm">
                  Ditt efternamn
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
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
                  className="flex-1 bg-gray-300 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  AVBRYT
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-light-green text-white font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  FORTSÄTT
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <label className="block text-gray-600 text-sm">
                  Din e-postadress
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-300 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  TILLBAKA
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-light-green text-white font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  FORTSÄTT
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-6">
                <label className="block text-gray-600 text-sm">
                  Ditt lösenord
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
                />
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm">
                  Repetera lösenord
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
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
                  className="flex-1 bg-gray-300 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  TILLBAKA
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-light-green disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  FORTSÄTT
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="mb-6">
                <label className="block text-gray-600 text-sm">Stad</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
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
                <label className="block text-gray-600 text-sm">
                  Födelsedatum
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
                />
                {fieldErrors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.dateOfBirth}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm">Kön</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
                >
                  <option value="">Välj</option>
                  <option value="1">Man</option>
                  <option value="2">Kvinna</option>
                  <option value="3">Annat</option>
                </select>
                {fieldErrors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.gender}
                  </p>
                )}
              </div>

            <div className="mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 accent-white"
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm text-gray-700"
                  >
                    Jag accepterar{" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-black font-bold"
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
                    className="mt-1 accent-white"
                  />
                  <label
                    htmlFor="privacyAccepted"
                    className="text-sm text-gray-700"
                  >
                    Jag accepterar{" "}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="text-black font-bold"
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
                  className="flex-1 bg-gray-300 text-gray-700 font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
                >
                  TILLBAKA
                </button>
                <button
                  onClick={() => handleSubmit(termsAccepted, privacyAccepted)}
                  disabled={isSubmitting || !termsAccepted || !privacyAccepted}
                  className="flex-1 bg-light-green disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors duration-200 shadow-lg uppercase"
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
