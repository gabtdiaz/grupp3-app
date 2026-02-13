// SettingsAvatar.tsx
import React, { useEffect, useRef, useState } from "react";

interface SettingsAvatarProps {
  onAvatarChange: (file: File) => void;
  src?: string | null; // blob url from Settings (or null)
}

export const SettingsAvatar: React.FC<SettingsAvatarProps> = ({
  onAvatarChange,
  src,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // local preview when user picks new file
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  const openPicker = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewSrc(localUrl);

    try {
      setUploading(true);
      await onAvatarChange(file);
      // keep preview visible until Settings updates src
    } catch (err) {
      console.error("Fel vid uppladdning:", err);
      alert("Kunde inte ladda upp bilden");
      setPreviewSrc(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const displaySrc = previewSrc ?? src;

  return (
    <div className="flex flex-col items-center pt-1 space-y-2">
      <div className="relative">
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          aria-label="Byt profilbild"
          className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center disabled:opacity-60"
        >
          {displaySrc ? (
            <img
              src={displaySrc}
              alt="Profilbild"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          aria-label="Ladda upp ny profilbild"
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-light-green border-2 border-white flex items-center justify-center shadow disabled:opacity-60"
        >
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <p className="text-xs text-gray-500">Tryck på + för att byta bild</p>
    </div>
  );
};
