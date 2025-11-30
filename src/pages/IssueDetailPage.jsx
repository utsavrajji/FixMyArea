import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import EmailForm from "../components/EmailForm";

const STATUS_OPTIONS = [
  "Pending", "Under Review", "Not Important", "Fake", 
  "In Progress", "Resolved", "Rejected"
];

export default function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true); // ✅ NEW: Separate auth loading
  const [updating, setUpdating] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ STEP 1: Check authentication first
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         navigate("/admin");
//       } else {
//         setCurrentUser(user);
//         setAuthLoading(false); // ✅ Auth check complete
//         console.log("✅ Admin authenticated:", user.email);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

  // ✅ STEP 2: Fetch data only after auth is complete
  useEffect(() => {
    // Don't fetch if auth is still loading
    // if (authLoading) return;

    const fetchIssueAndUser = async () => {
      try {
        setLoading(true);
        
        // Fetch issue data
        const issueRef = doc(db, "issues", id);
        const issueSnap = await getDoc(issueRef);
        
        if (issueSnap.exists()) {
          const issueData = { id: issueSnap.id, ...issueSnap.data() };
          setIssue(issueData);

          // Fetch user data if userId exists
          if (issueData.userId) {
            const userRef = doc(db, "users", issueData.userId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              setUserData(userSnap.data());
              console.log("✅ User data fetched:", userSnap.data());
            } else {
              console.log("⚠️ User document not found for userId:", issueData.userId);
            }
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
  }, [id, navigate, authLoading]); // ✅ Depends on authLoading

  const handleStatusUpdate = async (newStatus) => {
    if (!currentUser) {
      alert("You must be logged in to update status");
      return;
    }

    setUpdating(true);
    try {
      const docRef = doc(db, "issues", id);
      await updateDoc(docRef, { 
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: currentUser.email
      });
      setIssue({ ...issue, status: newStatus });
      alert("✅ Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`❌ Failed to update status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ Are you sure you want to DELETE this issue permanently?\n\nThis action CANNOT be undone!")) {
      return;
    }

    setUpdating(true);
    try {
      await deleteDoc(doc(db, "issues", id));
      alert("✅ Issue deleted successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Error deleting issue:", err);
      alert(`❌ Failed to delete: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Under Review": "bg-purple-100 text-purple-800 border-purple-200",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
      Resolved: "bg-green-100 text-green-800 border-green-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
      Fake: "bg-gray-100 text-gray-800 border-gray-200",
      "Not Important": "bg-gray-100 text-gray-600 border-gray-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // ✅ Show loading while auth or data is loading
//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-gray-500 font-medium">
//             {authLoading ? "Authenticating..." : "Loading issue details..."}
//           </p>
//         </div>
//       </div>
//     );
//   }

  if (!issue) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-orange-500 transition-all duration-300 flex items-center gap-2 font-medium text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setShowEmailForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <span>📧</span>
            <span>Send to Government</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100">
          {/* Issue Image */}
          {issue.photoURL && (
            <div 
              className="relative bg-gray-900 cursor-pointer group"
              onClick={() => setShowImageModal(true)}
            >
              <img
                src={issue.photoURL}
                alt={issue.title}
                className="w-full h-auto max-h-[600px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-medium text-gray-700">
                  <span className="text-2xl">🔍</span>
                  <span>Click to View Full Size</span>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Title & Status */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex-1">{issue.title}</h1>
                <span className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm whitespace-nowrap ${getStatusBadgeColor(issue.status)}`}>
                  {issue.status}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">{issue.description}</p>
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>📂</span>
                  <span>Category</span>
                </div>
                <div className="font-semibold text-gray-800">{issue.category}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>🔍</span>
                  <span>Sub Issue</span>
                </div>
                <div className="font-semibold text-gray-800">{issue.subIssue || "Not specified"}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>📍</span>
                  <span>Location</span>
                </div>
                <div className="font-semibold text-gray-800 text-sm">
                  {typeof issue.location === "object" 
                    ? Object.values(issue.location).filter(Boolean).join(", ") 
                    : (issue.location || "Not specified")}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>👍</span>
                  <span>Community Support</span>
                </div>
                <div className="font-semibold text-gray-800">{issue.upvotes || 0} upvotes</div>
              </div>
            </div>

            {/* User Details Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">👤</span>
                <h3 className="text-xl font-bold text-gray-800">Reporter Information</h3>
              </div>
              
              {userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Name */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Full Name</div>
                      <div className="font-semibold text-gray-800">
                        {userData.displayName || userData.name || "Anonymous User"}
                      </div>
                    </div>
                  </div>

                  {/* User Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">📧</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-gray-500 mb-1">Email Address</div>
                      <div className="font-semibold text-gray-800 break-all text-sm">
                        {userData.email || "Not provided"}
                      </div>
                    </div>
                  </div>

                  {/* User Phone */}
                  {userData.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">📱</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Phone Number</div>
                        <div className="font-semibold text-gray-800">{userData.phone}</div>
                      </div>
                    </div>
                  )}

                  {/* User ID */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🆔</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-gray-500 mb-1">User ID</div>
                      <div className="font-mono text-xs text-gray-600 break-all">
                        {issue.userId}
                      </div>
                    </div>
                  </div>

                  {/* Reporting Time */}
                  <div className="md:col-span-2 pt-4 border-t border-indigo-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🕒</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Reported On</div>
                        <div className="font-semibold text-gray-800">
                          {issue.createdAt 
                            ? new Date(issue.createdAt.seconds * 1000).toLocaleString("en-IN", {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : "Date not available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>User information not available</p>
                  <p className="text-xs mt-2">User ID: {issue.userId}</p>
                </div>
              )}
            </div>

            {/* Status Update Section */}
            <div className="border-t-2 border-gray-200 pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔄</span>
                <div className="text-sm font-semibold text-gray-700">Update Status:</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s}
                    disabled={updating || issue.status === s}
                    onClick={() => handleStatusUpdate(s)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                      issue.status === s
                        ? "bg-orange-500 text-white shadow-lg cursor-default"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Delete Button */}
              {(issue.status === "Fake" || issue.status === "Not Important") && (
                <div className="pt-4 border-t-2 border-red-100">
                  <button
                    onClick={handleDelete}
                    disabled={updating}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl">🗑️</span>
                    <span className="text-lg">Delete This Issue Permanently</span>
                  </button>
                  <p className="text-xs text-red-600 text-center mt-2">⚠️ This action cannot be undone!</p>
                </div>
              )}
              
              {updating && (
                <div className="mt-3 text-sm text-orange-600 flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Form Modal */}
      {showEmailForm && (
        <EmailForm issue={issue} onClose={() => setShowEmailForm(false)} />
      )}

      {/* Image Lightbox Modal */}
      {showImageModal && issue.photoURL && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-7xl max-h-[90vh] overflow-auto">
            <img
              src={issue.photoURL}
              alt={issue.title}
              className="w-full h-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl text-sm">
            Click outside or press ESC to close
          </div>
        </div>
      )}
    </div>
  );
}
