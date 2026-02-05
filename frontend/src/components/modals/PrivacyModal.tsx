import React from "react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Integritetspolicy
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          <section>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              1. Vilka uppgifter samlar vi in?
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Vi samlar in följande personuppgifter:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-sm text-gray-600">
              <li>Namn (för- och efternamn)</li>
              <li>E-postadress</li>
              <li>Födelsedatum (för åldersverifiering)</li>
              <li>Kön</li>
              <li>Stad</li>
              <li>Profilbild (valfritt)</li>
              <li>Bio och intressen (valfritt)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              2. Hur använder vi dina uppgifter?
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Vi använder dina personuppgifter för att:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-sm text-gray-600">
              <li>Skapa och hantera ditt konto</li>
              <li>Visa din profil för andra användare</li>
              <li>Filtrera aktiviteter baserat på ålder och kön</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              3. Vem delar vi dina uppgifter med?
            </h3>
            <p className="text-sm text-gray-600">
              Vi delar <strong>aldrig</strong> dina personuppgifter med tredje
              part. Andra användare kan endast se den information du väljer att
              visa i din publika profil.
            </p>
          </section>

          <section>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              4. Dina rättigheter
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Enligt GDPR har du rätt att:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-sm text-gray-600">
              <li>
                <strong>Se dina uppgifter:</strong> Alla dina uppgifter visas i
                din profil
              </li>
              <li>
                <strong>Ändra dina uppgifter:</strong> Uppdatera i
                profilinställningar
              </li>
              <li>
                <strong>Radera ditt konto:</strong> Du kan när som helst radera
                ditt konto i inställningar (all data raderas permanent)
              </li>
              <li>
                <strong>Styra synlighet:</strong> Välj vad andra användare ser
                (ålder, stad, kön)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              5. Dataskydd
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Vi skyddar dina uppgifter med:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-sm text-gray-600">
              <li>Krypterad lösenordslagring</li>
              <li>HTTPS-kryptering för all datatrafik</li>
              <li>Säker autentisering med tokens</li>
              <li>Servrar i EU-region</li>
              <li>Skydd mot missbruk och attacker</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              6. Lagring av uppgifter
            </h3>
            <p className="text-sm text-gray-600">
              Dina uppgifter lagras så länge ditt konto är aktivt. När du
              raderar ditt konto raderas all personlig data omedelbart och
              permanent.
            </p>
          </section>

          <section>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              7. Kontakt
            </h3>
            <p className="text-sm text-gray-600">
              För frågor om din integritet, kontakta oss på:
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>E-post:</strong> privacy@friendzone.se
              <br />
              <strong>Personuppgiftsansvarig:</strong> FriendZone Team
            </p>
          </section>

          <p className="text-xs text-gray-500 mt-6">
            Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}
          </p>
        </div>
      </div>
    </div>
  );
};
