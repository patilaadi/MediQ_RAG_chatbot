import { Link } from "react-router-dom";
import { useState } from "react";
import {
  HeartPulse,
  ShieldCheck,
  Brain,
  FileText,
  Activity,
} from "lucide-react";

export default function HomePage() {
  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateContact = () => {
    const { firstName, lastName, email, message } = contactData;
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return "Please fill out all fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (message.trim().length < 10) {
      return "Please describe your request in at least 10 characters.";
    }

    return "";
  };

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError("");
    setContactSuccess(false);

    const validationMsg = validateContact();
    if (validationMsg) {
      setContactError(validationMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();
      if (!response.ok) {
        setContactError(data.message || "Unable to send your message.");
        return;
      }

      setContactSuccess(true);
      setContactData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (error) {
      setContactError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>

        <div className="absolute w-96 h-96 bg-green-500/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-2xl">
            <HeartPulse size={26} className="text-black" />
          </div>

          <h1 className="text-2xl font-bold tracking-wide">MediQ AI</h1>
        </div>

        <div className="hidden md:flex gap-10 text-sm text-gray-300">
          <a href="#home" className="hover:text-green-400 transition-all">
            Home
          </a>

          <a href="#features" className="hover:text-green-400 transition-all">
            Features
          </a>

          <a href="#about" className="hover:text-green-400 transition-all">
            About
          </a>

          <a href="#contact" className="hover:text-green-400 transition-all">
            Contact
          </a>
        </div>

        <Link
          to="/signin"
          className="
            bg-green-500
            text-black
            px-6
            py-2.5
            rounded-full
            font-semibold
            hover:scale-105
            transition-all
            shadow-lg
            shadow-green-500/30
          "
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          pt-20
          pb-28
          grid
          lg:grid-cols-2
          gap-16
          items-center
        "
      >
        {/* Left */}
        <div>
          <p className="text-green-400 uppercase tracking-[0.3em] font-semibold mb-5 animate-pulse">
            AI Medical Chatbot
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Smart Healthcare
            <span className="text-green-400 block">Powered by AI</span>
          </h1>

          <p className="mt-7 text-lg text-gray-300 leading-relaxed max-w-2xl">
            Upload medical reports, chat with AI doctors, understand diseases,
            get precautions, medicines, and instant healthcare guidance using
            MediQ AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-5">
            <Link
              to="/signin"
              className="
                bg-green-500
                hover:bg-green-400
                text-black
                px-8
                py-4
                rounded-2xl
                font-bold
                text-lg
                transition-all
                hover:scale-105
                shadow-xl
                shadow-green-500/30
              "
            >
              Start Chatting
            </Link>

            <a
              href="#features"
              className="
                border
                border-white/20
                hover:border-green-400
                px-8
                py-4
                rounded-2xl
                text-lg
                transition-all
                hover:bg-white/5
              "
            >
              Explore Features
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-12">
            <div>
              <h3 className="text-3xl font-bold text-green-400">24/7</h3>
              <p className="text-gray-400 text-sm">AI Assistance</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-green-400">10K+</h3>
              <p className="text-gray-400 text-sm">Reports Analyzed</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-green-400">99%</h3>
              <p className="text-gray-400 text-sm">Secure Data</p>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="relative">
          <div
            className="
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              rounded-[35px]
              p-8
              shadow-2xl
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>

            {/* Chat */}
            <div className="space-y-5">
              <div className="bg-[#1E293B] rounded-2xl p-4 w-fit max-w-sm">
                <p className="text-sm text-gray-300">
                  Hello 👋 Upload your medical report for AI analysis.
                </p>
              </div>

              <div className="bg-green-500 text-black rounded-2xl p-4 ml-auto w-fit max-w-sm font-medium">
                I uploaded my blood report.
              </div>

              <div className="bg-[#1E293B] rounded-2xl p-4 max-w-sm">
                <p className="text-sm text-gray-300">
                  Your hemoglobin level is slightly low. Increase iron-rich
                  foods and consult a doctor if symptoms persist.
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 pb-28"
      >
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Powerful AI Healthcare Features
          </h2>

          <p className="text-gray-400 mt-5 text-lg">
            Everything you need in one smart medical platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FileText size={34} />,
              title: "PDF Report Analysis",
              desc: "Upload and analyze medical reports instantly.",
            },
            {
              icon: <Brain size={34} />,
              title: "AI Diagnosis",
              desc: "Get AI-generated medical insights and summaries.",
            },
            {
              icon: <ShieldCheck size={34} />,
              title: "Secure Data",
              desc: "Protected healthcare data with secure sessions.",
            },
            {
              icon: <Activity size={34} />,
              title: "Health Monitoring",
              desc: "Track symptoms and healthcare progress.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-8
                hover:-translate-y-2
                transition-all
                hover:border-green-400/40
                backdrop-blur-xl
              "
            >
              <div className="text-green-400 mb-5">{item.icon}</div>

              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>

              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="relative z-10 max-w-6xl mx-auto px-6 pb-28"
      >
        <div
          className="
            relative
            overflow-hidden
            bg-white/5
            border
            border-white/10
            rounded-[40px]
            p-12
            backdrop-blur-xl
          "
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-500/20 blur-3xl rounded-full animate-pulse"></div>

          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div>
              <p className="text-green-400 uppercase tracking-[0.3em] font-semibold mb-4">
                About MediQ AI
              </p>

              <h2 className="text-5xl font-bold mb-8 leading-tight">
                Future of
                <span className="text-green-400 block">AI Healthcare</span>
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">
                MediQ AI is an intelligent medical chatbot platform that helps
                users understand medical reports, diseases, medicines, and
                precautions using advanced AI technology.
              </p>

              <p className="text-gray-400 mt-6 leading-relaxed">
                The platform is designed to simplify healthcare guidance through
                secure report uploads, AI-powered analysis, and interactive
                medical conversations available anytime.
              </p>

              <div className="grid grid-cols-3 gap-6 mt-10">
                <div className="bg-[#111827] rounded-2xl p-5 text-center hover:scale-105 transition-all">
                  <h3 className="text-3xl font-bold text-green-400">10K+</h3>
                  <p className="text-gray-400 text-sm mt-1">Users</p>
                </div>

                <div className="bg-[#111827] rounded-2xl p-5 text-center hover:scale-105 transition-all">
                  <h3 className="text-3xl font-bold text-cyan-400">24/7</h3>
                  <p className="text-gray-400 text-sm mt-1">AI Support</p>
                </div>

                <div className="bg-[#111827] rounded-2xl p-5 text-center hover:scale-105 transition-all">
                  <h3 className="text-3xl font-bold text-pink-400">99%</h3>
                  <p className="text-gray-400 text-sm mt-1">Secure</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative flex justify-center">
              <div
                className="
                  w-[350px]
                  h-[350px]
                  rounded-full
                  bg-gradient-to-br
                  from-green-400
                  to-cyan-500
                  blur-3xl
                  opacity-30
                  absolute
                  animate-pulse
                "
              ></div>

              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop"
                alt="Medical AI"
                className="
                  relative
                  z-10
                  rounded-[35px]
                  shadow-2xl
                  border
                  border-white/10
                  hover:scale-105
                  transition-all
                  duration-500
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="relative z-10 max-w-7xl mx-auto px-6 pb-24"
      >
        <div
          className="
      relative
      overflow-hidden
      rounded-[40px]
      border
      border-white/10
      bg-white/5
      backdrop-blur-2xl
      shadow-2xl
    "
        >
          {/* Glow Effects */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="grid lg:grid-cols-2 relative z-10">
            {/* LEFT SIDE */}
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <p className="uppercase tracking-[0.3em] text-green-400 font-semibold mb-4">
                Contact Us
              </p>

              <h2 className="text-5xl font-black leading-tight mb-6">
                Let’s Build
                <span className="text-green-400 block">Smarter Healthcare</span>
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed mb-10">
                Have questions about AI medical reports, chatbot analysis,
                healthcare guidance, or account support? Our MediQ AI team is
                available anytime to help you.
              </p>

              {/* Contact Cards */}
              <div className="space-y-5">
                <div
                  className="
              flex
              items-center
              gap-4
              bg-[#111827]
              border
              border-white/10
              rounded-2xl
              p-5
              hover:scale-105
              transition-all
            "
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-2xl">
                    📧
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Email Support</p>
                    <h4 className="text-lg font-semibold">support@mediq.ai</h4>
                  </div>
                </div>

                <div
                  className="
              flex
              items-center
              gap-4
              bg-[#111827]
              border
              border-white/10
              rounded-2xl
              p-5
              hover:scale-105
              transition-all
            "
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-2xl">
                    📞
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Call Us</p>
                    <h4 className="text-lg font-semibold">+91 9876543210</h4>
                  </div>
                </div>

                <div
                  className="
              flex
              items-center
              gap-4
              bg-[#111827]
              border
              border-white/10
              rounded-2xl
              p-5
              hover:scale-105
              transition-all
            "
                >
                  <div className="w-14 h-14 rounded-2xl bg-pink-500 flex items-center justify-center text-2xl">
                    📍
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <h4 className="text-lg font-semibold">
                      Kolhapur, Maharashtra, India
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="p-8 lg:p-16 flex items-center justify-center">
              <div
                className="
            bg-[#0F172A]
            border
            border-white/10
            rounded-[32px]
            p-8
            shadow-2xl
          "
              >
                <p className="uppercase tracking-[0.3em] text-green-400 text-sm font-semibold mb-4">
                  Send Message
                </p>

                <h3 className="text-3xl font-black mb-8">How can we help?</h3>

                <form className="space-y-5" onSubmit={handleContactSubmit}>
                  {/* Name Fields */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={contactData.firstName}
                        onChange={handleContactChange}
                        placeholder=" First Name"
                        className="
                    mt-2
                    w-full
                    bg-[#111827]
                    border
                    border-white/10
                    rounded-2xl
                    px-5
                    py-4
                    text-white
                    outline-none
                    focus:border-green-400
                    focus:ring-2
                    focus:ring-green-400/20
                    transition-all
                  "
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="lastName"
                        value={contactData.lastName}
                        onChange={handleContactChange}
                        placeholder="Last Name"
                        className="
                    mt-2
                    w-full
                    bg-[#111827]
                    border
                    border-white/10
                    rounded-2xl
                    px-5
                    py-4
                    text-white
                    outline-none
                    focus:border-green-400
                    focus:ring-2
                    focus:ring-green-400/20
                    transition-all
                  "
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    

                    <input
                      type="email"
                      name="email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      placeholder="Email Address"
                      className="
                  mt-2
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  px-5
                  py-4
                  text-white
                  outline-none
                  focus:border-green-400
                  focus:ring-2
                  focus:ring-green-400/20
                  transition-all
                "
                    />
                  </div>

                  {/* Message */}
                  <div>
                    

                    <textarea
                      rows={5}
                      name="message"
                      value={contactData.message}
                      onChange={handleContactChange}
                      placeholder="Write your message..."
                      className="
                  mt-2
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  px-5
                  py-4
                  text-white
                  outline-none
                  resize-none
                  focus:border-green-400
                  focus:ring-2
                  focus:ring-green-400/20
                  transition-all
                "
                    />
                  </div>

                  {/* Error */}
                  {contactError && (
                    <div
                      className="
                  bg-red-500/10
                  border
                  border-red-500/30
                  text-red-300
                  rounded-2xl
                  p-4
                  text-sm
                "
                    >
                      {contactError}
                    </div>
                  )}

                  {/* Success */}
                  {contactSuccess && (
                    <div
                      className="
                  bg-green-500/10
                  border
                  border-green-500/30
                  text-green-300
                  rounded-2xl
                  p-4
                  text-sm
                "
                    >
                      Message sent successfully 🚀
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                w-full
                bg-green-500
                hover:bg-green-400
                text-black
                font-bold
                py-4
                rounded-2xl
                transition-all
                hover:scale-[1.02]
                shadow-xl
                shadow-green-500/20
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
