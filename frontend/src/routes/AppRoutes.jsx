import { Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "../pages/signup/SignupPage";
import ChatPage from "../pages/ChatPage";
import Register from "../pages/signup/Register";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {

  const token = localStorage.getItem("token");

  return (

    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={
          token
            ? <Navigate to="/signin" replace />
            : <Navigate to="/signin" replace />
        }
      />

      {/* Signin */}
      <Route
        path="/signin"
        element={
          token
            ? <SignupPage />
            : <SignupPage />
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

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
      <Route
        path="*"
        element={<Navigate to="/signin" replace />}
      />

    </Routes>

  );
};

export default AppRoutes;