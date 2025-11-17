import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import LikeButton from "../components/LikeButton";
import CommentsSection from "../components/CommentsSection";
import RetweetButton from "../components/RetweetButton";
import Footer from "../components/Footer";

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("Fetching issue with ID:", id);
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const docRef = doc(db, "issues", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setIssue({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Issue not found");
        }
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
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eefcf5] via-[#f6fff9] to-white">
        <Navbar />
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-3 pb-16 pt-24 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-28 lg:px-10 lg:pt-32">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eefcf5] via-[#f6fff9] to-white">
        <Navbar />
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-3 pb-16 pt-24 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-28 lg:px-10 lg:pt-32">
          <div className="border border-red-200 rounded-lg bg-red-50 p-4 text-red-600">
            {error || "Issue not found"}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex w-fit items-center justify-center rounded-full bg-gradient-to-r from-govBlue to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    category,
    subIssue,
    description,
    photoURL,
    status,
    location,
    likes = [],
    likesCount = 0,
  } = issue;

  const pill =
    status === "Resolved"
      ? "bg-green-100 text-green-700"
      : status === "In Progress"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eefcf5] via-[#f6fff9] to-white">
        <Navbar />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-10 hidden h-72 w-72 rounded-[42px] border border-dashed border-[#a3e4c1]/70 bg-[#e7fff0]/60 backdrop-blur-md animate-pulse-soft md:block" />
          <div className="absolute top-32 right-20 hidden h-56 w-56 rounded-full bg-[#dff8eb]/90 blur-2xl lg:block animate-float-rev" />
          <div className="absolute bottom-12 left-1/4 hidden h-64 w-64 rounded-[36px] bg-white/60 shadow-soft-hero xl:block animate-float-slow" />
        </div>

        <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-3 pb-16 pt-24 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-28 lg:px-10 lg:pt-32">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex w-fit items-center gap-2 text-govBlue hover:text-blue-700 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="space-y-6 rounded-[28px] border border-[#a3e4c1]/60 bg-gradient-to-br from-white/95 via-white/80 to-[#dff8eb]/90 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="font-bold text-2xl text-gray-900">{title || `${category} - ${subIssue}`}</h1>
            <span className={`text-sm px-3 py-1 rounded-full ${pill}`}>{status}</span>
          </div>

          {photoURL && (
            <img 
              src={photoURL} 
              alt="issue" 
              className="w-full max-w-2xl h-auto object-cover rounded-lg shadow-lg" 
            />
          )}

          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-lg text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>

            <div>
              <h2 className="font-semibold text-lg text-gray-900 mb-2">Location</h2>
              <div className="text-gray-700">
                {[
                  location?.village,
                  location?.block,
                  location?.district,
                  location?.state,
                ]
                  .filter(Boolean)
                  .join(", ")}
                {location?.pinCode && ` - ${location.pinCode}`}
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg text-gray-900 mb-2">Category</h2>
              <p className="text-gray-700">{category} {subIssue && `- ${subIssue}`}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <LikeButton issueId={id} likes={likes} likesCount={likesCount} />
            <RetweetButton issueId={id} />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <CommentsSection issueId={id} />
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </>
  );
}
