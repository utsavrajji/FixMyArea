import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import Analytics from "../components/Analytics";
import ContactMessages from "../components/ContactMessages";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, LayoutDashboard, BarChart3, Mail, LogOut, 
  Clock, Search, RefreshCw, CheckCircle2, XCircle, Ban, Minus, 
  MapPin, Folder, Calendar, ThumbsUp, Camera, Inbox, X
} from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────────────────── */
const STATUS_LIST = [
  "All", "Pending", "Under Review", "Not Important",
  "Fake", "In Progress", "Resolved", "Rejected",
];

const CATEGORIES = [
  "All", "Road & Infrastructure", "Garbage & Cleanliness", "Water Supply",
  "Electricity", "Environment & Parks", "Traffic & Transport", "Safety & Security",
  "Public Buildings & Facilities", "Housing Area Problems", "Accessibility for Disabled",
  "Drainage & Sewage", "Public Utilities", "Emergency / Urgent Issues",
  "Community & Social Issues", "Government Services",
];

const STATUS_COLOR = {
  "Pending":      "bg-amber-100 text-amber-700 border-amber-200",
  "Under Review": "bg-violet-100 text-violet-700 border-violet-200",
  "In Progress":  "bg-blue-100 text-blue-700 border-blue-200",
  "Resolved":     "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Rejected":     "bg-red-100 text-red-700 border-red-200",
  "Fake":         "bg-gray-100 text-gray-500 border-gray-200",
  "Not Important":"bg-gray-100 text-gray-400 border-gray-200",
};

const STATUS_DOT = {
  "Pending":      "bg-amber-400",
  "Under Review": "bg-violet-500",
  "In Progress":  "bg-blue-500",
  "Resolved":     "bg-emerald-500",
  "Rejected":     "bg-red-500",
  "Fake":         "bg-gray-400",
  "Not Important":"bg-gray-300",
};

const STATUS_ICON = {
  "Pending":      <Clock className="w-4 h-4" />,
  "Under Review": <Search className="w-4 h-4" />,
  "In Progress":  <RefreshCw className="w-4 h-4" />,
  "Resolved":     <CheckCircle2 className="w-4 h-4" />,
  "Rejected":     <XCircle className="w-4 h-4" />,
  "Fake":         <Ban className="w-4 h-4" />,
  "Not Important":<Minus className="w-4 h-4" />,
  "All":          <LayoutDashboard className="w-4 h-4" />,
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function locationStr(loc) {
  if (!loc) return "—";
  if (typeof loc === "string") return loc;
  const { district, block, village, state, city } = loc;
  return [district || block || village || city, state].filter(Boolean).join(", ") || "—";
}

function fmtDate(ts) {
  if (!ts) return "—";
  const d = ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── NavItem ────────────────────────────────────────────────────────────── */
function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-[#064E3B] text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span className="text-base flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge != null && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
        }`}>{badge}</span>
      )}
    </button>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className={`rounded-2xl border ${accent.border} ${accent.bg} p-4 shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${accent.iconBg} flex items-center justify-center text-lg`}>{icon}</div>
        <span className={`text-3xl font-black tabular-nums ${accent.text}`}>{value}</span>
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${accent.text} opacity-70`}>{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ─── Issue Card (Grid) ──────────────────────────────────────────────────── */
function IssueCard({ issue }) {
  const sc  = STATUS_COLOR[issue.status] || "bg-gray-100 text-gray-600 border-gray-200";
  const dot = STATUS_DOT[issue.status]   || "bg-gray-400";
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {issue.photoURL ? (
          <img src={issue.photoURL} alt={issue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
            <Camera className="w-10 h-10 opacity-20" />
          </div>
        )}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-sm backdrop-blur-sm ${sc}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{issue.status}
        </span>
        {issue.upvotes > 0 && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-2 py-0.5 text-[11px] font-bold text-gray-700">
            <ThumbsUp className="w-3 h-3" /> {issue.upvotes}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
          {issue.title || issue.category}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" /><span className="line-clamp-1 flex-1">{locationStr(issue.location)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><Folder className="w-3.5 h-3.5 shrink-0" /> {issue.category?.split(" ")[0] || "General"}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 shrink-0" /> {fmtDate(issue.createdAt)}</span>
        </div>
        <Link to={`/admin/issue/${issue.id}`}>
          <button className="w-full bg-[#064E3B] hover:bg-[#053d2f] text-white text-xs font-bold py-2.5 rounded-xl transition-all">
            View & Manage →
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ─── Issue Row (Table) ──────────────────────────────────────────────────── */
function IssueRow({ issue }) {
  const sc  = STATUS_COLOR[issue.status] || "bg-gray-100 text-gray-600 border-gray-200";
  const dot = STATUS_DOT[issue.status]   || "bg-gray-400";
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition group">
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        {issue.photoURL
          ? <img src={issue.photoURL} className="w-full h-full object-cover" alt="" />
          : <div className="w-full h-full flex items-center justify-center opacity-30"><Camera className="w-5 h-5" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{issue.title || issue.category}</p>
        <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 shrink-0" /> {locationStr(issue.location)}</p>
      </div>
      <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold flex-shrink-0 ${sc}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{issue.status}
      </span>
      <span className="hidden md:block text-xs text-gray-400 flex-shrink-0">{fmtDate(issue.createdAt)}</span>
      <Link to={`/admin/issue/${issue.id}`} className="flex-shrink-0">
        <button className="text-xs font-bold text-[#064E3B] border border-[#064E3B]/30 px-3 py-1.5 rounded-lg hover:bg-[#064E3B]/5 transition">
          Manage →
        </button>
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [issues, setIssues]             = useState([]);
  const [allIssues, setAllIssues]       = useState([]);   // unfiltered — for sidebar counts
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [category, setCategory]         = useState("");
  const [search, setSearch]             = useState("");
  const [activeView, setActiveView]     = useState("issues");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [viewMode, setViewMode]         = useState("grid"); // grid | table
  const navigate = useNavigate();

  /* Auth guard */
  useEffect(() => {
    if (sessionStorage.getItem("admin") !== "true") navigate("/admin", { replace: true });
  }, [navigate]);

  /* Real-time all issues for sidebar counts */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "issues"), snap => {
      setAllIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  /* Filtered fetch */
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      let q = collection(db, "issues");
      const filters = [];
      if (statusFilter && statusFilter !== "All") filters.push(where("status", "==", statusFilter));
      if (category && category !== "All") filters.push(where("category", "==", category));
      const qFinal = filters.length ? query(q, ...filters) : q;
      const snap = await getDocs(qFinal);
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (search.trim()) {
        const s = search.toLowerCase();
        data = data.filter(i => i.title?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s));
      }
      setIssues(data);
      setLoading(false);
    };
    fetchIssues();
  }, [statusFilter, category, search]);

  const handleLogout = () => { sessionStorage.removeItem("admin"); navigate("/admin"); };

  /* Derived stats from allIssues */
  const totalAll    = allIssues.length;
  const pendingCnt  = allIssues.filter(i => i.status === "Pending").length;
  const activeCnt   = allIssues.filter(i => ["In Progress", "Under Review"].includes(i.status)).length;
  const resolvedCnt = allIssues.filter(i => i.status === "Resolved").length;

  const navItems = [
    { id: "issues",    icon: <LayoutDashboard className="w-5 h-5" />, label: "Issue Dashboard", badge: totalAll },
    { id: "analytics", icon: <BarChart3 className="w-5 h-5" />, label: "Analytics" },
    { id: "messages",  icon: <Mail className="w-5 h-5" />, label: "Messages" },
  ];

  /* ── Sidebar ── */
  function SidebarContent() {
    return (
      <>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#064E3B] rounded-2xl flex items-center justify-center shadow-sm text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900">FixMyArea</p>
              <p className="text-[11px] text-gray-400 font-medium">Admin Control Panel</p>
            </div>
          </div>
        </div>

        {/* Mini stat pills */}
        <div className="px-4 pt-4 pb-2 grid grid-cols-2 gap-2">
          {[
            { label: "Total",    val: totalAll,    bg: "bg-gray-100 text-gray-700" },
            { label: "Pending",  val: pendingCnt,  bg: "bg-amber-100 text-amber-700" },
            { label: "Active",   val: activeCnt,   bg: "bg-blue-100 text-blue-700" },
            { label: "Resolved", val: resolvedCnt, bg: "bg-emerald-100 text-emerald-700" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl px-3 py-2 text-center ${s.bg}`}>
              <p className="text-lg font-black">{s.val}</p>
              <p className="text-[10px] font-bold opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-2 pb-1">Navigation</p>
          {navItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeView === item.id}
              badge={item.badge}
              onClick={() => { setActiveView(item.id); setSidebarOpen(false); }}
            />
          ))}

          {/* Status filters */}
          {activeView === "issues" && (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-4 pb-1">Status Filter</p>
              {STATUS_LIST.map(s => {
                const cnt = s === "All" ? allIssues.length : allIssues.filter(i => i.status === s).length;
                return (
                  <NavItem
                    key={s}
                    icon={<span className="scale-90">{STATUS_ICON[s]}</span>}
                    label={s}
                    active={statusFilter === s}
                    badge={cnt > 0 ? cnt : undefined}
                    onClick={() => { setStatusFilter(s); setSidebarOpen(false); }}
                  />
                );
              })}
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout Admin
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Mobile topbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
        <button onClick={() => setSidebarOpen(true)} className="p-1">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-extrabold text-gray-900">Admin Panel</span>
        <div className="w-8 h-8 rounded-full bg-[#064E3B] flex items-center justify-center text-white text-xs font-bold">A</div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-64 bg-white flex flex-col h-full border-r border-gray-200 shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 min-h-screen bg-white border-r border-gray-200 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 pt-20 lg:pt-6 overflow-y-auto">

        {/* ── Issue Dashboard ── */}
        {activeView === "issues" && (
          <div className="space-y-5">

            {/* Admin hero banner */}
            <div className="relative rounded-3xl overflow-hidden bg-[#064E3B] px-6 py-5 shadow-lg">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-4 left-10 w-20 h-20 rounded-full bg-emerald-400/10 pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-200 text-[11px] font-bold uppercase tracking-widest">Admin Dashboard</span>
                  </div>
                  <h1 className="text-xl font-extrabold text-white">Issue Management</h1>
                  <p className="text-emerald-200 text-sm mt-0.5">
                    {totalAll} total reports · {pendingCnt} awaiting review
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setViewMode(v => v === "grid" ? "table" : "grid")}
                    className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-white/20 transition"
                  >
                    {viewMode === "grid" ? "☰ Table View" : "⊞ Grid View"}
                  </button>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={<LayoutDashboard className="w-5 h-5" />} label="Total Issues"  value={totalAll}    sub="across all statuses"
                accent={{ bg:"bg-white",       border:"border-gray-200",     text:"text-gray-800",    iconBg:"bg-gray-100" }} />
              <StatCard icon={<Clock className="w-5 h-5" />} label="Pending"       value={pendingCnt}  sub="needs attention"
                accent={{ bg:"bg-amber-50",    border:"border-amber-200",    text:"text-amber-700",   iconBg:"bg-amber-100" }} />
              <StatCard icon={<RefreshCw className="w-5 h-5" />} label="Active"        value={activeCnt}   sub="in progress / review"
                accent={{ bg:"bg-blue-50",     border:"border-blue-200",     text:"text-blue-700",    iconBg:"bg-blue-100" }} />
              <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Resolved"      value={resolvedCnt} sub="successfully closed"
                accent={{ bg:"bg-emerald-50",  border:"border-emerald-200",  text:"text-emerald-700", iconBg:"bg-emerald-100" }} />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search issues or descriptions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 transition-all focus:bg-white"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Category */}
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 transition-all font-medium text-gray-700 focus:bg-white"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c === "All" ? "" : c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Status pills */}
              <div className="flex flex-wrap gap-2">
                {STATUS_LIST.map(s => {
                  const cnt = s === "All" ? allIssues.length : allIssues.filter(i => i.status === s).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                        statusFilter === s
                          ? "bg-[#064E3B] text-white border-[#064E3B] shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#064E3B]/40"
                      }`}
                    >
                      <span className="scale-90">{STATUS_ICON[s]}</span>
                      {s}
                      {cnt > 0 && (
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          statusFilter === s ? "bg-white/20" : "bg-gray-100"
                        }`}>{cnt}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Result count */}
            {!loading && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">
                  Showing <strong className="text-gray-900">{issues.length}</strong> issue{issues.length !== 1 ? "s" : ""}
                  {statusFilter !== "All" && <span> · <span className="text-[#064E3B] font-bold">{statusFilter}</span></span>}
                </p>
              </div>
            )}

            {/* Issue Grid / Table */}
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Loading issues…</p>
                </div>
              </div>
            ) : issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
                <Inbox className="w-16 h-16 text-gray-300 mb-3" />
                <p className="font-bold text-gray-700">No issues found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
                <button onClick={() => { setStatusFilter("All"); setSearch(""); setCategory(""); }}
                  className="mt-4 text-xs font-bold text-[#064E3B] border border-[#064E3B]/30 px-4 py-2 rounded-xl hover:bg-[#064E3B]/5 transition">
                  Clear all filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="w-10 flex-shrink-0" />
                  <span className="flex-1">Issue</span>
                  <span className="hidden sm:block w-28 flex-shrink-0">Status</span>
                  <span className="hidden md:block w-28 flex-shrink-0">Date</span>
                  <span className="w-20 flex-shrink-0">Action</span>
                </div>
                {issues.map(issue => <IssueRow key={issue.id} issue={issue} />)}
              </div>
            )}
          </div>
        )}

        {/* ── Analytics ── */}
        {activeView === "analytics" && (
          <div className="space-y-5">
            <div className="relative rounded-3xl overflow-hidden bg-[#064E3B] px-6 py-5 shadow-lg">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-200 text-[11px] font-bold uppercase tracking-widest">Analytics</span>
              </div>
              <h1 className="text-xl font-extrabold text-white">Platform Insights</h1>
              <p className="text-emerald-200 text-sm mt-0.5">Real-time data and performance metrics across all issues.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <Analytics />
            </div>
          </div>
        )}

        {/* ── Messages ── */}
        {activeView === "messages" && (
          <div className="space-y-5">
            <div className="relative rounded-3xl overflow-hidden bg-[#064E3B] px-6 py-5 shadow-lg">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-200 text-[11px] font-bold uppercase tracking-widest">Messages</span>
              </div>
              <h1 className="text-xl font-extrabold text-white">Contact Messages</h1>
              <p className="text-emerald-200 text-sm mt-0.5">All citizen support and contact form submissions.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <ContactMessages />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
