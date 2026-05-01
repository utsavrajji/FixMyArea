import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingOverlay from "../components/LoadingOverlay";

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let text = "";
  for (let i = 0; i < 5; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));
  return text;
}

function Register() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const navigate = useNavigate();

  const refreshCaptcha = () => { setCaptcha(generateCaptcha()); setUserCaptcha(""); setError(""); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) { setError("Please enter a valid email first."); return; }
    setOtpLoading(true);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name, otp })
      });
      const data = await response.json();
      if (data.success) { 
        setOtpSent(true); 
        setError(""); 
        toast.success(`OTP sent to ${form.email}`); 
      }
      else {
        setError(data.message || "Failed to send OTP.");
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) { 
      setError("Failed to send OTP. Please check your connection."); 
      toast.error("Failed to send OTP. Please check your connection.");
    }
    finally { setOtpLoading(false); }
  };

  const verifyOtp = () => {
    if (enteredOtp === generatedOtp) { 
      setIsEmailVerified(true); 
      setError(""); 
      toast.success("Email Verified Successfully!"); 
    }
    else {
      setError("Incorrect OTP. Please try again.");
      toast.error("Incorrect OTP. Please try again.");
    }
  };

  const validate = () => {
    if (!form.name || !form.phone || !form.email || !form.password || !form.confirmPassword) { setError("Please fill all fields."); return false; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return false; }
    if (form.password.length < 6) { setError("Password should be at least 6 characters."); return false; }
    if (!isEmailVerified) { setError("Please verify your email address before registering."); return false; }
    if (userCaptcha.trim().toUpperCase() !== captcha.toUpperCase()) { setError("Captcha does not match."); return false; }
    setError(""); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, name: form.name, phone: form.phone, email: form.email,
        role: "citizen", createdAt: new Date().toISOString(), isVerified: true,
      });
      toast.success("Registration successful! Welcome to FixMyArea.");
      navigate("/dashboard");
    } catch (err) {
      console.error("💥 REGISTER ERROR:", err);
      setLoading(false); // Only stop loading if there is an error
      
      let errorMessage = "Registration failed. Please try again.";
      
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered. Please login or use a different email.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is not valid.";
          break;
        case "auth/weak-password":
          errorMessage = "The password is too weak.";
          break;
        default:
          errorMessage = err.message || "Registration failed. Please try again.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage, { 
        duration: 6000,
        icon: '⚠️'
      });
      refreshCaptcha();
    }
  };

  const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all focus:border-[#064E3B] focus:outline-none focus:ring-2 focus:ring-[#064E3B]/15";

  return (
    <>
      <Navbar />
      {loading && <LoadingOverlay message="Creating your account..." />}
      <div className="min-h-screen bg-[#F3F4F6] px-4 py-12">
        <div className="mx-auto w-full max-w-lg">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#064E3B]/10 px-4 py-1.5 text-xs font-semibold text-[#064E3B]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Join the FixMyArea community
            </span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg sm:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#064E3B]">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M-1.5 10l11.25-11.25L21 10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="mt-1 text-sm text-gray-500">Report issues and help transform your locality</p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name</label>
                  <input type="text" name="name" placeholder="Your full name" value={form.name}
                    onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input type="tel" name="phone" placeholder="e.g. 9876543210" value={form.phone}
                    onChange={handleChange} className={inputClass} required />
                </div>
              </div>

              {/* Email + OTP */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email Address</label>
                <div className="flex gap-2">
                  <input type="email" name="email" placeholder="you@example.com" value={form.email}
                    onChange={handleChange} disabled={isEmailVerified}
                    className={`${inputClass} ${isEmailVerified ? "border-emerald-400 bg-emerald-50" : ""}`} required />
                  {!isEmailVerified ? (
                    <button type="button" onClick={sendOtp} disabled={otpLoading || !form.email}
                      className="whitespace-nowrap rounded-xl bg-[#064E3B] px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#053d2f] disabled:opacity-50">
                      {otpLoading ? "..." : "Verify"}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 px-2">✓ Done</span>
                  )}
                </div>
              </div>

              {otpSent && !isEmailVerified && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                  <p className="text-xs font-semibold text-emerald-800">Enter OTP sent to your email</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="6-digit OTP" value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <button type="button" onClick={verifyOtp}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Create Password</label>
                  <input type="password" name="password" placeholder="Min 6 characters" value={form.password}
                    onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Confirm Password</label>
                  <input type="password" name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword}
                    onChange={handleChange} className={inputClass} required />
                </div>
              </div>

              {/* Captcha */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Security Check</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 select-none rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-center font-mono text-lg font-bold tracking-[0.4em] text-gray-700">
                    {captcha}
                  </div>
                  <button type="button" onClick={refreshCaptcha}
                    className="rounded-xl border border-[#064E3B]/20 bg-[#064E3B]/5 px-3 py-2 text-xs font-semibold text-[#064E3B] hover:bg-[#064E3B]/10">
                    ↻ Refresh
                  </button>
                </div>
                <input type="text" placeholder="Type the characters above" value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)} className={inputClass} required />
              </div>

              <button type="submit" disabled={loading || !isEmailVerified}
                className="w-full rounded-xl bg-[#064E3B] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#053d2f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Registering..." : isEmailVerified ? "Create Account" : "Verify Email First"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm font-semibold">
              <span className="text-gray-400">Already have an account? </span>
              <button onClick={() => navigate("/login")} className="text-[#064E3B] transition hover:text-emerald-600">
                Sign in →
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