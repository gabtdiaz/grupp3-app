import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { profile: ownProfile, loading, error } = useProfile();
  const profile = externalProfile || ownProfile;

  if (!externalProfile && loading) {
    return (
      <div className="relative pt-16 px-6">
        <p className="text-gray-500">Laddar profil...</p>
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
        <p className="text-gray-500">Ingen profil hittad</p>
      </div>
    );
  }

  const isOwnProfile = "firstName" in profile;
  const displayName = isOwnProfile
    ? `${profile.firstName} ${profile.lastName}`
    : profile.displayName;

  return (
    <div className="relative pt-16 px-6">
      <h1 className="text-2xl font-serif">{displayName}</h1>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
        {/* City - show if available (respects privacy for public profiles) */}
        {profile.city && (
          <>
            <span>{profile.city}</span>
            {(profile.age || profile.gender) && <span>•</span>}
          </>
        )}

        {/* Age - show if available (respects privacy for public profiles) */}
        {profile.age && (
          <>
            <span>{profile.age} år</span>
            {profile.gender && <span>•</span>}
          </>
        )}

        {/* Gender - show if available (respects privacy for public profiles) */}
        {profile.gender && <span>{profile.gender}</span>}
      </div>

      <div>
        <p className="mt-2 text-gray-400 italic text-sm">
          {profile.bio || "No bio yet"}
        </p>
      </div>

      {showSettings && isOwnProfile && (
        <button
          type="button"
          onClick={() => navigate("/settings")}
          aria-label="Öppna inställningar"
          className="absolute -top-5 right-5 w-5 h-5 rounded-full"
        >
          <img src="/icons/settings-icon.svg" alt="" className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}
