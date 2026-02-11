import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { type UserProfile, type PublicProfile } from "../../api/profile";

type ProfileHeaderProps = {
  profile?: UserProfile | PublicProfile | null;
  isPublic?: boolean; // true = när man tittar på någon annans profil
  avatarUrl?: string | null;
};

export default function ProfileHeader({
  profile: externalProfile,
  isPublic = false,
}: ProfileHeaderProps) {
  const { profile: ownProfile } = useProfile();
  const profile = externalProfile || ownProfile;

  const firstName =
    profile && "firstName" in profile
      ? profile.firstName
      : profile?.displayName?.split(" ")[0]; // bättre fallback

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchProfileImage = async () => {
      if (!profile?.id) {
        console.log(" Ingen profil-ID");
        setImageLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");

        let url: string;
        const headers: Record<string, string> = {};

        if (isPublic) {
          // publik profil
          url = `http://localhost:5011/api/profile/image/${profile.id}`;
          console.log("🔍 Hämtar publik profilbild:", url);
        } else {
          // inloggad användare
          if (!token) {
            console.warn("Ingen auth_token hittad — visar fallbackbild.");
            setImageLoading(false);
            return;
          }
          url = `http://localhost:5011/api/profile/image`;
          headers["Authorization"] = `Bearer ${token}`;
          console.log("Hämtar egen profilbild:", url);
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
          if (res.status === 404) {
            console.log(" Ingen profilbild uppladdad ännu");
          } else {
            console.warn(` Kunde inte hämta bild (HTTP ${res.status})`);
          }
          setImageSrc(null);
          setImageLoading(false);
          return;
        }

        // Hämta blob och skapa Object URL
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
        console.log(" Profilbild hämtad från blob");
        setImageLoading(false);
      } catch (err) {
        console.error(" Fel vid hämtning av profilbild:", err);
        setImageSrc(null);
        setImageLoading(false);
      }
    };

    fetchProfileImage();

    // Cleanup - Frigör object URL när komponenten unmountas
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [profile?.id, isPublic]);
  //h
  const hasValidImage = !!imageSrc;

  return (
    <div
      className="relative h-52 bg-no-repeat bg-left-top"
      style={{
        backgroundImage: `url("/header-profile-background.png")`,
        backgroundSize: "26rem",
      }}
    >
      <div className="absolute left-6 -bottom-12 h-24 w-24 rounded-full bg-white border border-light-green overflow-hidden">
        {imageLoading ? (
          // Loading state
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        ) : hasValidImage ? (
          // Bild finns (antingen från avatarUrl eller blob)
          <img
            src={imageSrc}
            alt="Profilbild"
            className="w-24 h-24 rounded-full object-cover"
            onError={() => {
              console.error(" Kunde inte visa profilbild");
              setImageSrc(null);
            }}
          />
        ) : (
          // Ingen bild - visa initial
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold bg-gray-100">
            {firstName?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>
    </div>
  );
}
