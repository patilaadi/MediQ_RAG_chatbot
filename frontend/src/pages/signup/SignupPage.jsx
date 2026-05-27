import React, { useState } from "react";
import "./SignupPage.css";
import { Link, useNavigate } from "react-router-dom";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebase";

import axios from "axios";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // EMAIL + PASSWORD LOGIN
  // =========================
  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      // ================= ADMIN CHECK =================

      // ================= NORMAL USER LOGIN =================
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      // USER FLOW
      const threadRes = await fetch(
        "http://localhost:8080/api/threads/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: res.data.user.id,
          }),
        },
      );

      const threadData = await threadRes.json();

      navigate(`/chat/${res.data.user.name}/${threadData.threadId}`);
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Login Failed");
    }
  };
  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      console.log(user);

      // Send ONLY user data to backend
      const res = await axios.post(
        "http://localhost:8080/api/auth/google-login",
        {
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
        },
      );

      console.log(res.data);
      const role = res.data.role || res.data.user.role;

      // Store backend JWT ONLY
      localStorage.setItem("token", res.data.token);

      localStorage.setItem("role", res.data.user.role);

      localStorage.setItem("email", user.email);

      localStorage.setItem("userId", res.data.user.id);
      console.log("User ID stored:", res.data.user.id);

      // Redirect
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        // CREATE THREAD
        const threadRes = await fetch(
          "http://localhost:8080/api/threads/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: res.data.user.id,
            }),
          },
        );

        const threadData = await threadRes.json();

        // REDIRECT
        navigate(`/chat/${res.data.user.name}/${threadData.threadId}`);
      }
    } catch (error) {
      console.log(error);
      alert("Google Login Failed");
    }
  };

  const handleSendResetOtp = async () => {
    if (!email) {
      setMessage("Enter your email to receive a reset OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/send-otp", {
        email,
        purpose: "forgot-password",
      });

      if (res.data.success) {
        setOtpSent(true);
        setMessage(
          "OTP sent to your email. Enter it below to reset your password.",
        );
      } else {
        setMessage(res.data.message || "Unable to send OTP.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !resetOtp || !resetPassword) {
      setMessage("Email, OTP, and new password are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/forgot-password/reset",
        {
          email,
          otp: resetOtp,
          new_password: resetPassword,
        },
      );

      if (res.data.success) {
        alert(
          "Password reset successful. Please sign in with your new password.",
        );
        setIsResetMode(false);
        setOtpSent(false);
        setResetOtp("");
        setResetPassword("");
        return;
      }

      setMessage(res.data.message || "Reset failed. Please try again.");
    } catch (error) {
      console.error(error);
      setMessage("Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#343541] flex items-center justify-center px-4 p-10">
      <div className="w-full max-w-md bg-[#202123] rounded-2xl shadow-2xl p-8 border border-gray-700">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
            🩺
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Sign in to MediQ AI
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm">
          Welcome back to your AI assistant
        </p>

        {/* FORM */}
        {isResetMode ? (
          <form className="space-y-5" onSubmit={handleResetPassword}>
            {message && (
              <p className="text-sm text-yellow-300 text-center">{message}</p>
            )}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2A2B32] border border-gray-600 text-white rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="button"
              onClick={handleSendResetOtp}
              disabled={!email || loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </button>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                OTP Code
              </label>
              <input
                type="text"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                className="w-full bg-[#2A2B32] border border-gray-600 text-white rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full bg-[#2A2B32] border border-gray-600 text-white rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={!email || !resetOtp || !resetPassword || loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Password
            </button>

            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setMessage("");
                setOtpSent(false);
              }}
              className="w-full text-center text-green-300 underline mt-2"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <>
            {message && (
              <p className="text-sm text-yellow-300 text-center">{message}</p>
            )}
            <form className="space-y-5" onSubmit={handleSignin}>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2A2B32] border border-gray-600 text-white rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2A2B32] border border-gray-600 text-white rounded-xl px-4 py-3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl"
              >
                Sign In
              </button>
            </form>

            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setMessage("");
                }}
                className="text-sm text-green-400 hover:text-green-300"
              >
                Forgot password?
              </button>
            </div>
          </>
        )}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-600 hover:bg-[#2A2B32] text-white py-3 rounded-xl flex items-center justify-center gap-3"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Don't have an account?{" "}
          <Link to="/verify-email" className="text-green-400">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
