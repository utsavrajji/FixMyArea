import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6 py-4 bg-transparent shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-5 py-3 font-semibold text-gray-800 shadow-soft-hero backdrop-blur-xl transition-colors duration-300 supports-[backdrop-filter]:bg-white/25 supports-[backdrop-filter]:border-white/30">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="FixMyArea" className="h-10 drop-shadow-sm" />
          <span className="text-2xl font-extrabold tracking-wide text-orange-600">FixMyArea</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-gray-800/90">
          <Link to="/" className="transition-colors hover:text-orange-500">Home</Link>
          <a href="#howitworks" className="transition-colors hover:text-orange-500">How It Works</a>
          <a href="#contact" className="transition-colors hover:text-orange-500">Contact</a>
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl border border-transparent bg-orange-500/90 px-5 py-2 text-white shadow-soft-hero transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500/80"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="rounded-xl border border-orange-500/70 bg-white/40 px-5 py-2 text-orange-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500/60"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
