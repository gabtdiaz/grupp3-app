import type { FieldErrors, FormData } from "../../hooks/useMultiStepForm";

interface Props {
  formData: FormData;
  fieldErrors: FieldErrors;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onCancel: () => void;
  scrollIntoView: (el: HTMLElement | null) => void;
}

export function StepName({
  formData,
  fieldErrors,
  error,
  onChange,
  onNext,
  onCancel,
  scrollIntoView,
}: Props) {
  return (
    <>
      <div className="mb-5">
        <label className="block text-gray-600 text-sm mb-1">Ditt förnamn</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          onFocus={(e) => scrollIntoView(e.currentTarget)}
          autoComplete="given-name"
          className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
        />
        {fieldErrors.firstName && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-600 text-sm mb-1">
          Ditt efternamn
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          onFocus={(e) => scrollIntoView(e.currentTarget)}
          autoComplete="family-name"
          className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 bg-transparent"
        />
        {fieldErrors.lastName && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <div className="flex gap-3 mt-2">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 font-bold py-4 rounded-full shadow-lg uppercase text-sm tracking-wide"
        >
          AVBRYT
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
