import React from "react";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {children}
      </div>
    </div>
  );
};
