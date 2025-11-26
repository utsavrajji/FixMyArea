import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import Footer from "../components/Footer";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent! Check your inbox (and spam folder).");
      setEmail("");
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#fff3f3] via-white to-[#fff8f8] px-4 py-12">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-10 hidden h-72 w-72 rounded-[42px] border border-dashed border-[#ffc1c1]/70 bg-[#ffe7e7]/60 backdrop-blur-md animate-pulse-soft sm:block" />
          <div className="absolute top-28 left-16 hidden h-56 w-56 rounded-full bg-[#ffd8d8]/90 blur-2xl md:block animate-float-slow" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-[28px] border border-[#ffc1c1]/60 bg-gradient-to-br from-white/95 via-white/85 to-[#ffe7e7]/90 px-6 py-8 shadow-2xl backdrop-blur-xl sm:rounded-[32px] sm:px-8 sm:py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Forgot Password?
              </h2>
              <p className="mt-3 text-sm text-gray-600 sm:text-base">
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-600 shadow-sm animate-shake">
                ❌ {error}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 text-center text-sm font-medium text-green-600 shadow-sm">
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 py-3.5 font-semibold text-white shadow-2xl transition-all duration-300 hover:from-pink-600 hover:to-red-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>📧</span>
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 flex flex-col gap-4 text-sm font-medium text-gray-700 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="transition hover:text-red-600 flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span>Back to Login</span>
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="transition hover:text-red-600"
              >
                Create Account
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 rounded-xl bg-blue-50/80 border border-blue-200 px-4 py-3 text-xs text-blue-700">
              <p className="font-semibold mb-1">💡 How it works:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Enter your registered email</li>
                <li>Check your inbox for reset link</li>
                <li>Click link to set new password</li>
                <li>Login with new password</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>

      <Footer />
    </>
  );
}

export default ForgotPassword;
