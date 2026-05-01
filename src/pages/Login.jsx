import { useState } from "react";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const navigate = useNavigate();

  const refreshCaptcha = () => { setCaptcha(generateCaptcha()); setUserCaptcha(""); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter email and password"); return; }
    if (userCaptcha.trim().toUpperCase() !== captcha.toUpperCase()) {
      setError("Captcha does not match. Try again!"); refreshCaptcha(); return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) { 
        const errorMsg = "User profile not found.";
        setError(errorMsg); 
        toast.error(errorMsg);
        await auth.signOut(); 
        refreshCaptcha(); 
        return; 
      }
      const role = userDoc.data().role || "citizen";
      toast.success("Login successful! Welcome back.");
      if (role === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      let errorMessage = "Login failed. Please try again.";
      
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          errorMessage = "Invalid email or password. Please try again.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = err.message || "Login failed. Please try again.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        icon: '🔒'
      });
      refreshCaptcha();
    }
  };

  const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all focus:border-[#064E3B] focus:outline-none focus:ring-2 focus:ring-[#064E3B]/15";

  return (
    <>
      <Navbar />
      {loading && <LoadingOverlay message="Signing you in..." />}
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#064E3B]/10 px-4 py-1.5 text-xs font-semibold text-[#064E3B]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Secure Login Portal
            </span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg sm:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#064E3B]">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="mt-1 text-sm text-gray-500">Sign in to your FixMyArea account</p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email Address</label>
                <input type="email" placeholder="you@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
                <input type="password" placeholder="Enter your password" value={password}
                  onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
              </div>

              {/* Captcha */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Security Check</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 select-none rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-center font-mono text-lg font-bold tracking-[0.4em] text-gray-700">
                    {captcha}
                  </div>
                  <button type="button" onClick={refreshCaptcha}
                    className="rounded-xl border border-[#064E3B]/20 bg-[#064E3B]/5 px-3 py-2 text-xs font-semibold text-[#064E3B] transition hover:bg-[#064E3B]/10">
                    ↻ Refresh
                  </button>
                </div>
                <input type="text" placeholder="Type the characters above" value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)} className={inputClass} required />
              </div>

              <button type="submit" disabled={loading}
                className="w-full rounded-xl bg-[#064E3B] py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#053d2f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-center text-sm sm:flex-row sm:justify-between">
              <button onClick={() => navigate("/register")}
                className="font-semibold text-[#064E3B] transition hover:text-emerald-600">
                Create an account →
              </button>
              <button onClick={() => navigate("/forgot-password")}
                className="text-gray-400 transition hover:text-gray-600">
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
