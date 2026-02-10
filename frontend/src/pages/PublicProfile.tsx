import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserProfileById, type PublicProfile } from "../api/profile";
import Header from "../components/profile/ProfileHeader";
import Info from "../components/profile/Info";
import BottomNav from "../components/layout/BottomNav";

export default function PublicUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserProfileById(parseInt(userId!, 10));
        setProfile(data);
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err);
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Skickar isPublic=true så ProfileHeader hämtar via userId */}
      <Header profile={profile} isPublic={true} />
      <Info profile={profile} showSettings={false} />

      <div
        className="flex-1 flex pb-10 mt-8"
        style={{
          backgroundImage: "url('/activity-feed-background.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 20%",
          backgroundSize: "90%",
        }}
      >
        {/* Tom just nu */}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
