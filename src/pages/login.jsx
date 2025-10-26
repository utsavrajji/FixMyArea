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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md bg-white rounded-lg p-10 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-orange-600">Login</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md"
            required
          />

          <div className="flex items-center justify-between mt-4">
            <div className="bg-gray-200 text-lg font-bold px-4 py-2 rounded select-none tracking-widest">
              {captcha}
            </div>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="text-orange-600 text-sm underline hover:text-[#E66B10]"
            >
              Refresh
            </button>
          </div>

          <input
            type="text"
            placeholder="Enter captcha"
            value={userCaptcha}
            onChange={e => setUserCaptcha(e.target.value)}
            className="w-full p-3 border rounded-md mt-2"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-[#E66B10] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm">
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-orange-600 underline hover:text-[#E66B10]"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-orange-600 underline hover:text-[#E66B10]"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
