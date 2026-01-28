import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import PublicUserProfile from "../pages/PublicProfile";
import Activity from "../pages/Activity";
import ActivityDetail from "../pages/ActivityDetail";
import CreateActivity from "../pages/CreateActivity";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes, redirect to /activity if logged in */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Index />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected routes, only for authenticated users */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <PublicUserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <Activity />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activitydetail/:id"
        element={
          <ProtectedRoute>
            <ActivityDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-activity"
        element={
          <ProtectedRoute>
            <ActivityDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
