import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://fixmyarea.onrender.com";

export default function EmailForm({ issue, onClose }) {
  const [governmentEmail, setGovernmentEmail] = useState(issue.responsibleEmail || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    // Validation
    if (!governmentEmail || !governmentEmail.includes("@")) {
      setError("Please enter a valid government email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/send-to-government`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          governmentEmail: governmentEmail,
          issueTitle: issue.title,
          issueDescription: issue.description,
          issueCategory: issue.category,
          issueLocation: Object.values(issue.location || {}).join(", "),
          reportedBy: issue.userName || "Anonymous Citizen",
          upvotes: issue.upvotes || 0,
          imageUrl: issue.imageUrl || "",
          issueId: issue.id || ""
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.message || "Failed to send email");
      }
    } catch (err) {
      console.error("Email send error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📧</span>
            <div>
              <h3 className="text-xl font-bold text-white">Send to Government</h3>
              <p className="text-sm text-orange-100">Official issue notification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-bounce-in">
              <span className="text-3xl">✅</span>
              <div>
                <p className="font-semibold text-green-800">Email Sent Successfully!</p>
                <p className="text-sm text-green-600">Government has been notified about this issue.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Issue Preview */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">📋</span>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-lg mb-2">{issue.title}</h4>
                <p className="text-gray-600 text-sm line-clamp-2">{issue.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white rounded-lg p-3 border border-orange-100">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="font-semibold text-gray-800 text-sm">{issue.category}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-100">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {Object.values(issue.location || {}).join(", ") || "Not specified"}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-100">
                <p className="text-xs text-gray-500 mb-1">Reported By</p>
                <p className="font-semibold text-gray-800 text-sm">{issue.userName || "Anonymous"}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-100">
                <p className="text-xs text-gray-500 mb-1">Support</p>
                <p className="font-semibold text-gray-800 text-sm">👍 {issue.upvotes || 0} upvotes</p>
              </div>
            </div>
          </div>

          {/* Government Email Input */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
              <span>🏛️</span>
              <span>Government Email Address</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl px-4 py-3 text-gray-700 transition-all duration-300"
              placeholder="e.g., municipalcorp@gov.in"
              value={governmentEmail}
              onChange={(e) => setGovernmentEmail(e.target.value)}
              disabled={loading || success}
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span>ℹ️</span>
              <span>Email will be sent from fixmyareas@gmail.com with full issue details</span>
            </p>
          </div>

          {/* Email Preview Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <span>📨</span>
              <span>What will be sent:</span>
            </p>
            <ul className="text-sm text-blue-700 space-y-1 ml-6 list-disc">
              <li>Complete issue details with all information</li>
              <li>Community upvote statistics</li>
              <li>Photo evidence (if available)</li>
              <li>Direct link to view issue on portal</li>
              <li>Action required notice for government</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3 justify-end sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 font-semibold text-gray-700 transition-all duration-300 hover:scale-105"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || success || !governmentEmail}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending...</span>
              </>
            ) : success ? (
              <>
                <span>✓</span>
                <span>Sent Successfully</span>
              </>
            ) : (
              <>
                <span>📧</span>
                <span>Send Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
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
