import { useProfile } from "../../hooks/useProfile";
import { type UserProfile, type PublicProfile } from "../../api/profile";

type ProfileHeaderProps = {
  profile?: UserProfile | PublicProfile | null;
};

export default function Header({
  profile: externalProfile,
}: ProfileHeaderProps) {
  const { profile: ownProfile } = useProfile();

  const profile = externalProfile || ownProfile;

  const hasValidImage =
    profile?.profileImageUrl &&
    profile.profileImageUrl !== "string" &&
    profile.profileImageUrl.trim() !== "";

  const firstName =
    profile && "firstName" in profile
      ? profile.firstName
      : profile?.displayName?.[0];

  return (
    <div
      className="relative h-52 bg-no-repeat"
      style={{
        backgroundImage: `url("/header-profile-background.png")`,
        backgroundSize: "26rem",
      }}
    >
      {/* Avatar */}
      <div className="absolute left-6 -bottom-12 h-24 w-24 rounded-full bg-white border border-light-green overflow-hidden">
        {hasValidImage ? (
          <img
            src={profile.profileImageUrl!}
            alt={firstName || "Profile"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold mt-1">
            {firstName?.[0]}
          </div>
        )}
      </div>
    </div>
  );
}
