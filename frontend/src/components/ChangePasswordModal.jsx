import { useState } from "react";
import axios from "axios";
import { X, LockKeyhole } from "lucide-react";

export default function ChangePasswordModal({ open, setOpen }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8080/api/users/change-password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data?.success) {
        setMessage("Password changed successfully");

        setTimeout(() => {
          setOpen(false);
        }, 1200);
      } else {
        setMessage(res.data?.message || "Failed to change password");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-[#202123]
          border
          border-gray-700
          rounded-2xl
          shadow-2xl
          p-6
          text-white
          animate-in
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-green-500/20
                flex
                items-center
                justify-center
              "
            >
              <LockKeyhole className="text-green-400" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Change Password</h2>

              <p className="text-sm text-gray-400">
                Update your account password
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="
              p-2
              rounded-lg
              hover:bg-[#2A2B32]
              transition-all
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className="
              mb-4
              text-sm
              rounded-xl
              px-4
              py-3
              bg-red-500/10
              border
              border-red-500/20
              text-red-400
            "
          >
            {message}
          </div>
        )}

        {/* CURRENT PASSWORD */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">
            Current Password
          </label>

          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="
              w-full
              bg-[#2A2B32]
              border
              border-gray-600
              focus:border-green-500
              focus:ring-2
              focus:ring-green-500/20
              rounded-xl
              px-4
              py-3
              outline-none
              transition-all
              text-white
            "
          />
        </div>

        {/* NEW PASSWORD */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">
            New Password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="
              w-full
              bg-[#2A2B32]
              border
              border-gray-600
              focus:border-green-500
              focus:ring-2
              focus:ring-green-500/20
              rounded-xl
              px-4
              py-3
              outline-none
              transition-all
              text-white
            "
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="
              w-full
              bg-[#2A2B32]
              border
              border-gray-600
              focus:border-green-500
              focus:ring-2
              focus:ring-green-500/20
              rounded-xl
              px-4
              py-3
              outline-none
              transition-all
              text-white
            "
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="
              px-5
              py-3
              rounded-xl
              bg-[#2A2B32]
              hover:bg-[#343541]
              transition-all
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              px-5
              py-3
              rounded-xl
              bg-green-500
              hover:bg-green-600
              transition-all
              font-medium
            "
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
