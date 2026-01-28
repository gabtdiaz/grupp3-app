import { useProfile } from "../../hooks/useProfile";

export default function Header() {
  const { profile } = useProfile();

  const hasValidImage =
    profile?.profileImageUrl &&
    profile.profileImageUrl !== "string" &&
    profile.profileImageUrl.trim() !== "";

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
            alt={`${profile.firstName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold mt-1">
            {profile?.firstName?.[0]}
          </div>
        )}
      </div>
    </div>
  );
}
