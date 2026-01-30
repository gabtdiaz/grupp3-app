import React, { useState } from "react";
import { SettingsHeader } from "../components/settings/SettingsHeader";
import { SettingsAvatar } from "../components/settings/SettingsAvatar";
import { SettingsBio } from "../components/settings/SettingsBio";
import { SettingsSection } from "../components/settings/SettingsSection";
import { SettingsInput } from "../components/settings/SettingsInput";
import { SettingsSelect } from "../components/settings/SettingsSelect";
import { SettingsPrivacy } from "../components/settings/SettingsPrivacy";
import { SettingsLogout } from "../components/settings/SettingsLogout";
import BottomNav from "../components/layout/BottomNav";

export interface UserProfile {
  email: string;
  password: string;
  gender: "Man" | "Kvinna" | "Icke-binär" | "Annan";
  city: string;
  birthday: Date;
  avatarUrl: string;
  bio: string;
  privacy: {
    showGender: boolean;
    showAge: boolean;
    showCity: boolean;
  };
}

export const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    email: "exempel@email.se",
    password: "********",
    gender: "Kvinna",
    city: "Malmö",
    birthday: new Date(1995, 5, 15),
    avatarUrl: "",
    bio: "Älskar brädspel och träffa nya människor! Letar alltid efter nya spelupplevelser.",
    privacy: {
      showGender: true,
      showAge: true,
      showCity: true,
    },
  });

  const [isEditing, setIsEditing] = useState({
    email: false,
    password: false,
    pronouns: false,
    city: false,
    bio: false,
  });

  const handleUpdateProfile = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdatePrivacy = (field: keyof UserProfile["privacy"]) => {
    setProfile((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: !prev.privacy[field],
      },
    }));
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement logout logic here
  };

  const formatBirthday = (date: Date): string => {
    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const pronounOptions = [
    { value: "Kvinna", label: "Kvinna" },
    { value: "Man", label: "Man" },
    { value: "Icke-binär", label: "Icke-binär" },
    { value: "Annan", label: "Annan" },
  ];

  const cityOptions = [
    { value: "Stockholm", label: "Stockholm" },
    { value: "Göteborg", label: "Göteborg" },
    { value: "Malmö", label: "Malmö" },
    { value: "Uppsala", label: "Uppsala" },
    { value: "Västerås", label: "Västerås" },
    { value: "Örebro", label: "Örebro" },
    { value: "Linköping", label: "Linköping" },
    { value: "Helsingborg", label: "Helsingborg" },
    { value: "Jönköping", label: "Jönköping" },
    { value: "Norrköping", label: "Norrköping" },
    { value: "Lund", label: "Lund" },
    { value: "Umeå", label: "Umeå" },
    { value: "Gävle", label: "Gävle" },
    { value: "Borås", label: "Borås" },
    { value: "Eskilstuna", label: "Eskilstuna" },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <SettingsHeader />

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Avatar */}
        <SettingsAvatar
          avatarUrl={profile.avatarUrl}
          name="Ditt Namn"
          onAvatarChange={(url) => handleUpdateProfile("avatarUrl", url)}
        />

        {/* Bio Section */}
        <SettingsBio
          bio={profile.bio}
          onBioChange={(bio) => handleUpdateProfile("bio", bio)}
        />

        {/* Account Section */}
        <SettingsSection title="Konto">
          <SettingsInput
            label="E-post"
            value={profile.email}
            type="email"
            onChange={(value) => handleUpdateProfile("email", value)}
          />
          <SettingsInput
            label="Lösenord"
            value={profile.password}
            type="password"
            onChange={(value) => handleUpdateProfile("password", value)}
          />
        </SettingsSection>

        {/* Personal Information Section */}
        <SettingsSection title="Personlig information">
          <SettingsSelect
            label="Kön"
            value={profile.gender}
            options={pronounOptions}
            onChange={(value) =>
              handleUpdateProfile("gender", value as UserProfile["gender"])
            }
          />
          <SettingsSelect
            label="Stad"
            value={profile.city}
            options={cityOptions}
            onChange={(value) => handleUpdateProfile("city", value)}
          />
          <div className="px-4 py-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Födelsedatum
            </label>
            <p className="text-gray-900">{formatBirthday(profile.birthday)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Kan inte ändras av säkerhetsskäl
            </p>
          </div>
        </SettingsSection>

        {/* Privacy Section */}
        <SettingsSection title="Integritet">
          <p className="px-4 pt-3 text-sm text-gray-600 mb-1">
            Välj vad andra användare kan se på din profil
          </p>
          <SettingsPrivacy
            label="Visa kön"
            checked={profile.privacy.showGender}
            onChange={() => handleUpdatePrivacy("showGender")}
          />
          <SettingsPrivacy
            label="Visa ålder"
            checked={profile.privacy.showAge}
            onChange={() => handleUpdatePrivacy("showAge")}
          />
          <SettingsPrivacy
            label="Visa stad"
            checked={profile.privacy.showCity}
            onChange={() => handleUpdatePrivacy("showCity")}
          />
        </SettingsSection>

        {/* Logout Button */}
        <SettingsLogout onLogout={handleLogout} />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default Settings;
