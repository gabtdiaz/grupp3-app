import type { FieldErrors, FormData } from "../../hooks/useMultiStepForm";

interface Props {
  formData: FormData;
  fieldErrors: FieldErrors;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
  scrollIntoView: (el: HTMLElement | null) => void;
}

export function StepEmail({
  formData,
  fieldErrors,
  error,
  onChange,
  onNext,
  onBack,
  scrollIntoView,
}: Props) {
  return (
    <>
      <div className="mb-6">
        <label className="block text-gray-600 text-sm mb-1">
          Din e-postadress
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          onFocus={(e) => scrollIntoView(e.currentTarget)}
          autoComplete="email"
          inputMode="email"
          className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
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
          onClick={onNext}
          className="flex-1 bg-light-green text-white font-bold py-4 rounded-full shadow-lg uppercase text-sm tracking-wide"
        >
          FORTSÄTT
        </button>
      </div>
    </>
  );
}
