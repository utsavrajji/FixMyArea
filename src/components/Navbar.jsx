import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow sticky top-0 z-50 px-6 py-3 flex justify-between items-center font-semibold">
      <div className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="FixMyArea" className="h-10" />
        <span className="text-2xl text-orange-600 font-extrabold tracking-wide">FixMyArea</span>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8 text-gray-700">
        <Link to="/" className="hover:text-orange-500 transition">Home</Link>
        <a href="#howitworks" className="hover:text-orange-500 transition">How It Works</a>
        <a href="#contact" className="hover:text-orange-500 transition">Contact</a>
        <button onClick={() => navigate("/login")} className="px-5 py-2 bg-orange-600 rounded text-white hover:bg-orange-700 transition">Login</button>
        <button onClick={() => navigate("/register")} className="px-5 py-2 border border-orange-600 text-orange-600 rounded hover:bg-orange-50 transition">Register</button>
      </div>

      {/* Mobile-only: show Login/Register always */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => navigate("/login")}
          className="px-3 py-2 bg-orange-600 text-white rounded text-sm font-semibold hover:bg-orange-700 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-3 py-2 border border-orange-600 text-orange-600 rounded text-sm font-semibold hover:bg-orange-50 transition"
        >
          Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
