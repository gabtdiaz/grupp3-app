import React from "react";

interface SettingsPrivacyProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const SettingsPrivacy: React.FC<SettingsPrivacyProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-b-0">
      <label className="text-sm text-gray-700">{label}</label>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-light-green" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};
