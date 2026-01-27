import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Activity from "../pages/Activity";
import ActivityDetail from "../pages/ActivityDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/activitydetail" element={<ActivityDetail />} />
    </Routes>
  );
};

export default AppRoutes;
