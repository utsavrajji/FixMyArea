import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import IssueReviewCard from "../components/IssueReviewCard";
import Analytics from "../components/Analytics";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const STATUS = [
  "All", "Pending", "Under Review", "Not Important", "Fake", "In Progress", "Resolved", "Rejected"
];

const CATEGORIES = [
  "All","Road & Infrastructure","Garbage & Cleanliness","Water Supply","Electricity",
  "Environment & Parks","Traffic & Transport","Safety & Security","Public Buildings & Facilities",
  "Housing Area Problems","Accessibility for Disabled","Drainage & Sewage","Public Utilities",
  "Emergency / Urgent Issues","Community & Social Issues","Government Services",
];

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Pending");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Admin gate
  useEffect(() => {
    if (sessionStorage.getItem("admin") !== "true") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      let q = collection(db, "issues");
      let qArr = [];
      if (status && status !== "All") qArr.push(where("status", "==", status));
      if (category && category !== "All") qArr.push(where("category", "==", category));
      let qFinal = qArr.length ? query(q, ...qArr) : q;
      const snap = await getDocs(qFinal);
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (search.trim()) {
        data = data.filter(
          i =>
            i.title?.toLowerCase().includes(search.toLowerCase()) ||
            i.description?.toLowerCase().includes(search.toLowerCase())
        );
      }
      setIssues(data);
      setLoading(false);
    };
    fetchIssues();
  }, [category, status, search]);

  return (
    <>
      {/* Add styles without jsx attribute */}
      <style>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>

      <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-80 bg-gradient-to-b from-white via-orange-50/30 to-white shadow-2xl border-r border-orange-100 min-h-screen flex flex-col transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          {/* Header */}
          <div className="p-6 border-b border-orange-100 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">Admin Panel</h2>
                <p className="text-xs text-orange-100">FixMyArea Management</p>
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Status Filters
            </div>
            {STATUS.map(s => {
              const statusColors = {
                All: "blue",
                Pending: "yellow",
                "Under Review": "purple",
                "Not Important": "gray",
                Fake: "red",
                "In Progress": "orange",
                Resolved: "green",
                Rejected: "red"
              };
              const color = statusColors[s] || "blue";
              
              return (
                <button
                  key={s}
                  className={`group w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                    status === s
                      ? `bg-${color}-500 text-white shadow-lg scale-105`
                      : `hover:bg-${color}-50 text-gray-700 hover:scale-102 hover:shadow-md`
                  }`}
                  onClick={() => {
                    setStatus(s);
                    setSidebarOpen(false);
                  }}
                >
                  <span className={`w-2 h-2 rounded-full ${status === s ? 'bg-white' : `bg-${color}-500`} transition-all duration-300`} />
                  <span className="flex-1 text-left text-sm">{s}</span>
                  {status === s && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {issues.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Analytics & Logout */}
          <div className="p-4 border-t border-orange-100 space-y-2 bg-gradient-to-t from-orange-50/50 to-transparent">
            <button
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              onClick={() => {
                setSelected("analytics");
                setSidebarOpen(false);
              }}
            >
              <span>📊</span>
              <span>Analytics Dashboard</span>
            </button>
            <button
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              onClick={() => {
                sessionStorage.removeItem("admin");
                navigate("/admin");
              }}
            >
              <span>🚪</span>
              <span>Logout Admin</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* Top Bar */}
          <div className="mb-6 lg:mb-8 mt-16 lg:mt-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-orange-100">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Search issues, descriptions..."
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-sm"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white text-sm font-medium"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c === "All" ? "" : c}>
                    {c === "All" ? "📁 All Categories" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats Bar */}
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {[
                { label: "Total Issues", value: issues.length, icon: "📋", color: "blue" },
                { label: "Pending", value: issues.filter(i => i.status === "Pending").length, icon: "⏳", color: "yellow" },
                { label: "In Progress", value: issues.filter(i => i.status === "In Progress").length, icon: "🔄", color: "orange" },
                { label: "Resolved", value: issues.filter(i => i.status === "Resolved").length, icon: "✅", color: "green" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br from-${stat.color}-50 to-white border border-${stat.color}-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{stat.icon}</span>
                    <div>
                      <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                      <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          {selected === "analytics" ? (
            <div className="animate-fade-in">
              <Analytics />
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Loading issues...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 animate-fade-in">
              {issues.map(issue => (
                <div key={issue.id} className="transform transition-all duration-300 hover:scale-102">
                  <IssueReviewCard issue={issue} />
                </div>
              ))}
              {!issues.length && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                  <span className="text-6xl mb-4">📭</span>
                  <p className="text-lg font-medium">No issues found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
