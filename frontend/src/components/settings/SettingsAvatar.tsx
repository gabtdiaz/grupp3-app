import React, { useRef, useState } from "react";

interface SettingsAvatarProps {
  onAvatarChange: (file: File) => void;
}

export const SettingsAvatar: React.FC<SettingsAvatarProps> = ({ onAvatarChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Skicka filen upp till parent
      await onAvatarChange(file);
    } catch (err) {
      console.error("Fel vid uppladdning:", err);
      alert("Kunde inte ladda upp bilden");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center py-4">
      <button
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? "Laddar upp..." : "Byt profilbild"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
