import React, { useState } from "react";

interface SettingsLogoutProps {
  onLogout: () => void;
}

export const SettingsLogout: React.FC<SettingsLogoutProps> = ({ onLogout }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(false);
    onLogout();
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full py-3 bg-white border border-red-600 rounded-lg text-red-600 font-medium"
      >
        Logga ut
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60  z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Logga ut?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Är du säker på att du vill logga ut?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                Avbryt
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium"
              >
                Logga ut
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
