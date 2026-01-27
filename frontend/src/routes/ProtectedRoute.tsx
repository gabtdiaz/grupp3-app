import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  // If not logged in, navigate to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show page
  return <>{children}</>;
}
