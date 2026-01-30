import React, { useRef } from "react";

interface SettingsAvatarProps {
  avatarUrl: string;
  name: string;
  onAvatarChange: (url: string) => void;
}

export const SettingsAvatar: React.FC<SettingsAvatarProps> = ({
  avatarUrl,
  name,
  onAvatarChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the uploaded file
      const url = URL.createObjectURL(file);
      onAvatarChange(url);

      // In production, you would upload this to your server:
      // const formData = new FormData();
      // formData.append('avatar', file);
      // await uploadAvatar(formData);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center py-6">
      <div onClick={handleClick} className="relative">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-gray-300 overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Camera Icon */}
        <div className="absolute bottom-0 right-0 bg-red-400 rounded-full p-2 border-2 border-white">
          <img
            src="/icons/camera-icon.svg"
            alt="Change avatar"
            className="w-4 h-4"
          />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Helper text */}
      <p className="text-sm text-gray-500 mt-3">
        Klicka för att ändra profilbild
      </p>
    </div>
  );
};
