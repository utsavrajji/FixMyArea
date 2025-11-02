import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = path => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-transparent px-4 py-4 shadow-lg sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/50 bg-white/60 px-5 py-3 font-semibold text-gray-800 shadow-soft-hero backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:border-white/30 supports-[backdrop-filter]:bg-white/35">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="FixMyArea" className="h-10 drop-shadow-sm" />
          <span className="text-2xl font-extrabold tracking-wide text-orange-600">FixMyArea</span>
        </div>

        <div className="hidden items-center gap-8 text-gray-800/90 md:flex">
          <Link to="/" className="transition-colors hover:text-orange-500">
            Home
          </Link>
          <a href="#how-it-works" className="transition-colors hover:text-orange-500">
            How It Works
          </a>
          <a href="#contact" className="transition-colors hover:text-orange-500">
            Contact
          </a>
          <button
            onClick={() => handleNavigation("/login")}
            className="rounded-xl border border-transparent bg-orange-500/90 px-5 py-2 text-white shadow-soft-hero transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500/80"
          >
            Login
          </button>
          <button
            onClick={() => handleNavigation("/register")}
            className="rounded-xl border border-orange-500/70 bg-white/40 px-5 py-2 text-orange-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500/60"
          >
            Register
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-white md:hidden"
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="mx-auto mt-3 flex max-w-6xl flex-col gap-4 rounded-2xl border border-white/50 bg-white/90 px-5 py-4 text-base font-medium text-gray-800 shadow-soft-hero backdrop-blur md:hidden">
          <Link
            to="/"
            className="rounded-xl px-3 py-2 transition-colors hover:bg-orange-50"
            onClick={closeMenu}
          >
            Home
          </Link>
          <a
            href="#how-it-works"
            className="rounded-xl px-3 py-2 transition-colors hover:bg-orange-50"
            onClick={closeMenu}
          >
            How It Works
          </a>
          <a
            href="#contact"
            className="rounded-xl px-3 py-2 transition-colors hover:bg-orange-50"
            onClick={closeMenu}
          >
            Contact
          </a>
          <button
            onClick={() => handleNavigation("/login")}
            className="rounded-xl bg-orange-500/90 px-3 py-2 text-white shadow-soft-hero transition-all duration-200 hover:bg-orange-500"
          >
            Login
          </button>
          <button
            onClick={() => handleNavigation("/register")}
            className="rounded-xl border border-orange-500/70 bg-white px-3 py-2 text-orange-600 transition-all duration-200 hover:bg-orange-50"
          >
            Register
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
