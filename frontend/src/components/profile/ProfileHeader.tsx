import { useProfile } from "../../hooks/useProfile";
import { type UserProfile, type PublicProfile } from "../../api/profile";

type ProfileHeaderProps = {
  profile?: UserProfile | PublicProfile | null;
  isPublic?: boolean;
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
