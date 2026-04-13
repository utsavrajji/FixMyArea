import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  collection, query, where, onSnapshot,
  orderBy, limit, getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import MyIssues from "../components/MyIssues";
import useUserProfile from "../hooks/useUserProfile";
import Navbar from "../components/Navbar";
import { Home, ClipboardList, Globe, Building2, Settings, LogOut, Inbox, MapPin, Map, AlertTriangle, Lock, Radio, Camera, Bell, CheckCircle, FileText, Pin, Lightbulb, Clock, RefreshCw, Layers, ShieldCheck, MapIcon, Car, Bus, Users, Wrench } from "lucide-react";

/* ── helpers ─────────────────────────────────────────────────────────────── */
function relTime(ts) {
  if (!ts) return "";
  const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  const h = Math.floor((Date.now() - d) / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return days < 30 ? `${days}d ago` : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function fmtDate(ts) {
  if (!ts) return "";
  const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function locationStr(loc) {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  return [loc.district, loc.block, loc.village, loc.state]
    .filter(Boolean).slice(0, 2).join(", ");
}

/* ── Small components ────────────────────────────────────────────────────── */
function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? "bg-[#064E3B] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}>
      <span className="text-base flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Pending":      "bg-amber-100 text-amber-700",
    "In Progress":  "bg-blue-100 text-blue-700",
    "Under Review": "bg-violet-100 text-violet-700",
    "Resolved":     "bg-emerald-100 text-emerald-700",
    "Rejected":     "bg-red-100 text-red-700",
    "Fake":         "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function DonutMini({ resolved, active, pending }) {
  const total = resolved + active + pending || 1;
  const R = 34, circ = 2 * Math.PI * R;
  const slices = [
    { val: resolved, color: "#059669" },
    { val: active,   color: "#3B82F6" },
    { val: pending,  color: "#F59E0B" },
  ];
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={R} fill="none" stroke="#F3F4F6" strokeWidth="8" />
          {slices.map((s, i) => {
            const arc = (s.val / total) * circ;
            const el = (
              <circle key={i} cx="40" cy="40" r={R} fill="none"
                stroke={s.color} strokeWidth="8"
                strokeDasharray={`${arc} ${circ - arc}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt" />
            );
            offset += arc;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-black text-gray-900">{total}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          { label: "Resolved", val: resolved, color: "bg-emerald-500" },
          { label: "Active",   val: active,   color: "bg-blue-500" },
          { label: "Pending",  val: pending,  color: "bg-amber-400" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.color}`} />
            <span className="text-gray-500">{s.label}</span>
            <span className="ml-auto font-bold text-gray-800 tabular-nums">{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate       = useNavigate();
  const { user, profile } = useUserProfile();
  const [currentUser, setCurrentUser] = useState(null);

  // My issues (real Firestore data)
  const [myIssues, setMyIssues]       = useState([]);
  const [myStats,  setMyStats]        = useState({ total: 0, pending: 0, active: 0, resolved: 0, rejected: 0 });

  // Community feed (latest issues from everyone)
  const [communityFeed, setCommunityFeed] = useState([]);

  // UI state
  const [activeNav,    setActiveNav]   = useState("dashboard");
  const [sidebarOpen,  setSidebarOpen] = useState(false);
  const [mounted,      setMounted]     = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  /* Auth */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setCurrentUser(u));
    return () => unsub();
  }, []);

  /* My issues — real-time, sorted by createdAt desc */
  useEffect(() => {
    if (!currentUser) return;
    // Using two queries: one with orderBy (needs index) and fallback without
    const q = query(
      collection(db, "issues"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMyIssues(all);
      setMyStats({
        total:    all.length,
        pending:  all.filter(i => i.status === "Pending").length,
        active:   all.filter(i => ["In Progress", "Under Review"].includes(i.status)).length,
        resolved: all.filter(i => i.status === "Resolved").length,
        rejected: all.filter(i => ["Rejected", "Fake"].includes(i.status)).length,
      });
    }, err => {
      // Fallback without orderBy if index doesn't exist
      console.warn("Ordered query failed, using unordered:", err.message);
      const qFallback = query(collection(db, "issues"), where("userId", "==", currentUser.uid));
      onSnapshot(qFallback, snap => {
        const all = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const ta = a.createdAt?.seconds || 0;
            const tb = b.createdAt?.seconds || 0;
            return tb - ta;
          });
        setMyIssues(all);
        setMyStats({
          total:    all.length,
          pending:  all.filter(i => i.status === "Pending").length,
          active:   all.filter(i => ["In Progress", "Under Review"].includes(i.status)).length,
          resolved: all.filter(i => i.status === "Resolved").length,
          rejected: all.filter(i => ["Rejected", "Fake"].includes(i.status)).length,
        });
      });
    });
    return () => unsub();
  }, [currentUser]);

  /* Community feed — latest 6 issues from everyone */
  useEffect(() => {
    const q = query(collection(db, "issues"), orderBy("createdAt", "desc"), limit(6));
    const unsub = onSnapshot(q, snap => {
      setCommunityFeed(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  /* Derived */
  const firstName   = profile?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Citizen";
  const initials    = firstName.charAt(0).toUpperCase();
  const resolvePct  = myStats.total ? Math.round((myStats.resolved / myStats.total) * 100) : 0;
  const recentIssues = myIssues.slice(0, 4); // latest 4

  const navItems = [
    { id: "dashboard", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { id: "myissues",  icon: <ClipboardList className="w-5 h-5" />, label: "My Issues",  badge: myStats.total },
    { id: "community", icon: <Globe className="w-5 h-5" />, label: "Community Feed" },
  ];

  /* ─── Sidebar ─────────────────────────────────────────────────────────── */
  function SidebarContent() {
    return (
      <>
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#064E3B] rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900">FixMyArea</p>
              <p className="text-[11px] text-gray-400 font-medium">Citizen Dashboard</p>
            </div>
          </div>
        </div>

        {/* User pill */}
        <div className="mx-3 mt-3 flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-[#064E3B] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{profile?.name || firstName}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          {navItems.map(item => (
            <NavItem key={item.id} {...item}
              active={activeNav === item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }} />
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 flex-shrink-0 space-y-1">
          <button onClick={() => navigate("/profile")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
            <Settings className="w-5 h-5 flex-shrink-0" /> Profile Settings
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
            <LogOut className="w-5 h-5 flex-shrink-0" /> Log out
          </button>
        </div>
      </>
    );
  }

  /* ─── Main content ────────────────────────────────────────────────────── */
  const renderMain = () => {

    /* My Issues tab */
    if (activeNav === "myissues") return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">My Issues</h2>
          <button onClick={() => navigate("/report-issue")}
            className="text-xs font-bold bg-[#064E3B] text-white px-3 py-1.5 rounded-lg hover:bg-[#053d2f] transition">
            + Report New
          </button>
        </div>
        <MyIssues />
      </div>
    );

    /* Community feed tab */
    if (activeNav === "community") return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Community Feed</h2>
          <button onClick={() => navigate("/local-issues")}
            className="text-xs font-semibold text-[#064E3B] hover:underline">View Map →</button>
        </div>
        {communityFeed.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Inbox className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm">No community issues yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {communityFeed.map(issue => (
              <div key={issue.id} onClick={() => navigate(`/issue/${issue.id}`)}
                className="flex items-start gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#064E3B]/30 hover:bg-gray-50 cursor-pointer transition group">
                {issue.photoURL
                  ? <img src={issue.photoURL} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" alt="" />
                  : <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><ClipboardList className="w-6 h-6 text-gray-400" /></div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{issue.title || issue.category}</p>
                    <StatusBadge status={issue.status || "Pending"} />
                  </div>
                  <p className="text-xs text-gray-500 truncate"><MapPin className="w-3 h-3 flex-shrink-0" /> {locationStr(issue.location) || "—"}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{relTime(issue.createdAt)}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-[#064E3B] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    /* ── Dashboard home ── */
    return (
      <div className="space-y-5">

        {/* Welcome bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome back, {firstName}! 👋</h1>
            <p className="mt-1 text-sm text-gray-500">
              You have <strong className="text-gray-800">{myStats.total}</strong> report{myStats.total !== 1 ? "s" : ""} — <strong className="text-emerald-600">{myStats.resolved} resolved</strong>.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => navigate("/local-issues")} className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"><Globe className="w-4 h-4" /> Browse Issues</button>
            <button onClick={() => navigate("/report-issue")} className="flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#053d2f] transition">＋ Report Issue</button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <ClipboardList className="w-5 h-5" />, label: "Total Reports", val: myStats.total,    bg: "bg-white border-gray-200",         text: "text-gray-900" },
            { icon: <Clock className="w-5 h-5" />, label: "Pending",        val: myStats.pending,  bg: "bg-amber-50 border-amber-200",     text: "text-amber-700" },
            { icon: <RefreshCw className="w-5 h-5" />, label: "In Progress",    val: myStats.active,   bg: "bg-blue-50 border-blue-200",       text: "text-blue-700" },
            { icon: <CheckCircle className="w-5 h-5" />, label: "Resolved",       val: myStats.resolved, bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border p-4 shadow-sm ${s.bg}`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-lg">{s.icon}</span>
                <span className={`text-3xl font-black tabular-nums ${s.text}`}>{s.val}</span>
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${s.text} opacity-60`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* About FixMyArea — Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#064E3B] p-6 sm:p-8 shadow-lg">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-200 text-[11px] font-bold uppercase tracking-widest">FixMyArea Platform</span>
              </div>
              <h2 className="text-white text-xl sm:text-2xl font-extrabold leading-tight mb-2">
                Empowering Citizens to Fix<br />Their Communities
              </h2>
              <p className="text-emerald-200 text-sm leading-relaxed max-w-md">
                FixMyArea is a civic tech platform where citizens report local issues — potholes, broken streetlights, garbage dumps — and track them until they're resolved by authorities.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button onClick={() => navigate("/report-issue")} className="bg-white text-[#064E3B] text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-gray-100 transition shadow-sm"><AlertTriangle className="w-4 h-4 ml-1 mb-0.5 inline-block" /> Report an Issue</button>
                <button onClick={() => navigate("/local-issues")} className="border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/10 transition"><Map className="w-4 h-4 mr-1 inline-block" /> View Local Issues</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-shrink-0">
              {[
                { icon: <Building2 className="w-5 h-5 mx-auto" />, val: "Civic",   label: "Platform" },
                { icon: <Lock className="w-5 h-5 mx-auto" />, val: "Secure",  label: "Login" },
                { icon: <Radio className="w-5 h-5 mx-auto" />, val: "Live",    label: "Real-time" },
                { icon: <MapPin className="w-5 h-5 mx-auto" />, val: "GPS",     label: "Enabled" },
              ].map(s => (
                <div key={s.label} className="bg-white/10 border border-white/20 rounded-2xl px-3 py-2.5 text-center">
                  <div className="text-base mb-1.5 flex justify-center text-white">{s.icon}</div>
                  <p className="text-white text-xs font-bold">{s.val}</p>
                  <p className="text-emerald-300 text-[10px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">How FixMyArea Works</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">3 simple steps to fix your area</p>
            </div>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 relative">
            {[
              { step: "01", icon: <Camera className="w-6 h-6" />, color: "emerald", title: "Report an Issue",  desc: "Take a photo, drop a pin on the map and describe the problem. Under 2 minutes." },
              { step: "02", icon: <Bell className="w-6 h-6" />, color: "amber",   title: "Track Progress",   desc: "Get real-time status updates as authorities review and act on your report." },
              { step: "03", icon: <CheckCircle className="w-6 h-6" />, color: "blue",    title: "Issue Resolved",   desc: "Once fixed, the issue is marked Resolved. Your contribution makes a difference." },
            ].map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center p-4">
                {/* Connector line */}
                {i < 2 && <div className="hidden sm:block absolute top-10 left-[calc(50%+2rem)] right-0 h-px bg-gray-200 z-0" />}
                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 mb-3 text-gray-600 ${
                  s.color === "emerald" ? "bg-emerald-50 border-emerald-200" :
                  s.color === "amber"   ? "bg-amber-50 border-amber-200" :
                                         "bg-blue-50 border-blue-200"
                }`}>
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#064E3B] text-white text-[9px] font-black flex items-center justify-center">{s.step}</span>
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">Tips for Better Reports</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Follow these to get issues resolved faster</p>
            </div>
            <Lightbulb className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { icon: <Camera className="w-6 h-6" />, tip: "Upload a clear photo", sub: "Increases resolution chances by 3x" },
              { icon: <MapPin className="w-5 h-5" />, tip: "Use GPS location",     sub: "Avoid vague area descriptions" },
              { icon: <FileText className="w-5 h-5" />, tip: "Write a clear title",  sub: "Admins prioritise clear reports" },
              { icon: <Bell className="w-6 h-6" />, tip: "Check back in 48h",   sub: "Most issues reviewed within 2 days" },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-base flex-shrink-0 shadow-sm">{t.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">{t.tip}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-extrabold text-gray-900">Recent Reports</h2>
            <button onClick={() => setActiveNav("myissues")} className="text-xs font-semibold text-[#064E3B] hover:underline">View All ({myStats.total}) →</button>
          </div>
          {recentIssues.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Inbox className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-600">No reports yet</p>
              <button className="mt-3 text-xs font-bold text-[#064E3B] underline underline-offset-2" onClick={() => navigate("/report-issue")}>Report your first issue →</button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentIssues.map(issue => (
                <div key={issue.id} onClick={() => navigate(`/issue/${issue.id}`)} className="flex items-center gap-3 py-3 cursor-pointer group hover:bg-gray-50 -mx-2 px-2 rounded-xl transition">
                  {issue.photoURL
                    ? <img src={issue.photoURL} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" alt="" />
                    : <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><Pin className="w-6 h-6 text-gray-400" /></div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <StatusBadge status={issue.status || "Pending"} />
                      <span className="text-[10px] text-gray-400">{fmtDate(issue.createdAt)}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 truncate">{issue.title || issue.category}</p>
                    <p className="text-xs text-gray-500 truncate">{locationStr(issue.location) || "Location not set"}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-[#064E3B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* What can you report — category chips */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">What Can You Report?</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Tap any category to start a report instantly</p>
            </div>
            <button onClick={() => navigate("/report-issue")} className="text-[10px] font-bold text-[#064E3B] border border-[#064E3B]/30 px-3 py-1.5 rounded-lg hover:bg-[#064E3B]/5 transition">+ New Report</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[
              { icon: <Wrench className="w-5 h-5" />, label: "Road & Infrastructure", color: "bg-orange-50 border-orange-100 text-orange-700" },
              { icon: <Layers className="w-5 h-5" />, label: "Garbage & Cleanliness",  color: "bg-green-50 border-green-100 text-green-700" },
              { icon: <Inbox className="w-5 h-5" />, label: "Water Supply",            color: "bg-blue-50 border-blue-100 text-blue-700" },
              { icon: <Lightbulb className="w-5 h-5" />, label: "Electricity",              color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
              { icon: <MapIcon className="w-5 h-5" />, label: "Environment & Parks",     color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
              { icon: <Car className="w-5 h-5" />, label: "Traffic & Transport",     color: "bg-red-50 border-red-100 text-red-700" },
              { icon: <ShieldCheck className="w-5 h-5" />, label: "Safety & Security",       color: "bg-violet-50 border-violet-100 text-violet-700" },
              { icon: <Building2 className="w-5 h-5" />, label: "Housing Problems",         color: "bg-stone-50 border-stone-100 text-stone-700" },
              { icon: <Users className="w-5 h-5" />, label: "Accessibility",             color: "bg-cyan-50 border-cyan-100 text-cyan-700" },
              { icon: "🚨", label: "Emergency Issues",         color: "bg-rose-50 border-rose-100 text-rose-700" },
              { icon: <Building2 className="w-5 h-5" />, label: "Government Services",     color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
              { icon: <Layers className="w-5 h-5" />, label: "Drainage & Sewage",        color: "bg-teal-50 border-teal-100 text-teal-700" },
            ].map(c => (
              <button key={c.label} onClick={() => navigate("/report-issue")}
                className={`flex items-center gap-2 border px-3 py-2.5 rounded-xl text-xs font-semibold hover:scale-[1.02] transition-all text-left ${c.color}`}>
                <span className="text-base flex-shrink-0">{c.icon}</span>
                <span className="truncate">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl overflow-hidden relative bg-gradient-to-r from-[#064E3B] to-[#065F46] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #34D399 0%, transparent 60%)' }} />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center flex-shrink-0"><Building2 className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-sm font-extrabold text-white">See what's happening in your area</p>
              <p className="text-xs text-emerald-200 mt-0.5">Browse all active civic issues near you on the map.</p>
            </div>
          </div>
          <button onClick={() => navigate("/local-issues")} className="relative flex-shrink-0 bg-white text-[#064E3B] text-xs font-extrabold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm">
            Explore Issues Map →
          </button>
        </div>

      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F3F4F6]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Mobile topbar */}
      <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
        <button onClick={() => setSidebarOpen(true)}>
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span className="text-sm font-extrabold text-gray-900">FixMyArea</span>
        <div className="w-8 h-8 rounded-full bg-[#064E3B] flex items-center justify-center text-white text-sm font-bold">
          {initials}
        </div>
      </header>

      <div className="flex max-w-[1440px] mx-auto">

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
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 min-h-screen bg-white border-r border-gray-200">
          <SidebarContent />
        </aside>

        {/* Centre + Right */}
        <div className="flex-1 min-w-0 flex flex-col xl:flex-row">

          <main className={`flex-1 p-4 sm:p-6 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {renderMain()}
          </main>

          {/* Right sidebar — only on dashboard tab, xl screens */}
          {activeNav === "dashboard" && (
            <aside className="hidden xl:flex flex-col w-72 flex-shrink-0 border-l border-gray-200 bg-white p-5 space-y-5 min-h-screen">

              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Community Activity</h3>
                <div className="space-y-2">
                  {communityFeed.slice(0, 4).map((issue, i) => (
                    <div key={issue.id}
                      onClick={() => navigate(`/issue/${issue.id}`)}
                      className="flex items-start gap-2.5 cursor-pointer group p-2 rounded-xl hover:bg-gray-50 transition -mx-2">
                      {issue.photoURL
                        ? <img src={issue.photoURL} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" alt="" />
                        : <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                            ["bg-emerald-100", "bg-blue-100", "bg-amber-100", "bg-violet-100"][i % 4]
                          }`}>{["🟢","🔵","🟡","🟣"][i % 4]}</div>
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-[#064E3B] transition">
                          {issue.title || issue.category}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {relTime(issue.createdAt)}{locationStr(issue.location) ? ` · ${locationStr(issue.location).split(",")[0]}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                  {communityFeed.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No recent activity</p>
                  )}
                </div>
                <button onClick={() => navigate("/local-issues")}
                  className="mt-2 w-full text-center text-xs font-semibold text-[#064E3B] underline underline-offset-2 hover:text-[#053d2f]">
                  Browse all issues →
                </button>
              </div>

              {/* Mini donut */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">My Issue Breakdown</h3>
                <DonutMini resolved={myStats.resolved} active={myStats.active} pending={myStats.pending} />
              </div>

              {/* Quick links */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Quick Links</h3>
                {[
                  { icon: <FileText className="w-5 h-5" />, label: "Report Issue",  path: "/report-issue" },
                  { icon: <Globe className="w-5 h-5" />, label: "Browse Issues", path: "/local-issues" },
                  { icon: "👤", label: "My Profile",    path: "/profile" },
                  { icon: "📞", label: "Contact Us",    path: "/contact" },
                ].map(({ icon, label, path }) => (
                  <button key={label} onClick={() => navigate(path)}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition text-left">
                    <span>{icon}</span>{label}
                  </button>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
