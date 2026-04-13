import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isLanding = location.pathname === "/";

  const linkClass =
    "text-sm font-medium transition-colors duration-200 hover:text-emerald-300";
  const activeLinkClass = "text-emerald-300 font-semibold";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#064E3B] shadow-lg"
          : isLanding
          ? "bg-[#064E3B]/95 backdrop-blur-md"
          : "bg-[#064E3B]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <img src="/assets/logo.png" alt="FixMyArea" className="h-6 w-6 drop-shadow-sm" />
          </div>
          <span className="text-xl font-extrabold tracking-wide text-white">
            Fix<span className="text-emerald-300">My</span>Area
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {user ? (
            <Link to="/dashboard" className={`${linkClass} ${location.pathname === "/dashboard" ? activeLinkClass : "text-white/80"}`}>
              Dashboard
            </Link>
          ) : (
            <Link to="/" className={`${linkClass} ${location.pathname === "/" ? activeLinkClass : "text-white/80"}`}>
              Home
            </Link>
          )}
          <Link to="/local-issues" className={`${linkClass} ${location.pathname === "/local-issues" ? activeLinkClass : "text-white/80"}`}>
            Feed
          </Link>
          <Link to={user ? "/report-issue" : "/login"} className={`${linkClass} ${location.pathname === "/report-issue" ? activeLinkClass : "text-white/80"}`}>
            Report
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <button
                onClick={() => handleNavigation("/profile")}
                className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 shadow-md transition-all duration-200 hover:bg-red-500/20 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation("/login")}
                className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation("/register")}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#064E3B] shadow-md transition-all duration-200 hover:bg-emerald-50 hover:shadow-lg"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 text-white transition hover:bg-white/10 lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
            )}
          </svg>
        </button>
      </div>

  {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#053d2f] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {user ? (
              <Link to="/dashboard" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <Link to="/" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            )}
            <Link to="/local-issues" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Feed
            </Link>
            <Link to={user ? "/report-issue" : "/login"} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Report Issue
            </Link>
            <div className="mt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="rounded-lg border border-white/30 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-100 hover:bg-red-500/20 hover:text-white text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="rounded-lg border border-white/30 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation("/register")}
                    className="rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-[#064E3B]"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
