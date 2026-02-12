import { useProfile } from "../../hooks/useProfile";
import { type UserProfile, type PublicProfile } from "../../api/profile";
import ProfileHeaderBanner from "./ProfileHeaderBanner";
import ProfileAvatar from "./ProfileAvatar";

type ProfileHeaderProps = {
  profile?: UserProfile | PublicProfile | null;
  isPublic?: boolean;
  avatarUrl?: string | null;
};

export default function ProfileHeader({
  profile: externalProfile,
}: ProfileHeaderProps) {
  const { profile: ownProfile } = useProfile();
  const profile = externalProfile || ownProfile;

  const firstName =
    profile && "firstName" in profile
      ? profile.firstName
      : profile?.displayName?.split(" ")[0];

  //  Använd profileImageUrl direkt från backend!
  const profileImageUrl = profile?.profileImageUrl || null;

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!profile?.id) return;

      try {
        let url: string;
        const headers: Record<string, string> = {};

        if (isPublic) {
          url = `http://localhost:5011/api/profile/image/${profile.id}?${Date.now()}`;
        } else {
          const token = localStorage.getItem("auth_token");
          if (!token) return;
          url = `http://localhost:5011/api/profile/image?${Date.now()}`;
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
    // Outer: no overflow-hidden so avatar can hang below the banner
    <div className="relative h-52 pb-12 bg-[#faf4ee]">
      <ProfileHeaderBanner />
      <ProfileAvatar imageSrc={imageSrc} initial={initial} />

  // ✅ DEBUG - lägg till detta!
  console.log("🖼️ ProfileHeader DEBUG:");
  console.log("  - profile:", profile);
  console.log("  - profileImageUrl:", profileImageUrl);
  console.log("  - externalProfile:", externalProfile);
  console.log("  - ownProfile:", ownProfile);

  return (
    <div
      className="relative h-52 bg-no-repeat bg-left-top"
      style={{
        backgroundImage: `url("/header-profile-background.png")`,
        backgroundSize: "26rem",
      }}
    >
      <div className="absolute left-6 -bottom-12 h-24 w-24 rounded-full bg-white border border-light-green overflow-hidden">
        {profileImageUrl ? (
          //  Visa bild direkt från URL
          <img
            src={profileImageUrl}
            alt="Profilbild"
            className="w-24 h-24 rounded-full object-cover"
            onError={(e) => {
              console.error("Kunde inte ladda profilbild");
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          // Fallback - visa initial
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold bg-gray-100">
            {firstName?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>

    </div>
  );
}
