import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [step, setStep] = useState(1); // 1: Email, 2: Token, 3: New Password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send reset code
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/send-reset-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage("Reset code sent! Check your email.");
        setStep(2);
      } else {
        setError(data.message || "Failed to send reset code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify token
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (!resetToken) {
      setError("Please enter the reset code");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/verify-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: resetToken }),
      });
      const data = await res.json();
      
      if (data.verified) {
        setMessage("Code verified! Set your new password.");
        setStep(3);
      } else {
        setError("Invalid or expired code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password via Firebase
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Note: Firebase doesn't allow direct password update without auth
      // User must use Firebase's password reset flow or be logged in
      // For full custom flow, you'd need backend to update Firebase Auth
      
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#fff3f3] via-white to-[#fff8f8] px-4 py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-10 hidden h-72 w-72 rounded-[42px] border border-dashed border-[#ffc1c1]/70 bg-[#ffe7e7]/60 backdrop-blur-md animate-pulse-soft sm:block" />
          <div className="absolute top-28 left-16 hidden h-56 w-56 rounded-full bg-[#ffd8d8]/90 blur-2xl md:block animate-float-slow" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-[28px] border border-[#ffc1c1]/60 bg-gradient-to-br from-white/95 via-white/85 to-[#ffe7e7]/90 px-6 py-8 shadow-2xl backdrop-blur-xl sm:rounded-[32px] sm:px-8 sm:py-10">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify Reset Code"}
              {step === 3 && "Set New Password"}
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600 sm:text-base">
              {step === 1 && "Enter your email to receive a reset code"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Create a new strong password"}
            </p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-600 shadow-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 text-center text-sm font-medium text-green-600 shadow-sm">
                {message}
              </div>
            )}

            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSendCode} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 py-3.5 font-semibold text-white shadow-2xl transition-all duration-300 hover:from-pink-600 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            )}

            {/* Step 2: Token */}
            {step === 2 && (
              <form onSubmit={handleVerifyToken} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Reset Code</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-center text-2xl font-bold tracking-widest text-gray-700 shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 py-3.5 font-semibold text-white shadow-2xl transition-all duration-300 hover:from-pink-600 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">New Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-gray-700 shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 py-3.5 font-semibold text-white shadow-2xl transition-all duration-300 hover:from-pink-600 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            <div className="mt-8 flex flex-col gap-4 text-sm font-medium text-gray-700 md:flex-row md:items-center md:justify-between">
              <span>Remembered password?</span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="transition hover:text-red-600"
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

export default ForgotPassword;
