import React, { useState } from "react";
import "./SignupPage.css";
import { Link, useNavigate } from "react-router-dom";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebase";

import axios from "axios";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        }
      );

      console.log(res.data);

      // Store ONLY JWT token
      localStorage.setItem(
        "token",
        res.data.token
      );

      // Optional UI data (not auth)
      localStorage.setItem(
        "email",
        res.data.user.email
      );

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      localStorage.setItem(
        "userId",
        res.data.user.id
      );

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        const nameSlug = encodeURIComponent(
          res.data.user.name
            .toLowerCase()
            .replace(/\s+/g, "-")
        );

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
          }
        );

        const threadData =
          await threadRes.json();

        // REDIRECT
        navigate(
          `/chat/${res.data.user.name}/${threadData.threadId}`
        );

      }

    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = result.user;

      console.log(user);

      // Send ONLY user data to backend
      const res = await axios.post(
        "http://localhost:8080/api/auth/google-login",
        {
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
        }
      );

      console.log(res.data);

      // Store backend JWT ONLY
      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      localStorage.setItem(
        "email",
        user.email
      );

      localStorage.setItem("userId", res.data.user.id);
      console.log("User ID stored:", res.data.user.id);

      // Redirect
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        const nameSlug = encodeURIComponent(
          user.displayName
            .toLowerCase()
            .replace(/\s+/g, "-")
        );

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
          }
        );

        const threadData =
          await threadRes.json();

        // REDIRECT
        navigate(
          `/chat/${res.data.user.name}/${threadData.threadId}`
        );

      }

    } catch (error) {
      console.log(error);
      alert("Google Login Failed");
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
        <form className="space-y-5" onSubmit={handleSignin}>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-[#2A2B32] border border-gray-600 text-white rounded-xl px-4 py-3"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full bg-[#2A2B32] border border-gray-600 text-white rounded-xl px-4 py-3"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl"
          >
            Sign In
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">
            OR
          </span>
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
          <Link
            to="/register"
            className="text-green-400"
          >
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
}