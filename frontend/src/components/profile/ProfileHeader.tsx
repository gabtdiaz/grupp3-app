import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { type UserProfile, type PublicProfile } from "../../api/profile";

type ProfileHeaderProps = {
  profile?: UserProfile | PublicProfile | null;
  isPublic?: boolean; // true om det är en publik profil
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
      : profile?.displayName?.[0];

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!profile) return;

      try {
        let url: string;
        const headers: Record<string, string> = {};

        if (isPublic && profile.id) {
          // Publik profil → hämta med id
          url = `http://localhost:5011/api/profile/image/${profile.id}?${Date.now()}`;
        } else {
          // Egen profil → hämta med token
          const token = localStorage.getItem("auth_token");
          if (!token) return;
          url = `http://localhost:5011/api/profile/image?${Date.now()}`;
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
          setImageSrc(null); // fallback
          return;
        }

        const blob = await res.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Fel vid hämtning av profilbild:", err);
        setImageSrc(null); // fallback
      }
    };

    fetchProfileImage();
  }, [profile, isPublic]);

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
