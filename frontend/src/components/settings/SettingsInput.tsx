import React, { useState } from "react";

interface SettingsInputProps {
  label: string;
  value: string;
  type?: "text" | "email" | "password";
  onChange: (value: string) => void;
}

export const SettingsInput: React.FC<SettingsInputProps> = ({
  label,
  value,
  type = "text",
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Password change specific states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (type === "password") {
      // Validate password change
      if (!oldPassword) {
        setError("Ange ditt nuvarande lösenord");
        return;
      }
      if (!newPassword) {
        setError("Ange ett nytt lösenord");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Lösenorden matchar inte");
        return;
      }

      // In production, verify old password with backend
      // For now, just update
      onChange(newPassword);

      // Reset password fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setIsEditing(false);
    } else {
      onChange(localValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setLocalValue(value);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setIsEditing(false);
  };

  const displayValue = type === "password" ? "••••••••" : value;

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          {isEditing ? (
            <div className="space-y-2">
              {type === "password" ? (
                <>
                  {/* Old Password */}
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Nuvarande lösenord"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <img
                        src={
                          showOldPassword
                            ? "/icons/eye-hidden-icon.svg"
                            : "/icons/eye-icon.svg"
                        }
                        alt={
                          showOldPassword ? "Hide password" : "Show password"
                        }
                        className="w-5 h-5 opacity-70 transition-opacity"
                      />
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nytt lösenord"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <img
                        src={
                          showNewPassword
                            ? "/icons/eye-hidden-icon.svg"
                            : "/icons/eye-icon.svg"
                        }
                        alt={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                        className="w-5 h-5 opacity-70 transition-opacity"
                      />
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Bekräfta nytt lösenord"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <img
                        src={
                          showConfirmPassword
                            ? "/icons/eye-hidden-icon.svg"
                            : "/icons/eye-icon.svg"
                        }
                        alt={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="w-5 h-5 opacity-70 transition-opacity"
                      />
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </>
              ) : (
                <div className="relative">
                  <input
                    type={type}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
                    autoFocus
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 font-medium"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-red-400 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Spara
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">{displayValue}</p>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-4 text-sm text-red-400 font-medium"
          >
            Ändra
          </button>
        )}
      </div>
    </div>
  );
};
