import React from "react";

interface SettingsPrivacyProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const SettingsPrivacy: React.FC<SettingsPrivacyProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Stoppar "refresh" som ofta kommer från form submit eller bubbla till parent
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;
    onChange(!checked);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-b-0">
      <span className="text-sm text-gray-700">{label}</span>

      <button
        type="button"
        onClick={handleToggle}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        } ${checked ? "bg-light-green" : "bg-gray-300"}`}
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
