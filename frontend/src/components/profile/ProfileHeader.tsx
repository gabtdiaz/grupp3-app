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

  //  profileImageUrl direkt från backend!
  // const profileImageUrl = profile?.profileImageUrl || null;

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchProfileImage = async () => {
      if (!profile?.id) {
        console.log(" Ingen profil-ID");
        setImageLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");

        let url: string;
        const headers: Record<string, string> = {};

        if (isPublic) {
          // publik profil
          url = `http://localhost:5011/api/profile/image/${profile.id}`;
          console.log("🔍 Hämtar publik profilbild:", url);
        } else {
          // inloggad användare
          if (!token) {
            console.warn("Ingen auth_token hittad — visar fallbackbild.");
            setImageLoading(false);
            return;
          }
          url = `http://localhost:5011/api/profile/image`;
          headers["Authorization"] = `Bearer ${token}`;
          console.log("Hämtar egen profilbild:", url);
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
          if (res.status === 404) {
            console.log(" Ingen profilbild uppladdad ännu");
          } else {
            console.warn(` Kunde inte hämta bild (HTTP ${res.status})`);
          }
          setImageSrc(null);
          setImageLoading(false);
          return;
        }

        // Hämta blob och skapa Object URL
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
        console.log(" Profilbild hämtad från blob");
        setImageLoading(false);
      } catch (err) {
        console.error(" Fel vid hämtning av profilbild:", err);
        setImageSrc(null);
        setImageLoading(false);
      }
    };

    fetchProfileImage();

    // Cleanup - Frigör object URL när komponenten unmountas
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [profile?.id, isPublic]);
  // tom
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
