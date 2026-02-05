import React from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Användarvillkor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            x
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">1. Allmänt</h3>
            <p className="text-gray-700">
              Genom att använda FriendZone accepterar du dessa villkor. Vi
              förbehåller oss rätten att uppdatera villkoren när som helst.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">2. Användarkonto</h3>
            <p className="text-gray-700">
              Du ansvarar för att hålla dina inloggningsuppgifter säkra. Du får
              inte dela ditt konto med andra.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">3. Användarbeteende</h3>
            <p className="text-gray-700 mb-2">Du får inte:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Trakassera eller hota andra användare</li>
              <li>Skapa falska profiler</li>
              <li>Publicera olämpligt innehåll</li>
              <li>Missbruka plattformen för spam eller bedrägeri</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">4. Innehåll</h3>
            <p className="text-gray-700">
              Du behåller rättigheterna till ditt innehåll, men ger FriendZone
              rätt att visa det på plattformen.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              5. Ansvarsbegränsning
            </h3>
            <p className="text-gray-700">
              FriendZone ansvarar inte för skador som uppstår i samband med
              användning av tjänsten eller möten mellan användare.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">6. Uppsägning</h3>
            <p className="text-gray-700">
              Vi kan stänga av konton som bryter mot dessa villkor. Du kan när
              som helst radera ditt konto i inställningar.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-6">
            Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}
          </p>
        </div>
      </div>
    </div>
  );
};
