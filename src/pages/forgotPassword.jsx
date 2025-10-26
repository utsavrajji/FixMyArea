import { useState } from "react";
import { auth } from "../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent successfully. Check your inbox.");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-4">
      <div className="max-w-md w-full bg-white rounded-lg p-10 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-govBlue">Forgot Password</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

        <form onSubmit={handleReset} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-900 transition"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Remembered password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-govBlue underline hover:text-indigo-800"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
