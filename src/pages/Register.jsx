import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Register() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const navigate = useNavigate();

  function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  }

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserCaptcha("");
    setError("");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name || !form.phone || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill all fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email format.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return false;
    }
    if (userCaptcha.trim().toUpperCase() !== captcha.toUpperCase()) {
      setError("Captcha does not match. Please try again.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Step 1: Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Step 2: Create Firestore user document with same UID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name,
        phone: form.phone,
        email: form.email,
        role: "citizen",
        createdAt: new Date().toISOString(),
      });

      setError("");
      alert("Registration successful! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err.code, err.message);
      
      // Handle specific Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
        alert("Account already exists with this email. Please log in!");
      } else if (err.code === "permission-denied") {
        setError("Permission denied. Please check Firestore security rules.");
        alert("Registration failed: Permission denied. Contact support.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
        alert(`Registration failed: ${err.message}`);
      }
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#f3fff6] via-white to-[#f8fff8] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-10 hidden h-72 w-72 rounded-[42px] border border-dashed border-[#a3e4c1]/70 bg-[#e7fff0]/60 backdrop-blur-md animate-pulse-soft sm:block" />
          <div className="absolute top-28 left-16 hidden h-56 w-56 rounded-full bg-[#dff8eb]/90 blur-2xl md:block animate-float-slow" />
          <div className="absolute bottom-10 right-1/4 hidden h-64 w-64 rounded-[36px] bg-white/60 shadow-soft-hero/80 lg:block animate-float-rev" />
        </div>

        
   <div className="relative z-10 w-full max-w-md sm:max-w-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-medium text-blue-600 shadow-lg backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Join the FixMyArea community
        </div>
        <div className="mt-6 rounded-[28px] border border-[#a3e4c1]/60 bg-gradient-to-br from-white/95 via-white/85 to-[#dff8eb]/90 px-6 py-8 shadow-2xl backdrop-blur-xl sm:rounded-[32px] sm:px-8 sm:py-10">
          <h2 className="text-center text-2xl font-bold text-govText sm:text-3xl">Create your account</h2>
          <p className="mt-3 text-center text-sm text-gray-600 sm:mt-2 sm:text-base">
            Report issues, rally community support, and help transform your locality.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-600 shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-govText/80">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-govBlue focus:outline-none focus:ring-2 focus:ring-govBlue/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-govText/80">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. 9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-govBlue focus:outline-none focus:ring-2 focus:ring-govBlue/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-govText/80">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-govBlue focus:outline-none focus:ring-2 focus:ring-govBlue/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-govText/80">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-govBlue focus:outline-none focus:ring-2 focus:ring-govBlue/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-govText/80">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-govBlue focus:outline-none focus:ring-2 focus:ring-govBlue/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:justify-between">
                <div className="flex-1 select-none rounded-2xl bg-white/70 px-4 py-3 text-center text-base font-bold tracking-[0.3em] text-govText shadow-inner sm:text-lg sm:tracking-[0.4em]">
                  {captcha}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-blue-700 sm:w-auto"
                >
                  Refresh
                </button>
              </div>

              <input
                type="text"
                placeholder="Enter the characters above"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
                className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-govBlue focus:outline-none focus:ring-2 focus:ring-govBlue/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 font-semibold text-white shadow-2xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500/70 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4 text-sm font-medium text-govBlue/80 md:flex-row md:items-center md:justify-between">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="transition hover:text-orange-600"
            >
              Log in instead
            </button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;