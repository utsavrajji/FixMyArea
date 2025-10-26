import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Set your admin password here
const ADMIN_PASSWORD = "Utsav123";

export default function AdminGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Always effect for redirect (best practice!)
  useEffect(() => {
    if (sessionStorage.getItem("admin") === "true") {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin", "true");
      navigate("/admin-dashboard", { replace: true });
    } else {
      setError("Invalid password. Access denied.");
    }
  };

  // Don't use navigate() directly in render, only in useEffect.

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-xs bg-white rounded shadow p-8">
        <h1 className="text-xl font-bold text-orange-700 mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full border border-gray-400 rounded p-3"
            placeholder="Enter Admin Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 font-semibold rounded hover:bg-orange-700"
          >
            Login
          </button>
        </form>
        {error && <div className="text-red-600 mt-4 text-sm text-center">{error}</div>}
      </div>
    </div>
  );
}
