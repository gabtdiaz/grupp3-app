import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SettingsHeader } from "../components/settings/SettingsHeader";
import { SettingsAvatar } from "../components/settings/SettingsAvatar";
import { SettingsBio } from "../components/settings/SettingsBio";
import { SettingsSection } from "../components/settings/SettingsSection";
import { SettingsInput } from "../components/settings/SettingsInput";
import { SettingsSelect } from "../components/settings/SettingsSelect";
import { SettingsPrivacy } from "../components/settings/SettingsPrivacy";
import { SettingsLogout } from "../components/settings/SettingsLogout";
import { SettingsDeleteAccount } from "../components/settings/SettingsDeleteAccount";
import BottomNav from "../components/layout/BottomNav";
import ProfileHeader from "../components/profile/ProfileHeader";

import { useProfile } from "../hooks/useProfile";
import {
  updateUserProfile,
  updateEmail,
  changePassword,
  deleteAccount,
} from "../api/profile";

type PrivacyDraft = {
  showGender: boolean;
  showAge: boolean;
  showCity: boolean;
};

export const Settings: React.FC = () => {
  const { profile, loading, error, refetch } = useProfile();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Avatar URL för headern
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Bio UI state
  const [bioDraft, setBioDraft] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [saveBioError, setSaveBioError] = useState<string | null>(null);

  // Email UI state
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Password UI state
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Privacy UI state
  const [privacyDraft, setPrivacyDraft] = useState<PrivacyDraft | null>(null);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  useEffect(() => {
    if (profile) {
      setBioDraft(profile.bio ?? "");
      setPrivacyDraft({
        showGender: !!profile.showGender,
        showAge: !!profile.showAge,
        showCity: !!profile.showCity,
      });
      setAvatarUrl("/api/profile/image?" + Date.now());
    }
  }, [profile]);

  const handleAvatarChange = async (file: File) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Ingen inloggning hittades. Logga in igen.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Laddar upp profilbild...");

      const response = await fetch(
        "http://localhost:5011/api/profile/upload-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Fel vid uppladdning: ${response.status} ${text}`);
      }

      console.log("Profilbild uppladdad!");
      alert("Profilbild uppladdad!");

      setAvatarUrl(`http://localhost:5011/api/profile/image?${Date.now()}`);
      await refetch();
    } catch (err) {
      console.error("Fel vid uppladdning:", err);
      alert("Kunde inte ladda upp bilden");
    }
  };

  const handleSaveBio = async (nextBio: string) => {
    if (!profile) return;

    try {
      setSavingBio(true);
      setSaveBioError(null);

      await updateUserProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        city: profile.city,
        bio: nextBio,
        interests: profile.interests ?? "",
        profileImageUrl: profile.profileImageUrl ?? null,
        gender: profile.gender,
        showGender: profile.showGender,
        showAge: profile.showAge,
        showCity: profile.showCity,
      });

      setBioDraft(nextBio);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data ||
        err?.message ||
        "Kunde inte spara bio";

      setSaveBioError(typeof msg === "string" ? msg : "Kunde inte spara bio");
      throw err;
    } finally {
      setSavingBio(false);
    }
  };

  const handleSaveEmail = async (nextEmail: string) => {
    try {
      setSavingEmail(true);
      setEmailError(null);

      await updateEmail(nextEmail);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data ||
        err?.message ||
        "Kunde inte spara e-post";

      setEmailError(typeof msg === "string" ? msg : "Kunde inte spara e-post");
      throw err;
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSavePassword = async (p: {
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      setSavingPassword(true);
      setPasswordError(null);

      await changePassword(p.oldPassword, p.newPassword);
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data ||
        err?.message ||
        "Kunde inte byta lösenord";

      setPasswordError(
        typeof msg === "string" ? msg : "Kunde inte byta lösenord",
      );
      throw err;
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleDelete = async (password: string) => {
    try {
      await deleteAccount(password);

      logout();
      navigate("/", { replace: true });
    } catch (err) {
      throw err;
    }
  };

  const handleSaveCity = async (nextCity: string) => {
    if (!profile) return;

    try {
      await updateUserProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        city: nextCity,
        bio: profile.bio ?? "",
        interests: profile.interests ?? "",
        profileImageUrl: profile.profileImageUrl ?? null,
        gender: profile.gender,
        showGender: profile.showGender,
        showAge: profile.showAge,
        showCity: profile.showCity,
      });

      await refetch();
    } catch (err: any) {
      console.error("Failed to update city:", err);
    }
  };

  const handleSavePrivacy = async (
    field: keyof PrivacyDraft,
    value: boolean,
  ) => {
    if (!profile || !privacyDraft) return;

    const prev = privacyDraft;
    const nextDraft: PrivacyDraft = { ...privacyDraft, [field]: value };
    setPrivacyDraft(nextDraft);

    try {
      setSavingPrivacy(true);

      const updated = await updateUserProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        city: profile.city,
        bio: profile.bio ?? "",
        interests: profile.interests ?? "",
        profileImageUrl: profile.profileImageUrl ?? null,
        gender: profile.gender,
        showGender: nextDraft.showGender,
        showAge: nextDraft.showAge,
        showCity: nextDraft.showCity,
      });

      setPrivacyDraft({
        showGender: !!updated.showGender,
        showAge: !!updated.showAge,
        showCity: !!updated.showCity,
      });
    } catch (err) {
      console.error("Failed to update privacy:", err);
      setPrivacyDraft(prev);
    } finally {
      setSavingPrivacy(false);
    }
  };

  const pronounOptions = [
    { value: "1", label: "Man" },
    { value: "2", label: "Kvinna" },
    { value: "3", label: "Annat" },
    { value: "4", label: "Vill inte uppge" },
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

  if (loading) return <div className="p-6">Laddar inställningar...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!profile) return <div className="p-6">Ingen profil hittad</div>;

  const effectivePrivacy: PrivacyDraft = privacyDraft ?? {
    showGender: !!profile.showGender,
    showAge: !!profile.showAge,
    showCity: !!profile.showCity,
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <ProfileHeader profile={profile} avatarUrl={avatarUrl} />

      <div className="px-4 py-12 space-y-6 ">
        <SettingsAvatar onAvatarChange={handleAvatarChange} />

        <SettingsBio
          bio={bioDraft}
          saving={savingBio}
          error={saveBioError}
          onSave={handleSaveBio}
        />

        <SettingsSection title="Konto">
          <SettingsInput
            label="E-post"
            value={profile.email}
            type="email"
            onSave={handleSaveEmail}
            saving={savingEmail}
            error={emailError}
          />

          <SettingsInput
            label="Lösenord"
            value={"********"}
            type="password"
            onSavePassword={handleSavePassword}
            saving={savingPassword}
            error={passwordError}
          />
        </SettingsSection>

        <SettingsSection title="Personlig information">
          <div className="px-4 py-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kön
            </label>
            <p className="text-gray-900">
              {pronounOptions.find(
                (opt) => Number(opt.value) === Number(profile.gender),
              )?.label ?? "–"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Kan inte ändras av säkerhetsskäl
            </p>
          </div>

          <SettingsSelect
            label="Stad"
            value={profile.city}
            options={cityOptions}
            onChange={handleSaveCity}
          />
          <div className="px-4 py-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Födelsedatum
            </label>
            <p className="text-gray-900">
              {new Date(profile.dateOfBirth).toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Kan inte ändras av säkerhetsskäl
            </p>
          </div>
        </SettingsSection>

        <SettingsSection title="Integritet">
          <p className="px-4 pt-3 text-sm text-gray-600 mb-1">
            Välj vad andra användare kan se på din profil
          </p>

          <SettingsPrivacy
            label="Visa kön"
            checked={effectivePrivacy.showGender}
            disabled={savingPrivacy}
            onChange={(checked) => handleSavePrivacy("showGender", checked)}
          />
          <SettingsPrivacy
            label="Visa ålder"
            checked={effectivePrivacy.showAge}
            disabled={savingPrivacy}
            onChange={(checked) => handleSavePrivacy("showAge", checked)}
          />
          <SettingsPrivacy
            label="Visa stad"
            checked={effectivePrivacy.showCity}
            disabled={savingPrivacy}
            onChange={(checked) => handleSavePrivacy("showCity", checked)}
          />
        </SettingsSection>

        <SettingsLogout onLogout={handleLogout} />
        <SettingsDeleteAccount onDeleteAccount={handleDelete} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default Settings;
