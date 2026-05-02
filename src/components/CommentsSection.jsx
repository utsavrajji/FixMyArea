import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { doc, onSnapshot, arrayUnion, arrayRemove, updateDoc, increment } from "firebase/firestore";
import { MessageCircle, Send, User, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CommentsSection({ issueId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!issueId) return;
    const ref = doc(db, "issues", issueId);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      const rawComments = data?.comments || [];
      // Sort comments by date
      const sorted = [...rawComments].sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setComments(sorted);
    });
    return () => unsub();
  }, [issueId]);

  const hasCommented = user ? comments.some(c => c.userId === user.uid) : false;

  const addComment = async () => {
    if (!user) {
      alert("Please login to comment");
      return;
    }
    if (hasCommented) {
      alert("You have already shared your thoughts on this issue.");
      return;
    }
    const text = comment.trim();
    if (!text || loading) return;

    setLoading(true);
    const ref = doc(db, "issues", issueId);
    const payload = {
      userId: user.uid,
      name: user.displayName || "Anonymous User",
      photoURL: user.photoURL || null,
      text,
      createdAt: new Date(),
    };

    try {
      setComment("");
      await updateDoc(ref, { 
        comments: arrayUnion(payload),
        commentsCount: increment(1)
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentObj) => {
    if (!user || commentObj.userId !== user.uid) return;
    if (!window.confirm("Are you sure you want to delete your comment?")) return;

    setLoading(true);
    const ref = doc(db, "issues", issueId);
    try {
      await updateDoc(ref, {
        comments: arrayRemove(commentObj),
        commentsCount: increment(-1)
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Area / Already Commented Message */}
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl bg-gray-50 p-4 text-center border border-dashed border-gray-200"
          >
            <p className="text-sm text-gray-500">Please login to join the discussion.</p>
          </motion.div>
        ) : hasCommented ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 p-4 border border-emerald-100"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">Your thoughts are shared!</p>
                <p className="text-xs text-emerald-600 font-medium">Thank you for participating in the community discussion.</p>
              </div>
            </div>
            {/* Added Delete Option for User */}
            {comments.find(c => c.userId === user.uid) && (
              <button 
                onClick={() => deleteComment(comments.find(c => c.userId === user.uid))}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                disabled={loading}
              >
                Delete
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              {user?.photoURL ? <img src={user.photoURL} className="h-full w-full rounded-full object-cover" /> : <User className="h-5 w-5" />}
            </div>
            <div className="relative flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a helpful comment..."
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2.5 pr-12 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[46px] max-h-[120px] resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addComment();
                  }
                }}
              />
              <button
                onClick={addComment}
                disabled={!comment.trim() || loading}
                className="absolute right-2 top-1.5 rounded-xl p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 disabled:opacity-30"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {comments.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-10 text-center"
            >
              <MessageCircle className="mx-auto h-10 w-10 text-gray-200 mb-2" />
              <p className="text-sm font-medium text-gray-400">No thoughts shared yet. Be the first!</p>
            </motion.div>
          ) : (
            comments.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group flex gap-3 ${c.userId === user?.uid ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${c.userId === user?.uid ? "bg-emerald-100 text-emerald-600 ring-2 ring-emerald-50" : "bg-gray-100 text-gray-500"}`}>
                  {c.photoURL ? <img src={c.photoURL} className="h-full w-full rounded-full object-cover" /> : <span className="text-xs font-bold">{c.name?.charAt(0) || "?"}</span>}
                </div>
                <div className="flex-1">
                  <div className={`rounded-2xl px-4 py-2.5 transition-colors ${c.userId === user?.uid ? "bg-emerald-50/50 border border-emerald-100" : "bg-gray-50 group-hover:bg-gray-100/80"}`}>
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-xs font-bold text-gray-900">{c.name} {c.userId === user?.uid && <span className="ml-1 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">You</span>}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                           {c.createdAt ? (typeof c.createdAt.toDate === 'function' ? c.createdAt.toDate().toLocaleDateString() : new Date(c.createdAt).toLocaleDateString()) : "Just now"}
                        </span>
                        {c.userId === user?.uid && (
                          <button 
                            onClick={() => deleteComment(c)}
                            className="text-[10px] font-bold text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
