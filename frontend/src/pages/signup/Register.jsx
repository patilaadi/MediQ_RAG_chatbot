import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Camera, Plus } from "lucide-react";

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  const verifiedEmail = location.state?.email || "";

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", verifiedEmail);
      formData.append("password", password);

      if (profile) {
        formData.append("profile", profile);
      }

      const res = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        alert("Registration Successful");
        navigate("/signin");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#343541] flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-[#202123] border border-gray-700 rounded-2xl shadow-2xl p-8">
        {/* PROFILE */}
        <div className="flex justify-center mb-6">
          <label className="relative cursor-pointer">
            <div className="w-28 h-28 rounded-full bg-[#2A2B32] border-2 border-dashed border-gray-500 flex items-center justify-center overflow-hidden">
              {profile ? (
                <img
                  src={URL.createObjectURL(profile)}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="text-gray-400" size={35} />
              )}
            </div>

            {/* PLUS ICON */}
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-[#202123]">
              <Plus className="text-white" size={18} />
            </div>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </label>
        </div>

        {/* HEADING */}
        <h1 className="text-3xl font-bold text-white text-center">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Complete your registration
        </p>

        {message && (
          <p className="text-center text-yellow-300 mb-4">{message}</p>
        )}

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-[#2A2B32] border border-gray-600 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* VERIFIED EMAIL */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Verified Email
            </label>

            <input
              type="email"
              value={verifiedEmail}
              disabled
              className="w-full bg-[#1E1F25] border border-gray-700 rounded-xl px-4 py-3 text-gray-400"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>

            <input
              type="password"
              placeholder="Create password"
              className="w-full bg-[#2A2B32] border border-gray-600 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full bg-[#2A2B32] border border-gray-600 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* REGISTER */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
