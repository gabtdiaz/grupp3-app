import React, { useState, useRef, useEffect } from "react";

interface SettingsBioProps {
  bio: string;
  onBioChange: (bio: string) => void;
}

export const SettingsBio: React.FC<SettingsBioProps> = ({
  bio,
  onBioChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localBio, setLocalBio] = useState(bio);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_LENGTH = 200;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [localBio]);

  const handleSave = () => {
    onBioChange(localBio);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalBio(bio);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Om mig
        </label>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-red-400 font-medium"
          >
            Redigera
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            ref={textareaRef}
            value={localBio}
            onChange={(e) => setLocalBio(e.target.value.slice(0, MAX_LENGTH))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 resize-none outline-none focus:border-gray-400 transition-colors"
            rows={3}
            placeholder="Berätta lite om dig själv..."
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {localBio.length}/{MAX_LENGTH} tecken
            </span>
            <div className="flex gap-2">
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
        </div>
      ) : (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {bio || "Ingen beskrivning ännu..."}
        </p>
      )}
    </div>
  );
};
