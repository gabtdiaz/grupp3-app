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

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!profile?.id) return;

      try {
        let url: string;
        const headers: Record<string, string> = {};

        if (isPublic) {
          // publik profil
          url = `http://localhost:5011/api/profile/image/${profile.id}?${Date.now()}`;
          console.log("🔍 Hämtar publik profilbild:", url);
        } else {
          // inloggad användare 
          const token = localStorage.getItem("auth_token");
          if (!token) {
            console.warn("Ingen auth_token hittad — visar fallbackbild.");
            return;
          }
          url = `http://localhost:5011/api/profile/image?${Date.now()}`;
          headers["Authorization"] = `Bearer ${token}`;
          console.log("Hämtar egen profilbild:", url);
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
          console.warn("Ingen bild hittades (HTTP", res.status, ")");
          setImageSrc(null);
          return;
        }

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch (err) {
        console.error("Fel vid hämtning av profilbild:", err);
        setImageSrc(null);
      }
    };

    fetchProfileImage();
  }, [profile?.id, isPublic]);

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
        {hasValidImage ? (
          <img
            src={imageSrc!}
            alt="Profilbild"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold">
            {firstName?.[0] ?? "?"}
          </div>
        )}
      </div>
    </div>
  );
}
