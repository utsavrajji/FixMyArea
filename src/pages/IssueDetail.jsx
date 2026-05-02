import { useEffect, useState } from "react";
import { ArrowLeft, Folder, MapPin, Clock, Search, ThumbsUp, Map, MessageSquare } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import LikeButton from "../components/LikeButton";
import CommentsSection from "../components/CommentsSection";
import RetweetButton from "../components/RetweetButton";
import Footer from "../components/Footer";
import { IssueCardSkeleton, ProfileSkeleton } from "../components/Skeleton";
import { motion, AnimatePresence } from "framer-motion";

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
    if (!id) return;

    // Real-time listener for the issue document
    const unsub = onSnapshot(doc(db, "issues", id), (docSnap) => {
      if (docSnap.exists()) {
        setIssue({ id: docSnap.id, ...docSnap.data() });
        setError("");
      } else {
        setError("Issue not found");
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching issue:", err);
      setError("Failed to load issue details");
      setLoading(false);
    });

    return () => unsub(); // Cleanup listener on unmount
  }, [id]);

  const renderSkeleton = () => (
    <div className="bg-[#F3F4F6]">
      <div className="bg-[#064E3B] px-4 pt-24 pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="h-4 w-24 bg-emerald-800/50 rounded mb-4 animate-pulse" />
          <div className="h-8 w-3/4 bg-emerald-800/50 rounded mb-4 animate-pulse" />
          <div className="flex gap-4">
            <div className="h-4 w-32 bg-emerald-800/50 rounded animate-pulse" />
            <div className="h-4 w-32 bg-emerald-800/50 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="h-64 w-full bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-32 w-full bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse" />
          ))}
        </div>
        <ProfileSkeleton />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderSkeleton()}
            </motion.div>
          ) : error || !issue ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl px-4 pt-28 pb-16 text-center"
            >
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-lg font-bold text-red-800 mb-2">Error Loading Issue</h2>
                <p className="text-red-600 font-medium mb-6">{error || "Issue not found"}</p>
                <button onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#064E3B] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#053d2f] transition shadow-md">
                  <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* ── Page Header ── */}
              <div className="bg-[#064E3B] px-4 pt-20 pb-8">
                <div className="mx-auto max-w-4xl">
                  <button onClick={() => navigate(-1)}
                    className="mb-4 inline-flex items-center gap-2 text-emerald-200 hover:text-white transition text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Issues
                  </button>
                  <div className="flex flex-wrap items-start gap-3">
                    <h1 className="flex-1 text-xl font-bold text-white sm:text-2xl">
                      {issue.title || `${issue.category} — ${issue.subIssue}`}
                    </h1>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[issue.status]?.bg || "bg-gray-100"} ${STATUS_CONFIG[issue.status]?.text || "text-gray-700"} ${STATUS_CONFIG[issue.status]?.border || "border-gray-200"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[issue.status]?.dot || "bg-gray-400"}`} />
                      {issue.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-emerald-200">
                    {issue.category && <span>📂 {issue.category}{issue.subIssue ? ` › ${issue.subIssue}` : ""}</span>}
                    {issue.location && <span><MapPin className="w-4 h-4 inline mr-1 -mt-0.5" /> {typeof issue.location === "object" ? Object.values(issue.location).filter(Boolean).join(", ") : issue.location}</span>}
                    {issue.createdAt && (
                      <span><Clock className="w-4 h-4 inline mr-1 -mt-0.5" /> {new Date(issue.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-5">
                {issue.photoURL && (
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-sm cursor-pointer group"
                    onClick={() => setShowImageModal(true)}>
                    <img src={issue.photoURL} alt={issue.title}
                      className="w-full max-h-[480px] object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow"><Search className="w-4 h-4 inline mr-1 -mt-0.5" /> View Full Size</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">Description</h2>
                      <p className="text-gray-700 leading-relaxed">{issue.description || "No description provided."}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          <Folder className="w-4 h-4 text-emerald-600" /> Category
                        </div>
                        <p className="text-sm font-bold text-gray-800">{issue.category}{issue.subIssue ? ` › ${issue.subIssue}` : ""}</p>
                      </div>
                      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          <MapPin className="w-4 h-4 text-blue-600" /> Location
                        </div>
                        <p className="text-sm font-bold text-gray-800 truncate">{typeof issue.location === "object" ? Object.values(issue.location).filter(Boolean).join(", ") : issue.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {issue.locationCoords?.lat && issue.locationCoords?.lon && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400">
                      <Map className="w-5 h-5 inline mr-1 -mt-0.5" /> Live GPS Location
                    </h2>
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 h-[300px]">
                      <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
                        src={`https://maps.google.com/maps?q=${issue.locationCoords.lat},${issue.locationCoords.lon}&z=16&output=embed`} />
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between border-b border-gray-50 pb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Community Engagement</h2>
                    <div className="flex items-center gap-3">
                      <LikeButton issueId={id} likes={issue.likes || []} likesCount={issue.likesCount || 0} />
                      <RetweetButton issueId={id} title={issue.title} />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400">
                      <MessageSquare className="w-4 h-4" /> Discussion
                    </h2>
                    <CommentsSection issueId={id} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* ── Image Lightbox ── */}
      {showImageModal && issue?.photoURL && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}>
          <button onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={issue.photoURL} alt={issue.title} className="max-h-[90vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-4 text-xs text-white/50">Click outside to close</p>
        </div>
      )}
    </div>
  );
}
