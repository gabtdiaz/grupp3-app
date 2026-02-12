import React, { useEffect, useState } from "react";

type SavePasswordPayload = { oldPassword: string; newPassword: string };

interface SettingsInputProps {
  label: string;
  value: string;
  type?: "text" | "email" | "password";

  // Text/email använder onSave
  onSave?: (value: string) => Promise<void> | void;

  // Password använder onSavePassword (skickar old+new)
  onSavePassword?: (payload: SavePasswordPayload) => Promise<void> | void;

  // UI state från parent (valfritt)
  saving?: boolean;
  error?: string | null;
}

export const SettingsInput: React.FC<SettingsInputProps> = ({
  label,
  value,
  type = "text",
  onSave,
  onSavePassword,
  saving = false,
  error = null,
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

  // Lokal validering (password/email/text)
  const [localError, setLocalError] = useState("");

  // Sync värdet när parent uppdaterar (t.ex. efter refetch)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Om parent-error ändras, rensa lokal validering (valfritt men brukar kännas bra)
  useEffect(() => {
    if (error) setLocalError("");
  }, [error]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleSave = async () => {
    setLocalError("");

    try {
      if (type === "password") {
        if (!onSavePassword) {
          setLocalError("Saknar onSavePassword");
          return;
        }

        if (!oldPassword) {
          setLocalError("Ange ditt nuvarande lösenord");
          return;
        }
        if (!newPassword) {
          setLocalError("Ange ett nytt lösenord");
          return;
        }
        if (newPassword !== confirmPassword) {
          setLocalError("Lösenorden matchar inte");
          return;
        }

        // Skicka både old + new
        await onSavePassword({ oldPassword, newPassword });

        // Reset
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsEditing(false);
        return;
      }

      if (!onSave) {
        setLocalError("Saknar onSave");
        return;
      }

      const nextValue = localValue.trim();

      if (type === "email") {
        if (!nextValue) {
          setLocalError("Ange en e-postadress");
          return;
        }
        if (!isValidEmail(nextValue)) {
          setLocalError("Ange en giltig e-postadress");
          return;
        }
      }

      // För text/email
      await onSave(nextValue);

      // Endast stäng edit om save lyckas
      setIsEditing(false);
    } catch {
      // Parent sätter error-prop, vi stannar i edit-läget så användaren kan rätta
    }
  };

  const handleCancel = () => {
    setLocalValue(value);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setLocalError("");
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
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      disabled={saving}
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
                        className="w-4 h-4 opacity-70 transition-opacity"
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
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      disabled={saving}
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
                        className="w-4 h-4 opacity-70 transition-opacity"
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
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      disabled={saving}
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
                        className="w-4 h-4 opacity-70 transition-opacity"
                      />
                    </button>
                  </div>

                  {/* Error (lokal/parent) */}
                  {(localError || error) && (
                    <p className="text-xs text-red-500">
                      {localError || error}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="relative">
                    <input
                      type={type}
                      value={localValue}
                      onChange={(e) => setLocalValue(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
                      autoFocus
                      disabled={saving}
                    />
                  </div>

                  {(localError || error) && (
                    <p className="text-xs text-red-500">
                      {localError || error}
                    </p>
                  )}
                </>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 font-medium"
                  disabled={saving}
                >
                  Avbryt
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-light-green text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Sparar..." : "Spara"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">{displayValue}</p>
          )}
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setLocalError("");
              setIsEditing(true);
            }}
            className="ml-4 text-sm text-gray-400 font-medium"
          >
            Ändra
          </button>
        )}
      </div>
    </div>
  );
};
