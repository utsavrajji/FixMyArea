import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { doc, updateDoc, onSnapshot, arrayUnion, serverTimestamp } from "firebase/firestore";

export default function CommentsSection({ issueId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  const name = user?.displayName || "Anonymous";

  useEffect(() => {
    if (!issueId) return;
    const ref = doc(db, "issues", issueId);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      setComments(data?.comments || []);
    });
    return () => unsub();
  }, [issueId]);

  const addComment = async () => {
    const text = comment.trim();
    if (!text) return;
    setLoading(true);
    const ref = doc(db, "issues", issueId);
    const payload = {
      userId: user?.uid || "demo-user",
      name,
      text,
      createdAt: serverTimestamp(),
    };
    try {
      setComment("");
      await updateDoc(ref, { comments: arrayUnion(payload) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="font-semibold mb-1 text-gray-900">Comments</div>
      <div className="space-y-2 text-[15px] mb-3">
        {comments.length === 0 && <div className="text-xs text-gray-400">No comments yet.</div>}
        {comments
          .slice()
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
          .map((c, i) => (
            <div key={i} className="p-2 rounded bg-gray-50 border flex flex-col">
              <div className="flex items-center text-xs gap-2 mb-1 text-gray-600">
                <span className="font-medium">{c.name || "User"}</span>
                <span>
                  {c.createdAt?.seconds
                    ? new Date(c.createdAt.seconds * 1000).toLocaleString()
                    : ""}
                </span>
              </div>
              <div>{c.text}</div>
            </div>
          ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded p-2 flex-1 text-sm"
          placeholder="Add a comment..."
        />
        <button
          onClick={addComment}
          disabled={loading}
          className="px-3 py-[6px] rounded bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700"
        >
          Comment
        </button>
      </div>
    </div>
  );
}
