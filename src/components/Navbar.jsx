import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-50 px-6 py-3 flex justify-between items-center font-semibold">
      <div className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="FixMyArea" className="h-10" />
        <span className="text-2xl text-orange-600 font-extrabold tracking-wide">FixMyArea</span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-gray-700">
        <Link to="/" className="hover:text-orange-500 transition">Home</Link>
        <Link to="/history" className="hover:text-orange-500 transition">Resolved Issues</Link>
        <a href="#howitworks" className="hover:text-orange-500 transition">How It Works</a>
        <a href="#contact" className="hover:text-orange-500 transition">Contact</a>
        <button onClick={() => navigate("/login")} className="px-5 py-2 bg-orange-600 rounded text-white hover:bg-orange-700 transition">Login</button>
        <button onClick={() => navigate("/register")} className="px-5 py-2 border border-orange-600 text-orange-600 rounded hover:bg-orange-50 transition">Register</button>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden relative w-10 h-10 flex items-center justify-center focus:outline-none group"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {/* Hamburger with 3 animated lines */}
        <span className={`block absolute h-0.5 w-7 bg-gray-800 rounded transition-all duration-300 ease-in-out
          ${menuOpen ? "rotate-45 top-5" : "top-3"}`}></span>
        <span className={`block absolute h-0.5 w-7 bg-gray-800 rounded transition-all duration-300 ease-in-out
          ${menuOpen ? "opacity-0 left-3" : "top-5"}`}></span>
        <span className={`block absolute h-0.5 w-7 bg-gray-800 rounded transition-all duration-300 ease-in-out
          ${menuOpen ? "-rotate-45 top-5" : "top-7"}`}></span>
      </button>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute right-2 top-3 w-56 bg-white shadow-lg rounded-lg flex flex-col gap-5 p-6"
            onClick={e => e.stopPropagation()}
          >
            <Link onClick={() => setMenuOpen(false)} to="/" className="hover:text-orange-500 text-lg">Home</Link>
            <Link onClick={() => setMenuOpen(false)} to="/history" className="hover:text-orange-500 text-lg">Resolved Issues</Link>
            <a href="#howitworks" onClick={() => setMenuOpen(false)} className="hover:text-orange-500 text-lg">How It Works</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-orange-500 text-lg">Contact</a>
            <button
              onClick={() => { setMenuOpen(false); navigate("/login"); }}
              className="w-full px-5 py-2 bg-orange-600 rounded text-white font-semibold hover:bg-orange-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => { setMenuOpen(false); navigate("/register"); }}
              className="w-full px-5 py-2 border border-orange-600 text-orange-600 rounded font-semibold hover:bg-orange-50 transition"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
