import { useState } from "react";
import { updateDoc, doc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { db, auth } from "../firebase/config";

export default function LikeButton({ issueId, likes = [], likesCount = 0 }) {
  const userId = auth.currentUser?.uid || "demo-user";
  const liked = likes.includes(userId);
  const [state, setState] = useState({ likes, count: likesCount, loading: false });

  const toggleLike = async () => {
    if (!issueId) return;
    setState((prev) => ({ ...prev, loading: true }));
    const ref = doc(db, "issues", issueId);
    try {
      if (liked) {
        setState((prev) => ({
          likes: prev.likes.filter((id) => id !== userId),
          count: prev.count - 1,
          loading: false,
        }));
        await updateDoc(ref, {
          likes: arrayRemove(userId),
          likesCount: increment(-1),
        });
      } else {
        setState((prev) => ({
          likes: [...prev.likes, userId],
          count: prev.count + 1,
          loading: false,
        }));
        await updateDoc(ref, {
          likes: arrayUnion(userId),
          likesCount: increment(1),
        });
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={state.loading}
      className={`px-3 py-1 rounded border text-sm flex items-center border-gray-300 hover:bg-gray-100 ${
        liked ? "text-rose-700 border-rose-400 bg-rose-50" : "text-gray-700"
      }`}
    >
      ❤️ <span className="ml-1">{state.count}</span>
    </button>
  );
}
