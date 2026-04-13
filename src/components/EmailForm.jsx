import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/* ── Status badge colours ────────────────────────────────────────────────── */
const STATUS_COLOR = {
  "Pending":       "bg-amber-100 text-amber-700 border-amber-200",
  "Under Review":  "bg-violet-100 text-violet-700 border-violet-200",
  "In Progress":   "bg-blue-100 text-blue-700 border-blue-200",
  "Resolved":      "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Rejected":      "bg-red-100 text-red-700 border-red-200",
  "Fake":          "bg-gray-100 text-gray-500 border-gray-200",
  "Not Important": "bg-gray-100 text-gray-400 border-gray-200",
};

/* ── Format timestamp ────────────────────────────────────────────────────── */
function formatDateTime(ts) {
  if (!ts) return "—";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── Relative time ───────────────────────────────────────────────────────── */
function relativeTime(ts) {
  if (!ts) return "";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  const diff = Date.now() - d.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1)  return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function EmailForm({ issue, onClose }) {
  const [governmentEmail, setGovernmentEmail] = useState(issue.responsibleEmail || "");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const [history, setHistory]   = useState([]);
  const [histLoading, setHistLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("compose"); // compose | history

  const locationStr =
    typeof issue.location === "object"
      ? Object.values(issue.location).filter(Boolean).join(", ")
      : issue.location || "Not specified";

  /* ── Fetch email history from Firestore ── */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const snap = await getDoc(doc(db, "issues", issue.id));
        if (snap.exists()) {
          const h = snap.data().govEmailHistory || [];
          // Sort newest first
          setHistory([...h].sort((a, b) => {
            const ta = a.sentAt?.toDate?.() || new Date(a.sentAt || 0);
            const tb = b.sentAt?.toDate?.() || new Date(b.sentAt || 0);
            return tb - ta;
          }));
        }
      } catch (e) {
        console.error("History fetch error:", e);
      } finally {
        setHistLoading(false);
      }
    };
    if (issue.id) fetchHistory();
    else setHistLoading(false);
  }, [issue.id]);

  /* ── Send Email ── */
  const handleSend = async () => {
    if (!governmentEmail || !governmentEmail.includes("@")) {
      setError("Please enter a valid government email address.");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      governmentEmail,
      issueTitle:       issue.title,
      issueDescription: issue.description,
      issueCategory:    issue.category,
      issueLocation:    locationStr,
      reportedBy:       issue.userName || "Anonymous",
      upvotes:          issue.upvotes || 0,
      imageUrl:         issue.imageUrl || issue.photoURL || "",
      issueId:          issue.id || "",
    };

    try {
      const response = await fetch(`${API_URL}/api/send-to-government`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        /* ── Save to Firestore history ── */
        const logEntry = {
          email:  governmentEmail,
          sentAt: new Date().toISOString(),   // plain ISO — no serverTimestamp in array
          status: "sent",
        };
        try {
          await updateDoc(doc(db, "issues", issue.id), {
            govEmailHistory: arrayUnion(logEntry),
          });
          // Update local history
          setHistory(prev => [logEntry, ...prev]);
        } catch (fsErr) {
          console.error("Firestore log error:", fsErr);
        }

        setSuccess(true);
        setTimeout(onClose, 2200);
      } else {
        setError(data.message || "Failed to send email. Please try again.");
      }
    } catch (err) {
      console.error("Email send error:", err);
      setError("Network error — please check your connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  const sc = STATUS_COLOR[issue.status] || "bg-gray-100 text-gray-600 border-gray-200";
  const lastSent = history[0];

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        {/* ── Modal Card ── */}
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col"
          style={{ animation: "slideUp 0.3s ease-out" }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#064E3B] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-xl">🏛️</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 leading-tight">Send to Government</h3>
                <p className="text-[11px] text-gray-500 font-medium">Official civic escalation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Last Sent Banner ── */}
          {lastSent && !success && (
            <div className="mx-6 mt-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-3">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-800">Previously sent to government</p>
                <p className="text-xs text-amber-700 font-mono mt-0.5 truncate">{lastSent.email}</p>
                <p className="text-[10px] text-amber-600 mt-0.5">
                  {formatDateTime(lastSent.sentAt)} &nbsp;·&nbsp; {relativeTime(lastSent.sentAt)}
                </p>
              </div>
              <button
                onClick={() => setActiveTab("history")}
                className="flex-shrink-0 text-[10px] font-bold text-amber-700 underline underline-offset-2 hover:text-amber-900 whitespace-nowrap"
              >
                View all →
              </button>
            </div>
          )}

          {/* ── Tabs ── */}
          <div className="flex gap-1 px-6 pt-4">
            {[
              { id: "compose", label: "📧 Compose" },
              { id: "history", label: `📋 History ${history.length > 0 ? `(${history.length})` : ""}` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-[#064E3B] text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ══════════ COMPOSE TAB ══════════ */}
          {activeTab === "compose" && (
            <div className="flex-1 p-6 space-y-5">
              {/* Alerts */}
              {success && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-5 py-4 flex items-center gap-3 text-sm font-medium">
                  <span className="text-xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold">Email Sent!</p>
                    <p className="font-normal text-emerald-600 text-xs mt-0.5">Government authority has been notified.</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 flex items-center gap-3 text-sm font-medium">
                  <span className="text-xl flex-shrink-0">⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Issue Preview Card */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
                {issue.photoURL && (
                  <div className="w-full bg-gray-900 rounded-t-2xl overflow-hidden flex items-center justify-center">
                    <img src={issue.photoURL} alt={issue.title} className="w-full max-h-56 object-contain" />
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight flex-1">
                      {issue.title || issue.category}
                    </h4>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold flex-shrink-0 ${sc}`}>
                      {issue.status}
                    </span>
                  </div>
                  {issue.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{issue.description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: "📂", label: "Category",  value: issue.category },
                      { icon: "📍", label: "Location",  value: locationStr },
                      { icon: "👤", label: "Reporter",  value: issue.userName || "Anonymous" },
                      { icon: "👍", label: "Support",   value: `${issue.upvotes || 0} upvotes` },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="bg-white rounded-xl border border-gray-100 px-3 py-2">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{icon} {label}</p>
                        <p className="text-xs font-bold text-gray-800 truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  🏛️ Government Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g., municipalcorp@gov.in"
                  value={governmentEmail}
                  onChange={e => setGovernmentEmail(e.target.value)}
                  disabled={loading || success}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 transition-all font-medium disabled:opacity-60"
                />
                <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                  <span>ℹ️</span>
                  <span>Email sent from <strong>fixmyareas@gmail.com</strong> on behalf of FixMyArea.</span>
                </p>
              </div>

              {/* What's included */}
              <div className="bg-[#064E3B]/5 border border-[#064E3B]/10 rounded-2xl px-4 py-3">
                <p className="text-xs font-bold text-[#064E3B] mb-2 uppercase tracking-wide">📋 Email will include</p>
                <ul className="space-y-1">
                  {[
                    "Issue title, category & description",
                    "Exact location details",
                    "Photo evidence attachment",
                    "Number of community upvotes",
                    "Issue ID for official tracking",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ══════════ HISTORY TAB ══════════ */}
          {activeTab === "history" && (
            <div className="flex-1 p-6">
              <h4 className="text-sm font-bold text-gray-900 mb-4">
                Email History
                <span className="ml-2 text-xs font-semibold text-gray-400">({history.length} total)</span>
              </h4>

              {histLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#064E3B] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <span className="text-4xl mb-3">📭</span>
                  <p className="text-sm font-semibold text-gray-600">No emails sent yet</p>
                  <p className="text-xs mt-1">Go to Compose tab to send the first notification.</p>
                  <button
                    onClick={() => setActiveTab("compose")}
                    className="mt-4 text-xs font-bold text-[#064E3B] underline underline-offset-2"
                  >
                    Compose Email →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl border p-4 flex items-start gap-3 ${
                        i === 0
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${
                        i === 0 ? "bg-emerald-100" : "bg-gray-100"
                      }`}>
                        📧
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-mono font-bold text-gray-900 truncate">{entry.email}</p>
                          {i === 0 && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex-shrink-0">
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {formatDateTime(entry.sentAt)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {relativeTime(entry.sentAt)}
                        </p>
                      </div>

                      {/* Status dot */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-600">Sent</span>
                      </div>
                    </div>
                  ))}

                  {/* Summary footer */}
                  <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-center">
                    <p className="text-xs text-gray-500">
                      Total <strong className="text-gray-700">{history.length}</strong> email{history.length !== 1 ? "s" : ""} sent for this issue.
                      Last sent <strong className="text-gray-700">{relativeTime(lastSent?.sentAt)}</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Footer Actions ── (only on compose tab) */}
          {activeTab === "compose" && (
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 rounded-b-3xl">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={loading || success || !governmentEmail}
                className="flex-[2] py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2f] text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : success ? (
                  <>✓ Sent Successfully</>
                ) : (
                  <>📧 Send to Government</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

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
    </>
  );
}
