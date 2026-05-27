import { Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "../pages/signup/SignupPage";
import HomePage from "../pages/HomePage";
import ChatPage from "../pages/ChatPage";
import Register from "../pages/signup/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../admin/pages/Dashboard";
import AdminRoute from "../admin/admin_routes/Admin_route";
import Chats from "../admin/pages/Chats";
import Documents from "../admin/pages/Documents";
import Analytics from "../admin/pages/Analytics";
import Settings from "../admin/pages/Settings";
import AdminLayout from "../admin/pages/Admin_layout";
import VerifyEmail from "../pages/signup/VerifyEmail";


const AppRoutes = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="chats" element={<Chats />} />

        <Route path="documents" element={<Documents />} />

        <Route path="analytics" element={<Analytics />} />

        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Signin */}
      <Route path="/signin" element={token ? <SignupPage /> : <SignupPage />} />

      {/* Register */}
      <Route path="/register" element={<Register />} />

      {/* Verify Email */}
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Chat */}
      <Route
        path="/chat/:name/:threadId"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

export default AppRoutes;
