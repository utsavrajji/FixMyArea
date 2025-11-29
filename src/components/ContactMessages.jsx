import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [updating, setUpdating] = useState(false);

  const statusOptions = ["All", "New", "In Progress", "Resolved", "Closed"];

  useEffect(() => {
    const q = query(
      collection(db, "contactMessages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredMessages = filter === "All" 
    ? messages 
    : messages.filter(msg => msg.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      "New": "bg-blue-100 text-blue-800 border-blue-300",
      "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Resolved": "bg-green-100 text-green-800 border-green-300",
      "Closed": "bg-gray-100 text-gray-800 border-gray-300"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const handleStatusUpdate = async (messageId, newStatus) => {
    setUpdating(true);
    try {
      const msgRef = doc(db, "contactMessages", messageId);
      await updateDoc(msgRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      alert("✅ Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("❌ Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "contactMessages", messageId));
      alert("✅ Message deleted successfully!");
      setSelectedMessage(null);
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("❌ Failed to delete message");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📧</span>
            <span>Contact Messages</span>
          </h2>
          <p className="text-gray-600 mt-1">Manage user inquiries and support requests</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
          {messages.length} Total Messages
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              filter === status
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600"
            }`}
          >
            {status}
            {status === "All" && ` (${messages.length})`}
            {status !== "All" && ` (${messages.filter(m => m.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: messages.length, icon: "📊", color: "from-blue-500 to-blue-600" },
          { label: "New", value: messages.filter(m => m.status === "New").length, icon: "🆕", color: "from-blue-500 to-blue-600" },
          { label: "In Progress", value: messages.filter(m => m.status === "In Progress").length, icon: "⏳", color: "from-yellow-500 to-yellow-600" },
          { label: "Resolved", value: messages.filter(m => m.status === "Resolved").length, icon: "✅", color: "from-green-500 to-green-600" }
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-4 shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs opacity-90">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <span className="text-6xl block mb-4">📭</span>
          <p className="text-gray-500 text-lg">No {filter} messages found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-orange-400 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  📧
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {message.name}
                      </h3>
                      <p className="text-sm text-gray-600">{message.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 whitespace-nowrap ${getStatusColor(message.status || "New")}`}>
                      {message.status || "New"}
                    </span>
                  </div>

                  {/* Subject */}
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600 font-semibold">📌 Subject:</span>
                    <span className="text-gray-800 font-medium">{message.subject}</span>
                  </div>

                  {/* Message Preview */}
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {message.message}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    {message.phone && (
                      <div className="flex items-center gap-1">
                        <span>📱</span>
                        <span>{message.phone}</span>
                      </div>
                    )}
                    {message.createdAt && (
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>
                          {new Date(message.createdAt.seconds * 1000).toLocaleString("en-IN", {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full group-hover:bg-orange-100 transition-all duration-300">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMessage(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    📧
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedMessage.name}</h3>
                    <p className="text-orange-100 text-sm">{selectedMessage.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Update Status:
                </label>
                <div className="flex flex-wrap gap-2">
                  {["New", "In Progress", "Resolved", "Closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedMessage.id, status)}
                      disabled={updating || selectedMessage.status === status}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                        selectedMessage.status === status
                          ? "bg-orange-500 text-white shadow-lg cursor-default"
                          : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 disabled:opacity-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Subject</p>
                  <p className="text-gray-800 font-bold">{selectedMessage.subject}</p>
                </div>

                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <p className="text-sm text-purple-600 font-semibold mb-1">Phone Number</p>
                  <p className="text-gray-800 font-bold">{selectedMessage.phone || "Not provided"}</p>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-600 font-semibold mb-2">Message</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Received On</p>
                  <p className="text-gray-800 font-bold">
                    {selectedMessage.createdAt 
                      ? new Date(selectedMessage.createdAt.seconds * 1000).toLocaleString("en-IN", {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>📧</span>
                  <span>Reply via Email</span>
                </a>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
