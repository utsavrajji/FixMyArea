import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);

      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        phone: form.phone,
        email: form.email,
        role: "citizen",
        createdAt: new Date(),
      });

      setError("");
      alert("Registration successful! Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      // Firebase "email-already-in-use" code
      if (err.code === "auth/email-already-in-use") {
        setError("Account already exists, please log in!");
        alert("Account already exists, please log in!");
      } else {
        setError(err.message);
        alert(`Registration failed: ${err.message}`);
      }
      refreshCaptcha();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-6">
      <div className="max-w-md w-full bg-white border-2 border-gray-300 shadow-xl p-10 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-600">User Registration</h2>

        {error && <p className="text-center text-red-600 font-semibold mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          Already have an Account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-orange-600 underline hover:text-[#E66B10] font-semibold"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
