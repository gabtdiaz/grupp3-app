import { useProfile } from "../../hooks/useProfile";
import { type UserProfile, type PublicProfile } from "../../api/profile";

type InfoProps = {
  profile?: UserProfile | PublicProfile | null;
  showSettings?: boolean;
};

export default function Info({
  profile: externalProfile,
  showSettings = true,
}: InfoProps) {
  const { profile: ownProfile, loading, error } = useProfile();

  // Använd extern profil om den finns, annars egen profil
  const profile = externalProfile || ownProfile;

  // Loading/error states bara om vi använder useProfile
  if (!externalProfile && loading) {
    return (
      <div className="relative pt-16 px-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!externalProfile && error) {
    return (
      <div className="relative pt-16 px-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative pt-16 px-6">
        <p className="text-gray-500">No profile found</p>
      </div>
    );
  }

  // Check if own page or public profile page
  const isOwnProfile = "firstName" in profile;

  const displayName = isOwnProfile
    ? `${profile.firstName} ${profile.lastName}`
    : profile.displayName;

  return (
    <div className="relative pt-16 px-6">
      <h1 className="text-2xl font-serif">{displayName}</h1>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
        <span>{profile.city}</span>
        <span>•</span>
        <span>{profile.age} år</span>
        {isOwnProfile && (
          <>
            <span>•</span>
            <span>{profile.gender}</span>
          </>
        )}
      </div>
      <div>
        <p className="mt-2 text-gray-400 italic text-sm">
          {profile.bio || "No bio yet"}
        </p>
      </div>
      {showSettings && (
        <button className="absolute top-4 right-4 w-7 h-7 rounded-full">
          <img
            src="/icons/settings-icon.svg"
            alt="Settings"
            className="w-7 h-7"
          />
        </button>
      )}
    </div>
  );
}
