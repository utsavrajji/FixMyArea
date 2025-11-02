import { useState } from "react";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    if (userCaptcha.trim().toUpperCase() !== captcha.toUpperCase()) {
      setError("Captcha not matched. Try again!");
      refreshCaptcha();
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        setError("User does not exist.");
        refreshCaptcha();
        setLoading(false);
        return;
      }

      const role = userDoc.data().role;
      setError("");
      alert("Login successful! Redirecting...");

      if (role === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      setError("Invalid email or password.");
      alert("Login failed: Invalid email or password.");
      refreshCaptcha();
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f3fff6] via-white to-[#f8fff8] flex items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-6 hidden h-72 w-72 rounded-[42px] border border-dashed border-[#a3e4c1]/70 bg-[#e7fff0]/60 backdrop-blur-md animate-pulse-soft sm:block" />
        <div className="absolute top-24 right-20 hidden h-56 w-56 rounded-full bg-[#dff8eb]/90 blur-2xl md:block animate-float-rev" />
        <div className="absolute bottom-12 left-1/4 hidden h-64 w-64 rounded-[36px] bg-white/60 shadow-soft-hero lg:block animate-float-slow" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-govBlue shadow-soft-hero/50 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-govGreen animate-pulse-soft" />
          Welcome back
        </div>

        <div className="mt-6 rounded-[32px] border border-[#a3e4c1]/60 bg-gradient-to-br from-white/95 via-white/80 to-[#dff8eb]/90 px-10 py-12 shadow-2xl backdrop-blur-xl">
          <h2 className="text-3xl font-bold text-govText text-center">Login</h2>
          <p className="mt-2 text-center text-gray-600">
            Access your dashboard and continue improving your locality.
          </p>
          {error && (
            <p className="mt-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-600 shadow-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-left text-sm font-semibold text-govText/80">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-govBlue focus:outline-none focus:ring-2 focus:ring-govBlue/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-left text-sm font-semibold text-govText/80">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-govBlue focus:outline-none focus:ring-2 focus:ring-govBlue/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 select-none rounded-2xl bg-white/70 px-4 py-3 text-center text-lg font-bold tracking-[0.4em] text-govText shadow-inner">
                  {captcha}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="rounded-full border border-transparent bg-gradient-to-r from-govBlue to-govBlue/80 px-4 py-2 text-sm font-semibold text-black shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-govBlue/60"
                >
                  Refresh
                </button>
              </div>

              <input
                type="text"
                placeholder="Enter the characters above"
                value={userCaptcha}
                onChange={e => setUserCaptcha(e.target.value)}
                className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-govBlue focus:outline-none focus:ring-2 focus:ring-govBlue/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 font-semibold text-white shadow-2xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500/70 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4 text-sm font-medium text-govBlue/80 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="transition hover:text-orange-600"
            >
              Create an account
            </button>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="transition hover:text-orange-600"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
