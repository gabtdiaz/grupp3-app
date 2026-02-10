// src/components/activity-detail/DeleteEventModal.tsx
// Confirmation modal för att radera event

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string;
}

export default function DeleteEventModal({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
}: DeleteEventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
        <h2 className="text-xl font-semibold mb-3">Ta bort aktivitet?</h2>
        <p className="text-gray-600 mb-6">
          Är du säker att du vill radera{" "}
          <span className="font-semibold">"{eventTitle}"</span>? Detta går inte
          att ångra.
        </p>

        <div className="flex gap-3">
          {/* Avbryt */}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Avbryt
          </button>

          {/* Radera */}
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 rounded-lg font-medium text-white hover:bg-red-700 transition-colors"
          >
            Ta bort
          </button>
        </div>
      </div>
    </div>
  );
}
