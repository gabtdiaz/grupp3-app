import React, { useState, useEffect } from "react"; // ✅ Add useEffect import

interface SelectOption {
  value: string;
  label: string;
}

interface SettingsSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export const SettingsSelect: React.FC<SettingsSelectProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Sync localValue when value prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(localValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsEditing(false);
  };

  const displayLabel =
    options.find((opt) => opt.value === value)?.label || value;

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          {isEditing ? (
            <div className="space-y-2">
              <select
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
                autoFocus
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 font-medium"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-light-green text-white rounded-lg text-sm font-medium"
                >
                  Spara
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900">{displayLabel}</p>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-4 text-sm text-gray-400 font-medium"
          >
            Ändra
          </button>
        )}
      </div>
    </div>
  );
};
