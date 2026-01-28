import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type PublicRouteProps = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    // If user is already logged in, redirect to activity feed
    return <Navigate to="/activity" replace />;
  }

  // If user not logged in, show login/register page
  return <>{children}</>;
}
