import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Camera, Plus } from "lucide-react";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // SEND OTP
  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Please enter email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8080/api/auth/send-otp", {
        email,
        purpose: "register",
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        setOtpSent(true);
        setMessage("OTP sent successfully");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      setMessage("Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
 const handleVerifyOtp = async (e) => {
   e.preventDefault();

   try {
     setLoading(true);

     const payload = {
       email: email,
       code: otp,
       purpose: "register",
     };

     console.log(payload);

     const res = await axios({
       method: "POST",
       url: "http://localhost:8080/api/auth/verify-otp",
       data: payload,
       headers: {
         "Content-Type": "application/json",
       },
     });

     console.log(res.data);

     if (res.data.success) {
       navigate("/register", {
         state: { email },
       });
     }
   } catch (error) {
     console.log(error);

     console.log(error.response);

     console.log(error.response?.data);

     setMessage(error.response?.data?.message || "OTP verification failed");
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="min-h-screen bg-[#343541] flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#202123] border border-gray-700 rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-3xl shadow-lg">
            ✉️
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center">
          Verify Email
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Verify your email before registration
        </p>

        {message && (
          <p className="text-center text-yellow-300 mb-4">{message}</p>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-[#2A2B32] border border-gray-600 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* SEND OTP */}
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            {otpSent ? "Resend OTP" : "Send OTP"}
          </button>

          {/* OTP */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">OTP Code</label>

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full bg-[#2A2B32] border border-gray-600 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {/* VERIFY */}
          <button
            type="submit"
            disabled={!otp}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
}
