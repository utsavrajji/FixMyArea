import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import MyIssues from "../components/MyIssues";
import useUserProfile from "../hooks/useUserProfile";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, profile } = useUserProfile();

  // Fetch real stats from Firestore
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const issuesRef = collection(db, "issues");
        const snapshot = await getDocs(issuesRef);
        
        let total = 0;
        let pending = 0;
        let resolved = 0;
        let inProgress = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          total++;
          
          const status = data.status?.toLowerCase() || "pending";
          
          if (status === "pending" || status === "open") {
            pending++;
          } else if (status === "resolved" || status === "closed" || status === "completed") {
            resolved++;
          } else if (status === "in progress" || status === "in-progress" || status === "ongoing") {
            inProgress++;
          } else {
            pending++;
          }
        });

        setStats({ total, pending, resolved, inProgress });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Header */}
          <UserHeader
            profile={{ ...profile, email: profile?.email || user?.email }}
            onReport={() => navigate("/report-issue")}
            onLogoutDone={() => navigate("/login")}
          />

          {/* Hero Banner with Stats */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-[url('image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                  Welcome back, {profile?.name?.split(' ')[0] || 'Citizen'}! 👋
                </h1>
                <p className="text-blue-100 text-lg">Track, Report, and Resolve community issues together</p>
              </div>

              <button
                onClick={() => navigate("/report-issue")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-bold shadow-xl hover:bg-blue-50 transition transform hover:scale-105"
              >
                <span className="text-xl">📝</span>
                Report New Issue
              </button>
            </div>

            {/* Stats Cards */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {loading ? (
                <>
                  <LoadingStatCard />
                  <LoadingStatCard />
                  <LoadingStatCard />
                  <LoadingStatCard />
                </>
              ) : (
                <>
                  <StatCard icon="📊" label="Total Issues" value={stats.total} color="from-blue-400 to-blue-500" />
                  <StatCard icon="⏳" label="Pending" value={stats.pending} color="from-yellow-400 to-orange-500" />
                  <StatCard icon="🔄" label="In Progress" value={stats.inProgress} color="from-purple-400 to-pink-500" />
                  <StatCard icon="✅" label="Resolved" value={stats.resolved} color="from-green-400 to-emerald-500" />
                </>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Issues - Full Width */}
            <section className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-blue-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span> My Issues
                </h2>
                <MyIssues />
              </div>
            </section>

            {/* Sidebar - Only Project Info */}
            <aside className="lg:col-span-1">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg border border-green-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>ℹ️</span> About FixMyArea
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>FixMyArea</strong> empowers citizens to report local problems, collaborate with communities, and hold authorities accountable for faster resolutions.
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
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
      <Footer />
    </>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-4 shadow-lg transform transition hover:scale-105`}>
      <div className="text-white">
        <div className="text-3xl mb-1">{icon}</div>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="text-sm opacity-90">{label}</div>
      </div>
      <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">{icon}</div>
    </div>
  );
}

// Loading Stat Card
function LoadingStatCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-200 p-4 shadow-lg animate-pulse">
      <div className="text-white">
        <div className="h-8 w-8 bg-gray-300 rounded mb-2"></div>
        <div className="h-6 w-16 bg-gray-300 rounded mb-1"></div>
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
