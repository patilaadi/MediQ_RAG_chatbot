import { useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

    const res = await axios.post("http://localhost:8080/api/auth/register", {
      name,
      email,
      password,
    });

    if (res.data.success) {
      alert("Registration Successful");

      window.location.href = "/signin";
    }

    localStorage.setItem("token", "loggedin");

    window.location.href = "/";
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  return (

    <div className="min-h-screen bg-[#343541] flex items-center justify-center px-4 p-10">

      <div className="w-full max-w-md bg-[#202123] rounded-2xl shadow-2xl p-8 border border-gray-700">

        {/* Logo */}
        <div className="flex justify-center mb-6">

          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">

            🩺

          </div>

        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">

          Create your account

        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm">

          Join the AI medical assistant platform

        </p>

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          {/* Name */}
          <div>

            <label className="block text-sm text-gray-300 mb-2">

              Full Name

            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="
                w-full
                bg-[#2A2B32]
                border
                border-gray-600
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500/20
                text-white
                rounded-xl
                px-4
                py-3
                outline-none
                transition-all
              "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>

          {/* Email */}
          <div>

            <label className="block text-sm text-gray-300 mb-2">

              Email Address

            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="
                w-full
                bg-[#2A2B32]
                border
                border-gray-600
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500/20
                text-white
                rounded-xl
                px-4
                py-3
                outline-none
                transition-all
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          {/* Password */}
          <div>

            <label className="block text-sm text-gray-300 mb-2">

              Password

            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="
                w-full
                bg-[#2A2B32]
                border
                border-gray-600
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500/20
                text-white
                rounded-xl
                px-4
                py-3
                outline-none
                transition-all
              "
              value={password}              
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          {/* Register Button */}
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
              duration-200
              shadow-lg
            "
          >

            Create Account

          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">

          Already have an account?{" "}

          <Link to="/signin" className="text-green-400 hover:text-green-300 cursor-pointer">

            Sign In

          </Link>

        </p>

      </div>

    </div>

  );
}