import { useEffect, useState } from "react";
import { ArrowLeft, Folder, MapPin, Clock, Search, ThumbsUp, Map, MessageSquare } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import LikeButton from "../components/LikeButton";
import CommentsSection from "../components/CommentsSection";
import RetweetButton from "../components/RetweetButton";
import Footer from "../components/Footer";

const STATUS_CONFIG = {
  "Pending":     { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500"  },
  "In Progress": { bg: "bg-blue-100",  text: "text-blue-700",  border: "border-blue-200",  dot: "bg-blue-500"   },
  "Resolved":    { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  "Rejected":    { bg: "bg-red-100",   text: "text-red-700",   border: "border-red-200",   dot: "bg-red-500"    },
  "Under Review":{ bg: "bg-violet-100",text: "text-violet-700",border: "border-violet-200",dot: "bg-violet-500" },
};

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const docSnap = await getDoc(doc(db, "issues", id));
        if (docSnap.exists()) setIssue({ id: docSnap.id, ...docSnap.data() });
        else setError("Issue not found");
      } catch (err) {
        console.error("Error fetching issue:", err);
        setError("Failed to load issue");
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading issue...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <>
        <div className="min-h-screen bg-[#F3F4F6]">
          <Navbar />
          <div className="mx-auto max-w-3xl px-4 pt-28 pb-16">
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-600 font-medium">
              {error || "Issue not found"}
            </div>
            <button onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#064E3B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#053d2f] transition">
              <ArrowLeft className="w-4 h-4 inline mr-1 -mt-0.5" /> Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { title, category, subIssue, description, photoURL, status, location, likes = [], likesCount = 0 } = issue;
  const sc = STATUS_CONFIG[status] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-400" };
  const locationStr = typeof location === "object"
    ? [location?.village, location?.block, location?.district, location?.state].filter(Boolean).join(", ") + (location?.pinCode ? ` - ${location.pinCode}` : "")
    : location || "Not specified";

  return (
    <>
      <div className="min-h-screen bg-[#F3F4F6]">
        <Navbar />

        {/* ── Page Header ── */}
        <div className="bg-[#064E3B] px-4 pt-20 pb-8">
          <div className="mx-auto max-w-4xl">
            <button onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-emerald-200 hover:text-white transition text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Issues
            </button>
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="flex-1 text-xl font-bold text-white sm:text-2xl">
                {title || `${category} — ${subIssue}`}
              </h1>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${sc.bg} ${sc.text} ${sc.border}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                {status}
              </span>
            </div>
            {/* Metadata strip */}
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-emerald-200">
              {category && <span>📂 {category}{subIssue ? ` › ${subIssue}` : ""}</span>}
              {locationStr && <span><MapPin className="w-4 h-4 inline mr-1 -mt-0.5" /> {locationStr}</span>}
              {issue.createdAt && (
                <span><Clock className="w-4 h-4 inline mr-1 -mt-0.5" /> {new Date(issue.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              )}
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-5">

          {/* ── Photo ── */}
          {photoURL && (
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-sm cursor-pointer group"
              onClick={() => setShowImageModal(true)}>
              <img src={photoURL} alt={title}
                className="w-full max-h-[480px] object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow"><Search className="w-4 h-4 inline mr-1 -mt-0.5" /> View Full Size</span>
              </div>
            </div>
          )}

          {/* ── Description ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">Description</h2>
            <p className="text-gray-700 leading-relaxed">{description || "No description provided."}</p>
          </div>

          {/* ── Info Grid ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: <Folder className="w-5 h-5" />, label: "Category", value: `${category}${subIssue ? ` › ${subIssue}` : ""}` },
              { icon: <MapPin className="w-5 h-5" />, label: "Location", value: locationStr },
              { icon: <ThumbsUp className="w-5 h-5" />, label: "Community Votes", value: `${issue.upvotes || 0} upvotes` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <span>{icon}</span> {label}
                </div>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* ── GPS Map ── */}
          {issue.locationCoords?.lat && issue.locationCoords?.lon && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400">
                <Map className="w-5 h-5 inline mr-1 -mt-0.5" /> Live GPS Location
              </h2>
              <div className="relative overflow-hidden rounded-xl border border-gray-200 h-[350px]">
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#064E3B] shadow">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  GPS Coordinates
                </div>
                <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
                  src={`https://maps.google.com/maps?q=${issue.locationCoords.lat},${issue.locationCoords.lon}&z=16&output=embed`} />
              </div>
            </div>
          )}

          {/* ── Engagement Actions ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-400">Community Engagement</h2>
            <div className="flex flex-wrap items-center gap-3">
              <LikeButton issueId={id} likes={likes} likesCount={likesCount} />
              <RetweetButton issueId={id} />
            </div>
          </div>

          {/* ── Comments ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-400"><MessageSquare className="w-4 h-4 inline mr-1 -mt-0.5 ml-1" /> Comments</h2>
            <CommentsSection issueId={id} />
          </div>
        </main>
      </div>

      <Footer />

      {/* ── Image Lightbox ── */}
      {showImageModal && photoURL && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}>
          <button onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={photoURL} alt={title} className="max-h-[90vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-4 text-xs text-white/50">Click outside to close</p>
        </div>
      )}
    </>
  );
}
