// Settings.tsx (updated order: City -> Age -> Gender)
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SettingsAvatar } from "../components/settings/SettingsAvatar";
import { SettingsBio } from "../components/settings/SettingsBio";
import { SettingsSection } from "../components/settings/SettingsSection";
import { SettingsInput } from "../components/settings/SettingsInput";
import { SettingsSelect } from "../components/settings/SettingsSelect";
import { SettingsPrivacy } from "../components/settings/SettingsPrivacy";
import { SettingsLogout } from "../components/settings/SettingsLogout";
import { SettingsDeleteAccount } from "../components/settings/SettingsDeleteAccount";
import BottomNav from "../components/layout/BottomNav";
import { getApiUrl } from "../api/api";
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

  // Avatar shown in SettingsAvatar (blob url)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const prevAvatarUrlRef = useRef<string | null>(null);

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

  // ✅ Fetch avatar with auth and set blob url so <img> works
  const fetchAvatarWithAuth = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch(getApiUrl(`/api/profile/image?${Date.now()}`), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store",
        },
      });

      if (!res.ok) return;

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      if (prevAvatarUrlRef.current) {
        URL.revokeObjectURL(prevAvatarUrlRef.current);
      }
      prevAvatarUrlRef.current = objectUrl;
      setAvatarUrl(objectUrl);
    } catch (e) {
      console.error("Failed to fetch avatar:", e);
    }
  };

  useEffect(() => {
    if (!profile) return;

    setBioDraft(profile.bio ?? "");
    setPrivacyDraft({
      showGender: !!profile.showGender,
      showAge: !!profile.showAge,
      showCity: !!profile.showCity,
    });

    fetchAvatarWithAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    return () => {
      if (prevAvatarUrlRef.current) {
        URL.revokeObjectURL(prevAvatarUrlRef.current);
      }
    };
  }, []);

  const handleAvatarChange = async (file: File) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Ingen inloggning hittades. Logga in igen.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(getApiUrl("/api/profile/upload-image"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Fel vid uppladdning: ${response.status} ${text}`);
      }

      await fetchAvatarWithAuth();
      await refetch();
    } catch (err) {
      console.error("Fel vid uppladdning:", err);
      alert("Kunde inte ladda upp bilden");
      throw err;
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
    await deleteAccount(password);
    logout();
    navigate("/", { replace: true });
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

  if (loading && !profile)
    return <div className="p-6">Laddar inställningar...</div>;
  if (error) return <div className="p-6 text-gray-500">{error}</div>;
  if (!profile) return <div className="p-6">Ingen profil hittad</div>;

  const effectivePrivacy: PrivacyDraft = privacyDraft ?? {
    showGender: !!profile.showGender,
    showAge: !!profile.showAge,
    showCity: !!profile.showCity,
  };

  const ageLabel = (() => {
    try {
      const dob = new Date(profile.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      return `${age} år`;
    } catch {
      return "–";
    }
  })();

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 pt-10" />
      <div className="px-4 pt-7 pb-20 space-y-6">
        <div className="flex justify-center">
          <SettingsAvatar onAvatarChange={handleAvatarChange} src={avatarUrl} />
        </div>

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
          {/* ✅ Order changed: City -> Age -> Gender */}

          {/* City */}
          <SettingsSelect
            label="Stad"
            value={profile.city}
            options={cityOptions}
            onChange={handleSaveCity}
          />

          {/* Age */}
          <div className="px-4 py-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ålder
            </label>
            <p className="text-gray-900">{ageLabel}</p>
            <p className="text-xs text-gray-500 mt-1">
              Kan inte ändras av säkerhetsskäl
            </p>
          </div>

          {/* Gender */}
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
