import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function MyIssues() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const statusOptions = ["All", "Pending", "Under Review", "In Progress", "Resolved", "Rejected"];

  // Step 1: Wait for auth to load
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.uid);
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubAuth();
  }, []);

  // Step 2: Fetch issues when user is ready
  useEffect(() => {
    if (authLoading) return; // Wait for auth
    if (!currentUser) {
      setList([]);
      setLoading(false);
      return;
    }

    console.log("Fetching issues for user:", currentUser.uid);
    setLoading(true);

    const q = query(
      collection(db, "issues"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubSnapshot = onSnapshot(
      q,
      (snap) => {
        console.log("Issues fetched:", snap.size);
        const issues = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setList(issues);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching issues:", error);
        setList([]);
        setLoading(false);
      }
    );

    return () => unsubSnapshot();
  }, [currentUser, authLoading]);

  const filteredList = filter === "All" 
    ? list 
    : list.filter((issue) => issue.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Under Review": "bg-purple-100 text-purple-800 border-purple-300",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-300",
      "Resolved": "bg-green-100 text-green-800 border-green-300",
      "Rejected": "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-dashed border-red-300">
        <span className="text-6xl mb-4 block">🔒</span>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Not Logged In</h3>
        <p className="text-gray-600 mb-6">Please log in to view your issues.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          🔑 Login Now
        </button>
      </div>
    );
  }

  // Issues loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  // No issues found
  if (list.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
        <span className="text-6xl mb-4 block">📭</span>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Issues Yet</h3>
        <p className="text-gray-600 mb-6">You haven't reported any issues yet.</p>
        <button
          onClick={() => navigate("/report-issue")}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          📝 Report Your First Issue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              filter === status
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
            {status === "All" && ` (${list.length})`}
            {status !== "All" && ` (${list.filter(i => i.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
            <span className="text-4xl block mb-2">🔍</span>
            <p>No {filter} issues found</p>
          </div>
        ) : (
          filteredList.map((issue) => (
            <div
              key={issue.id}
              onClick={() => navigate(`/issue/${issue.id}`)}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                {issue.photoURL && (
                  <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={issue.photoURL}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 space-y-2">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {issue.title || "Untitled Issue"}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 whitespace-nowrap flex-shrink-0 ${getStatusColor(issue.status || "Pending")}`}>
                      {issue.status || "Pending"}
                    </span>
                  </div>

                  {/* Description */}
                  {issue.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {issue.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    {issue.category && (
                      <div className="flex items-center gap-1">
                        <span>📂</span>
                        <span>{issue.category}</span>
                      </div>
                    )}
                    {issue.location && (
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span className="truncate max-w-[150px]">
                          {typeof issue.location === "object"
                            ? Object.values(issue.location).filter(Boolean).slice(0, 2).join(", ")
                            : issue.location}
                        </span>
                      </div>
                    )}
                    {issue.createdAt && (
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>
                          {new Date(issue.createdAt.seconds * 1000).toLocaleDateString("en-IN", {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>👍</span>
                      <span>{issue.upvotes || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-all duration-300 flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
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

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md animate-pulse">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-32 h-32 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-3">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
