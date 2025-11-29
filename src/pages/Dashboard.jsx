import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import MyIssues from "../components/MyIssues";
import useUserProfile from "../hooks/useUserProfile";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useUserProfile();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header with Hamburger Menu */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl lg:text-3xl">🏙️</span>
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-800">FixMyArea</h1>
                  <p className="text-xs lg:text-sm text-gray-500">Citizen Dashboard</p>
                </div>
              </div>

              {/* Desktop Menu Items */}
              <nav className="hidden lg:flex items-center gap-2 xl:gap-4 2xl:gap-6">
                <NavItem icon="👤" label="Profile" onClick={() => navigate("/profile")} />
                <NavItem icon="📋" label="My Issues" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} />
            
                <NavItem icon="📞" label="Contact" onClick={() => navigate("/contact")} />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 xl:px-5 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-all duration-300"
                >
                  <span className="text-lg xl:text-xl">🚪</span>
                  <span className="text-sm xl:text-base">Logout</span>
                </button>
              </nav>

              {/* Hamburger Menu Button - Mobile Only */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Dropdown Menu - Mobile Only */}
          {menuOpen && (
            <div className="lg:hidden absolute top-16 right-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-down">
              {/* User Profile Section */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl border-2 border-white">
                    👤
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-lg truncate">{profile?.name || user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-blue-100 truncate">{profile?.email || user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <MenuItem
                  icon="👤"
                  label="My Profile"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                />
                <MenuItem
                  icon="📋"
                  label="My Issues"
                  onClick={() => {
                    setMenuOpen(false);
                    window.scrollTo({ top: 600, behavior: 'smooth' });
                  }}
                />
                <MenuItem
                  icon="🌍"
                  label="Browse Local Issues"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/local-issues");
                  }}
                />
                <MenuItem
                  icon="📜"
                  label="Issue History"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/history");
                  }}
                />
                
                <MenuItem
                  icon="📞"
                  label="Contact Us"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/contact");
                  }}
                />
                <MenuItem
                  icon="❓"
                  label="Help & Support"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/help");
                  }}
                />
                <div className="border-t border-gray-200 my-2" />
                <MenuItem
                  icon="🚪"
                  label="Logout"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  danger
                />
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 lg:py-8 xl:py-10">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-6 lg:p-8 xl:p-10 shadow-2xl mb-6 lg:mb-8">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
              <div className="text-white text-center lg:text-left max-w-3xl">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-2">
                  Welcome back, {profile?.name?.split(' ')[0] || 'Citizen'}! 👋
                </h1>
                <p className="text-blue-100 text-base lg:text-lg xl:text-xl">Track, Report, and Resolve community issues together</p>
              </div>

              <button
                onClick={() => navigate("/report-issue")}
                className="flex items-center gap-2 px-5 lg:px-6 xl:px-8 py-2.5 lg:py-3 bg-white text-blue-700 rounded-xl font-bold shadow-xl hover:bg-blue-50 transition transform hover:scale-105 whitespace-nowrap text-sm lg:text-base"
              >
                <span className="text-xl lg:text-2xl">📝</span>
                <span>Report New Issue</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6 lg:gap-8">
            {/* My Issues - Left Side */}
            <section className="lg:col-span-8 xl:col-span-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-blue-200 p-5 lg:p-6 xl:p-8">
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 flex items-center gap-2">
                  <span>📋</span> My Issues
                </h2>
                <MyIssues />
              </div>
            </section>

            {/* Sidebar - Right Side */}
            <aside className="lg:col-span-4 xl:col-span-4 space-y-6">
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg border border-orange-200 p-5 lg:p-6">
                <h3 className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>⚡</span> Quick Actions
                </h3>
                <div className="space-y-3">
                  <QuickActionButton
                    icon="📝"
                    label="Report New Issue"
                    onClick={() => navigate("/report-issue")}
                  />
                  <QuickActionButton
                    icon="🌍"
                    label="Browse Local Issues"
                    onClick={() => navigate("/local-issues")}
                  />
                  <QuickActionButton
                    icon="📜"
                    label="View History"
                    onClick={() => navigate("/history")}
                  />
                </div>
              </div>

              {/* About Project */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg border border-green-200 p-5 lg:p-6">
                <h3 className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>ℹ️</span> About FixMyArea
                </h3>
                <p className="text-xs lg:text-sm text-gray-700 leading-relaxed mb-4">
                  <strong>FixMyArea</strong> empowers citizens to report local problems, collaborate with communities, and hold authorities accountable for faster resolutions.
                </p>
                <div className="space-y-2 text-xs lg:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Transparent issue tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Community-driven solutions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Government verified updates</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Overlay for menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>

      <Footer />
    </>
  );
}

// Desktop Nav Item Component
function NavItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 xl:px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-300 text-sm xl:text-base"
    >
      <span className="text-lg xl:text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Menu Item Component (Mobile)
function MenuItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-300 ${
        danger
          ? "hover:bg-red-50 text-red-600 hover:text-red-700"
          : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Quick Action Button
function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 flex items-center gap-3 font-semibold text-gray-700 hover:text-orange-600 text-sm lg:text-base"
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
