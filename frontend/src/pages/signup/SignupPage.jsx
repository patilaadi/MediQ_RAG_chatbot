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
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        },
      );

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

      const res = await axios.post(
        "http://localhost:8080/api/auth/google-login",
        {
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
        },
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("role", res.data.user.role);

      localStorage.setItem("email", user.email);

      localStorage.setItem("userId", res.data.user.id);

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
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

        navigate(`/chat/${res.data.user.name}/${threadData.threadId}`);
      }
    } catch (error) {
      console.log(error);
      alert("Google Login Failed");
    }
  };

  // =========================
  // SEND OTP
  // =========================
  const handleSendResetOtp = async () => {
    if (!email) {
      setMessage("Enter your email to receive a reset OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/send-otp",
        {
          email,
          purpose: "forgot-password",
        },
      );

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

  // =========================
  // RESET PASSWORD
  // =========================
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
    <div className="min-h-screen bg-[#343541] flex items-center justify-center px-4 p-10 relative overflow-hidden">

      {/* ================= BACKGROUND EFFECTS ================= */}

      {/* TOP LEFT GLOW */}
      <div
        className="
          absolute
          w-96
          h-96
          bg-green-500/20
          blur-3xl
          rounded-full
          -top-24
          -left-24
          animate-pulse
        "
      ></div>

      {/* BOTTOM RIGHT GLOW */}
      <div
        className="
          absolute
          w-[500px]
          h-[500px]
          bg-cyan-500/20
          blur-3xl
          rounded-full
          -bottom-32
          -right-32
          animate-pulse
        "
      ></div>

      {/* CENTER GLOW */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[300px]
          h-[300px]
          bg-green-400/10
          blur-3xl
          rounded-full
        "
      ></div>

      {/* GRID EFFECT */}
      <div
        className="
          absolute
          inset-0
          opacity-10
          [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
          [background-size:40px_40px]
        "
      ></div>

      {/* ================= LOGIN CARD ================= */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-[#202123]/90
          backdrop-blur-xl
          rounded-3xl
          shadow-2xl
          p-8
          border
          border-gray-700
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="
              w-16
              h-16
              rounded-full
              bg-green-500
              flex
              items-center
              justify-center
              text-white
              text-3xl
              font-bold
              shadow-lg
              shadow-green-500/40
            "
          >
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
              <p className="text-sm text-yellow-300 text-center">
                {message}
              </p>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  bg-[#2A2B32]
                  border
                  border-gray-600
                  text-white
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-green-500
                "
              />
            </div>

            <button
              type="button"
              onClick={handleSendResetOtp}
              disabled={!email || loading}
              className="
                w-full
                bg-green-500
                hover:bg-green-600
                text-white
                font-semibold
                py-3
                rounded-xl
                transition-all
                disabled:opacity-50
              "
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
                className="
                  w-full
                  bg-[#2A2B32]
                  border
                  border-gray-600
                  text-white
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-green-500
                "
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
                className="
                  w-full
                  bg-[#2A2B32]
                  border
                  border-gray-600
                  text-white
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-green-500
                "
              />
            </div>

            <button
              type="submit"
              disabled={!email || !resetOtp || !resetPassword || loading}
              className="
                w-full
                bg-green-500
                hover:bg-green-600
                text-white
                font-semibold
                py-3
                rounded-xl
                transition-all
                disabled:opacity-50
              "
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
              className="
                w-full
                text-center
                text-green-300
                underline
                mt-2
              "
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <>
            {message && (
              <p className="text-sm text-yellow-300 text-center">
                {message}
              </p>
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
                  className="
                    w-full
                    bg-[#2A2B32]
                    border
                    border-gray-600
                    text-white
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:border-green-500
                  "
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
                  className="
                    w-full
                    bg-[#2A2B32]
                    border
                    border-gray-600
                    text-white
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:border-green-500
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  w-full
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  font-semibold
                  py-3
                  rounded-xl
                  transition-all
                "
              >
                Sign In
              </button>
            </form>

            <div className="text-right mt-3">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setMessage("");
                }}
                className="
                  text-sm
                  text-green-400
                  hover:text-green-300
                "
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
          className="
            w-full
            border
            border-gray-600
            hover:bg-[#2A2B32]
            text-white
            py-3
            rounded-xl
            flex
            items-center
            justify-center
            gap-3
            transition-all
          "
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
          <Link
            to="/verify-email"
            className="text-green-400 hover:text-green-300"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}