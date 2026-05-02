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
  const hideLinks = ["/dashboard", "/admin", "/admin-dashboard", "/report-issue", "/history", "/login", "/register", "/forgot-password", "/issue"].some(p => location.pathname.startsWith(p));

  return (
    <nav
      className={`sticky top-0 z-50 ${
        scrolled
          ? "bg-[#064E3B] shadow-lg"
          : isLanding
          ? "bg-[#064E3B]/95 backdrop-blur-md"
          : "bg-[#064E3B]"
      }`}
    >
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Left Side: Menu Toggle */}
        <div className="flex items-center gap-2 min-w-[40px] sm:min-w-[120px]">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 text-white hover:bg-white/10"
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

        {/* Center: Logo & Name (Always Centered) */}
        <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
            <img src="/assets/logo.png" alt="FixMyArea" className="h-6 w-6 object-contain" />
          </div>
          <span className="text-xl font-extrabold tracking-wide text-white">
            Fix<span className="text-emerald-300">My</span>Area
          </span>
        </Link>

          {/* Right Side: Action Buttons */}
          <div className="flex items-center justify-end gap-6 min-w-[40px] sm:min-w-[120px]">
          
          {!user && (
            <button
              onClick={() => handleNavigation("/register")}
              className="rounded-lg bg-white px-2.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold text-[#064E3B] shadow-md hover:bg-emerald-50 hover:shadow-lg transition-all"
            >
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu (Dropdown) - Now Absolute to Overlap content */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full border-t border-white/10 bg-[#053d2f]/95 backdrop-blur-lg px-4 py-4 shadow-2xl z-[60]">
          <div className="flex flex-col gap-1">
            {user ? (
              <>
                <Link to="/dashboard" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/local-issues" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Feed
                </Link>
                <Link to="/report-issue" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Report Issue
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/local-issues" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Feed
                </Link>
                <Link to="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Report
                </Link>
                <Link to="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/contact" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Contact Us
                </Link>
                <Link to="/privacy" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Privacy Policy
                </Link>
                <Link to="/terms" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  Terms & Conditions
                </Link>
                <Link to="/faqs" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                  FAQs
                </Link>
              </>
            )}
            
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <Link 
                    to="/dashboard?view=profile" 
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="opacity-70">👤</span> Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-100 hover:bg-red-500/20 hover:text-white text-left flex items-center gap-2"
                  >
                    <span className="opacity-70">🚪</span> Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigation("/register")}
                  className="rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-[#064E3B] text-center"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>

  );
}

export default Navbar;
