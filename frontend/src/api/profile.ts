import { api } from "./api";

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  city: string;
  profileImageUrl: string | null;
  bio: string;
  interests: string;
  createdAt: string;
}

export interface PublicProfile {
  id: number;
  displayName: string;
  age: number;
  city: string;
  profileImageUrl: string | null;
  bio: string;
  interests: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  city: string;
  bio: string;
  interests: string;
  profileImageUrl?: string | null;
}

// Get current user's profile
export async function getCurrentUserProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>("/api/profile");
  return response.data;
}

// Update current user's profile
export async function updateUserProfile(
  data: UpdateProfileData,
): Promise<UserProfile> {
  const response = await api.put<UserProfile>("/api/profile", data);
  return response.data;
}

// Get another user's public profile
export async function getUserProfileById(
  userId: number,
): Promise<PublicProfile> {
  const response = await api.get<PublicProfile>(`/api/profile/${userId}`);
  return response.data;
}
