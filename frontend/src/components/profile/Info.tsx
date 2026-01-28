import { useProfile } from "../../hooks/useProfile";

export default function Info() {
  const { profile, loading, error } = useProfile();

  // Loading state
  if (loading) {
    return (
      <div className="relative pt-16 px-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative pt-16 px-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // No profile found
  if (!profile) {
    return (
      <div className="relative pt-16 px-6">
        <p className="text-gray-500">No profile found</p>
      </div>
    );
  }

  return (
    <div className="relative pt-16 px-6">
      <h1 className="text-2xl font-serif">
        {profile.firstName} {profile.lastName}
      </h1>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
        <span>{profile.city}</span>
        <span>•</span>

        <span>{profile.age}</span>
        <span>•</span>
        <span>{profile.gender}</span>
      </div>
      <div>
        <p className="mt-2 text-gray-400 italic text-sm">
          {profile.bio || "No bio yet"}
        </p>
      </div>
      <button className="absolute top-4 right-4 w-7 h-7 rounded-full ">
        <img
          src="/icons/settings-icon.svg"
          alt="Settings"
          className="w-7 h-7"
        />
      </button>
    </div>
  );
}
