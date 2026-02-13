import { useState, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { type UserProfile, type PublicProfile } from "../../api/profile";
import ProfileHeaderBanner from "./ProfileHeaderBanner";
import ProfileAvatar from "./ProfileAvatar";
import { getApiUrl } from "../../api/api";

type ProfileHeaderProps = {
  profile?: UserProfile | PublicProfile | null;
  isPublic?: boolean;
  avatarUrl?: string | null;
};

export default function ProfileHeader({
  profile: externalProfile,
  isPublic = false,
}: ProfileHeaderProps) {
  const { profile: ownProfile } = useProfile();
  const profile = externalProfile || ownProfile;
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const firstName =
    profile && "firstName" in profile
      ? profile.firstName
      : profile?.displayName?.split(" ")[0];

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!profile?.id) return;
      try {
        let url: string;
        const headers: Record<string, string> = {};
        if (isPublic) {
          url = getApiUrl(`/api/profile/image/${profile.id}?${Date.now()}`);
        } else {
          const token = localStorage.getItem("auth_token");
          if (!token) return;
          url = getApiUrl(`/api/profile/image?${Date.now()}`);
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(url, { headers });
        if (!res.ok) {
          setImageSrc(null);
          return;
        }
        const blob = await res.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch {
        setImageSrc(null);
      }
    };
    fetchProfileImage();
  }, [profile?.id, isPublic]);

  const initial = firstName?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="relative h-52 pb-12 bg-[#faf4ee]">
      <ProfileHeaderBanner />
      <ProfileAvatar imageSrc={imageSrc} initial={initial} />
    </div>
  );
}
