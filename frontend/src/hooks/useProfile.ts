import { useState, useEffect } from "react";
import { getCurrentUserProfile, type UserProfile } from "../api/profile";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurrentUserProfile();
      setProfile(data);
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProfile();
  };

  return {
    profile,
    loading,
    error,
    refetch,
  };
}
