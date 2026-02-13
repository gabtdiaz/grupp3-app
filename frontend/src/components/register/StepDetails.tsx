import { useState } from "react";
import { TermsModal } from "../modals/TermsModal";
import { PrivacyModal } from "../modals/PrivacyModal";
import type { FieldErrors, FormData } from "../../hooks/useMultiStepForm";
import { useCities } from "../../hooks/useCities";

interface Props {
  formData: FormData;
  fieldErrors: FieldErrors;
  error: string | null;
  isSubmitting: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (termsAccepted: boolean, privacyAccepted: boolean) => void;
  onBack: () => void;
  scrollIntoView: (el: HTMLElement | null) => void;
}

export function StepDetails({
  formData,
  fieldErrors,
  error,
  isSubmitting,
  onChange,
  onSubmit,
  onBack,
  scrollIntoView,
}: Props) {
  const { cities } = useCities();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const bothAccepted = termsAccepted && privacyAccepted;

  return (
    <>
      <div className="mb-5">
        <label className="block text-gray-600 text-sm mb-1">Stad</label>
        <select
          name="city"
          value={formData.city}
          onChange={onChange}
          onFocus={(e) => scrollIntoView(e.currentTarget)}
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
          <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-gray-600 text-sm mb-1">Födelsedatum</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onChange}
          onFocus={(e) => scrollIntoView(e.currentTarget)}
          className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
        />
        {fieldErrors.dateOfBirth && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.dateOfBirth}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-gray-600 text-sm mb-1">Kön</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={onChange}
          onFocus={(e) => scrollIntoView(e.currentTarget)}
          className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
        >
          <option value="">Välj</option>
          <option value="1">Man</option>
          <option value="2">Kvinna</option>
          <option value="3">Annat</option>
        </select>
        {fieldErrors.gender && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.gender}</p>
        )}
      </div>

      {/* Terms & Privacy checkboxes */}
      <div className="mb-6 space-y-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 shrink-0 accent-orange-400"
          />
          <label
            htmlFor="termsAccepted"
            className="text-sm text-gray-700 leading-snug"
          >
            Jag accepterar{" "}
            <button
              type="button"
              onClick={() => setIsTermsModalOpen(true)}
              className="text-black font-bold underline underline-offset-2"
            >
              användarvillkoren
            </button>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacyAccepted"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 shrink-0 accent-orange-400"
          />
          <label
            htmlFor="privacyAccepted"
            className="text-sm text-gray-700 leading-snug"
          >
            Jag accepterar{" "}
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-black font-bold underline underline-offset-2"
            >
              integritetspolicyn
            </button>
          </label>
        </div>

        {!bothAccepted && error && (
          <p className="text-red-500 text-xs">
            Du måste acceptera både användarvillkoren och integritetspolicyn
          </p>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-300 text-gray-700 font-bold py-4 rounded-full shadow-lg uppercase text-sm tracking-wide"
        >
          TILLBAKA
        </button>
        <button
          onClick={() => onSubmit(termsAccepted, privacyAccepted)}
          disabled={isSubmitting || !bothAccepted}
          className="flex-1 bg-light-green disabled:opacity-50 text-white font-bold py-4 rounded-full shadow-lg uppercase text-sm tracking-wide"
        >
          {isSubmitting ? "REGISTRERAR..." : "REGISTRERA"}
        </button>
      </div>

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
