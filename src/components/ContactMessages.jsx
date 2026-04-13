import { useState, useEffect } from "react";
import {
  collection, query, orderBy, onSnapshot,
  doc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

/* ── Status config ───────────────────────────────────────────────────────── */
const STATUS_CFG = {
  "New":         { badge: "bg-blue-100 text-blue-700 border-blue-200",    dot: "bg-blue-500",    active: "bg-blue-600 text-white"    },
  "In Progress": { badge: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500",   active: "bg-amber-500 text-white"   },
  "Resolved":    { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", active: "bg-[#064E3B] text-white" },
  "Closed":      { badge: "bg-gray-100 text-gray-500 border-gray-200",    dot: "bg-gray-400",    active: "bg-gray-500 text-white"    },
};
const STATUS_OPTIONS = ["New", "In Progress", "Resolved", "Closed"];
const FILTER_OPTIONS = ["All", ...STATUS_OPTIONS];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function fmt(ts) {
  if (!ts) return "—";
  const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function rel(ts) {
  if (!ts) return "";
  const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  const h = Math.floor((Date.now() - d) / 3600000);
  if (h < 1)  return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return days < 30 ? `${days}d ago` : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
function initials(name = "") {
  return name.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

/* ── Avatar ──────────────────────────────────────────────────────────────── */
function Avatar({ name }) {
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${colors[idx]}`}>
      {initials(name)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════════════ */
export default function ContactMessages() {
  const [messages, setMessages]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("All");
  const [search, setSearch]               = useState("");
  const [selectedMsg, setSelectedMsg]     = useState(null);
  const [updating, setUpdating]           = useState(false);

  /* ── Real-time listener ── */
  useEffect(() => {
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ── Derived lists ── */
  const filtered = messages.filter(m => {
    const matchStatus = filter === "All" || (m.status || "New") === filter;
    const matchSearch = !search.trim() ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  /* ── Actions ── */
  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "contactMessages", id), { status: newStatus, updatedAt: new Date() });
      // Reflect change locally so modal updates immediately
      setSelectedMsg(prev => prev?.id === id ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await deleteDoc(doc(db, "contactMessages", id));
      setSelectedMsg(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete");
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading messages…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── Stat row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: "📬", label: "Total",       value: messages.length,                                        bg: "bg-white border-gray-200",           text: "text-gray-900"    },
          { icon: "🆕", label: "New",         value: messages.filter(m => (m.status || "New") === "New").length,     bg: "bg-blue-50 border-blue-200",         text: "text-blue-700"    },
          { icon: "⏳", label: "In Progress", value: messages.filter(m => m.status === "In Progress").length, bg: "bg-amber-50 border-amber-200",       text: "text-amber-700"   },
          { icon: "✅", label: "Resolved",    value: messages.filter(m => m.status === "Resolved").length,    bg: "bg-emerald-50 border-emerald-200",   text: "text-emerald-700" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 shadow-sm ${s.bg}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{s.icon}</span>
              <span className={`text-2xl font-black ${s.text}`}>{s.value}</span>
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${s.text} opacity-60`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            type="text"
            placeholder="Search name, email, subject…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_OPTIONS.map(f => {
            const cnt = f === "All" ? messages.length : messages.filter(m => (m.status || "New") === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
                  filter === f
                    ? "bg-[#064E3B] text-white border-[#064E3B] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#064E3B]/40"
                }`}>
                {f} <span className="opacity-70">({cnt})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Message list ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <span className="text-5xl mb-3">📭</span>
          <p className="font-semibold text-gray-600">No messages found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(msg => {
            const status = msg.status || "New";
            const sc = STATUS_CFG[status] || STATUS_CFG["New"];
            return (
              <div
                key={msg.id}
                onClick={() => setSelectedMsg(msg)}
                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#064E3B]/30 transition-all cursor-pointer group flex items-start gap-4"
              >
                <Avatar name={msg.name} />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-bold text-gray-900 text-sm group-hover:text-[#064E3B] transition-colors">{msg.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{msg.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${sc.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {status}
                      </span>
                      <span className="text-[10px] text-gray-400 hidden sm:block">{rel(msg.createdAt)}</span>
                    </div>
                  </div>

                  {msg.subject && (
                    <p className="text-xs font-semibold text-gray-700 mb-1 truncate">📌 {msg.subject}</p>
                  )}
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{msg.message}</p>

                  {msg.phone && (
                    <p className="text-[10px] text-gray-400 mt-1.5">📱 {msg.phone}</p>
                  )}
                </div>

                <svg className="w-4 h-4 text-gray-300 group-hover:text-[#064E3B] flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════ Detail Modal ══════════ */}
      {selectedMsg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelectedMsg(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col"
            style={{ animation: "slideUp 0.3s ease-out" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Avatar name={selectedMsg.name} />
                <div>
                  <p className="text-sm font-extrabold text-gray-900">{selectedMsg.name}</p>
                  <p className="text-[11px] text-gray-500 font-mono">{selectedMsg.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 space-y-5">
              {/* Meta row */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "📌", label: "Subject",  value: selectedMsg.subject || "—" },
                  { icon: "📱", label: "Phone",    value: selectedMsg.phone || "Not provided" },
                  { icon: "🕒", label: "Received", value: fmt(selectedMsg.createdAt) },
                  { icon: "🔄", label: "Status",   value: selectedMsg.status || "New" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{icon} {label}</p>
                    <p className="text-xs font-bold text-gray-900 break-words">{value}</p>
                  </div>
                ))}
              </div>

              {/* Message */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">💬 Message</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedMsg.message}</p>
              </div>

              {/* Status update */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">🔄 Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => {
                    const cfg = STATUS_CFG[s];
                    const isActive = (selectedMsg.status || "New") === s;
                    return (
                      <button key={s} disabled={updating || isActive}
                        onClick={() => handleStatusUpdate(selectedMsg.id, s)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                          isActive
                            ? `${cfg.active} border-transparent shadow-sm cursor-default`
                            : `${cfg.badge} hover:scale-105 disabled:opacity-50`
                        }`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 rounded-b-3xl">
              <a
                href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                className="flex-1 bg-[#064E3B] hover:bg-[#053d2f] text-white text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                📧 Reply via Email
              </a>
              <button
                onClick={() => handleDelete(selectedMsg.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold py-2.5 rounded-xl border border-red-100 transition-all flex items-center justify-center gap-2"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
