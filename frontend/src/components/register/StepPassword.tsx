import { useState } from "react";
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

export function StepPassword({
  formData,
  fieldErrors,
  error,
  onChange,
  onNext,
  onBack,
  scrollIntoView,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="mb-5">
        <label className="block text-gray-600 text-sm mb-1">
          Ditt lösenord
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChange}
            onFocus={(e) => scrollIntoView(e.currentTarget)}
            autoComplete="new-password"
            className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 pr-10 bg-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
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
        {fieldErrors.password && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-600 text-sm mb-1">
          Repetera lösenord
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            onFocus={(e) => scrollIntoView(e.currentTarget)}
            autoComplete="new-password"
            className="w-full border-b-2 border-gray-300 focus:border-gray-400 outline-none py-2 text-gray-700 pr-10 bg-transparent"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 pr-1"
          >
            <img
              src={
                showConfirmPassword
                  ? "/icons/eye-icon.svg"
                  : "/icons/eye-hidden-icon.svg"
              }
              alt={showConfirmPassword ? "Hide password" : "Show password"}
              className="w-5 h-5 opacity-70 transition-opacity"
            />
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {fieldErrors.confirmPassword}
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
          onClick={onNext}
          className="flex-1 bg-light-green disabled:opacity-50 text-white font-bold py-4 rounded-full shadow-lg uppercase text-sm tracking-wide"
        >
          FORTSÄTT
        </button>
      </div>
    </>
  );
}
