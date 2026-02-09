import React, { useState } from "react";

interface SettingsDeleteAccountProps {
  onDeleteAccount: (password: string) => Promise<void>;
}

export const SettingsDeleteAccount: React.FC<SettingsDeleteAccountProps> = ({
  onDeleteAccount,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!password.trim()) {
      setError("Ange ditt lösenord");
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await onDeleteAccount(password);
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data ||
        err?.message ||
        "Kunde inte radera konto";
      setError(typeof msg === "string" ? msg : "Kunde inte radera konto");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    setShowConfirm(false);
    setPassword("");
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full py-3 bg-white border border-red-600 rounded-lg text-red-600 font-medium"
      >
        Radera konto
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Radera konto?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Detta kan inte ångras. All din data kommer raderas permanent.
            </p>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bekräfta med ditt lösenord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ange lösenord"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={deleting}
              />
            </div>

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={deleting}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium disabled:opacity-50"
              >
                Avbryt
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {deleting ? "Raderar..." : "Radera konto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
