import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Search, Folder, MapPin, ThumbsUp, Map, User, Smartphone, IdCard, Clock, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import EmailForm from "../components/EmailForm";

const STATUS_OPTIONS = ["Pending", "Under Review", "Not Important", "Fake", "In Progress", "Resolved", "Rejected"];

const STATUS_CONFIG = {
  "Pending":      { color: "bg-amber-100 text-amber-700 border-amber-300",   active: "bg-amber-500 text-white" },
  "Under Review": { color: "bg-violet-100 text-violet-700 border-violet-300", active: "bg-violet-500 text-white" },
  "In Progress":  { color: "bg-blue-100 text-blue-700 border-blue-300",       active: "bg-blue-500 text-white"  },
  "Resolved":     { color: "bg-emerald-100 text-emerald-700 border-emerald-300", active: "bg-emerald-600 text-white" },
  "Rejected":     { color: "bg-red-100 text-red-700 border-red-300",          active: "bg-red-500 text-white"   },
  "Fake":         { color: "bg-gray-100 text-gray-600 border-gray-300",       active: "bg-gray-500 text-white"  },
  "Not Important":{ color: "bg-gray-100 text-gray-500 border-gray-200",       active: "bg-gray-400 text-white"  },
};

export default function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchIssueAndUser = async () => {
      try {
        setLoading(true);
        const issueSnap = await getDoc(doc(db, "issues", id));
        if (issueSnap.exists()) {
          const issueData = { id: issueSnap.id, ...issueSnap.data() };
          setIssue(issueData);
          if (issueData.userId) {
            const userSnap = await getDoc(doc(db, "users", issueData.userId));
            if (userSnap.exists()) setUserData(userSnap.data());
          }
        } else {
          alert("Issue not found!");
          navigate("/admin-dashboard");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Error loading issue");
      } finally {
        setLoading(false);
      }
    };
    fetchIssueAndUser();
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "issues", id), { status: newStatus, updatedAt: new Date() });
      setIssue({ ...issue, status: newStatus });
      alert("Status updated successfully!");
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to DELETE this issue permanently?\n\nThis action CANNOT be undone!")) return;
    setUpdating(true);
    try {
      await deleteDoc(doc(db, "issues", id));
      alert("Issue deleted successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (!issue) return null;

  const sc = STATUS_CONFIG[issue.status] || STATUS_CONFIG["Pending"];
  const currentSc = STATUS_CONFIG[issue.status] || {};
  const locationStr = typeof issue.location === "object"
    ? Object.values(issue.location).filter(Boolean).join(", ")
    : (issue.location || "Not specified");

  return (
    <div className="min-h-screen bg-[#F3F4F6]">

      {/* ── Admin Top Bar ── */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
        <button onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#064E3B] transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Admin Dashboard
        </button>
        <div className="flex items-center gap-2">
          <span className={`hidden rounded-full border px-3 py-1 text-xs font-semibold sm:inline-flex ${currentSc.active || "bg-gray-100 text-gray-600"}`}>
            {issue.status}
          </span>
          <button onClick={() => setShowEmailForm(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#053d2f] transition">
            <Mail className="w-4 h-4 inline mr-1 -mt-0.5" /> Send to Govt
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-5">

        {/* ── Issue Photo ── */}
        {issue.photoURL && (
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-sm cursor-pointer group"
            onClick={() => setShowImageModal(true)}>
            <img src={issue.photoURL} alt={issue.title}
              className="w-full max-h-[520px] object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl bg-white/90 px-5 py-2.5 text-sm font-medium text-gray-700 shadow flex items-center gap-2">
                <Search className="w-4 h-4 inline mr-1 -mt-0.5" /> View Full Size
              </div>
            </div>
          </div>
        )}

        {/* ── Title + Description ── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{issue.title}</h1>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${sc.color}`}>
              {issue.status}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{issue.description}</p>
        </div>

        {/* ── Metadata Grid ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: <Folder className="w-5 h-5" />, label: "Category", value: issue.category },
            { icon: <Search className="w-5 h-5" />, label: "Sub-Issue", value: issue.subIssue || "—" },
            { icon: <MapPin className="w-5 h-5" />, label: "Location", value: locationStr },
            { icon: <ThumbsUp className="w-5 h-5" />, label: "Upvotes", value: `${issue.upvotes || 0}` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{icon} {label}</div>
              <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
            </div>
          ))}
        </div>

        {/* ── GPS Map ── */}
        {issue.locationCoords?.lat && issue.locationCoords?.lon && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400">
              <Map className="w-5 h-5 inline mr-1 -mt-0.5 text-gray-500" /> Live GPS Location
            </h3>
            <div className="relative overflow-hidden rounded-xl border border-gray-100 h-[380px]">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#064E3B] shadow">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Exact GPS Point
              </div>
              <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
                src={`https://maps.google.com/maps?q=${issue.locationCoords.lat},${issue.locationCoords.lon}&z=16&output=embed`} />
            </div>
          </div>
        )}

        {/* ── Reporter Information ── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-400"><User className="w-5 h-5 inline mr-1 -mt-0.5 text-gray-400" /> Reporter Information</h3>
          {userData ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { icon: <User className="w-5 h-5" />, label: "Full Name", value: userData.displayName || userData.name || "Anonymous" },
                { icon: <Mail className="w-5 h-5" />, label: "Email", value: userData.email || "Not provided" },
                { icon: <Smartphone className="w-5 h-5" />, label: "Phone", value: userData.phone || "Not provided" },
                { icon: <IdCard className="w-5 h-5" />, label: "User ID", value: issue.userId, mono: true },
              ].map(({ icon, label, value, mono }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-base">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className={`text-sm font-semibold text-gray-800 break-all ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 border-t border-gray-100 pt-4 flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-base"><Clock className="w-5 h-5 text-emerald-500" /></div>
                <div>
                  <p className="text-xs text-gray-400">Reported On</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {issue.createdAt
                      ? new Date(issue.createdAt.seconds * 1000).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "Date not available"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">User information not available — ID: {issue.userId}</p>
          )}
        </div>

        {/* ── Status Update Section ── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-400"><RefreshCw className="w-5 h-5 inline mr-1 -mt-0.5 text-gray-400" /> Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => {
              const cfg = STATUS_CONFIG[s] || {};
              const isActive = issue.status === s;
              return (
                <button key={s} disabled={updating || isActive}
                  onClick={() => handleStatusUpdate(s)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive ? cfg.active : `${cfg.color} hover:scale-105 disabled:opacity-50`
                  }`}>
                  {s}
                </button>
              );
            })}
          </div>

          {updating && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#064E3B]">
              <div className="w-4 h-4 border-2 border-[#064E3B] border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          )}

          {/* Delete section */}
          {(issue.status === "Fake" || issue.status === "Not Important") && (
            <div className="mt-5 border-t border-red-100 pt-5">
              <button onClick={handleDelete} disabled={updating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50">
                <Trash2 className="w-4 h-4 inline mr-1 -mt-0.5" /> Delete This Issue Permanently
              </button>
              <p className="mt-2 text-center text-xs text-red-500"><AlertTriangle className="w-4 h-4 inline mr-1 -mt-0.5" /> This action cannot be undone!</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Email Form Modal ── */}
      {showEmailForm && <EmailForm issue={issue} onClose={() => setShowEmailForm(false)} />}

      {/* ── Image Lightbox ── */}
      {showImageModal && issue.photoURL && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}>
          <button onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={issue.photoURL} alt={issue.title}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-4 text-xs text-white/40">Click outside to close</p>
        </div>
      )}
    </div>
  );
}
