import { useState, useEffect } from "react";
import { updateDoc, doc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function LikeButton({ issueId, likes = [], likesCount = 0 }) {
  const user = auth.currentUser;
  const userId = user?.uid;
  
  // Local state to manage likes and count for immediate feedback
  const [state, setState] = useState({ 
    likes: Array.isArray(likes) ? likes : [], 
    count: likesCount || 0, 
    loading: false 
  });

  // Sync state if props change (though we rely on local state for speed)
  useEffect(() => {
    setState(prev => ({
      ...prev,
      likes: Array.isArray(likes) ? likes : [],
      count: likesCount || 0
    }));
  }, [likes, likesCount]);

  const isLiked = userId ? state.likes.includes(userId) : false;

  const handleLike = async () => {
    if (!userId) {
      alert("Please login to support this issue.");
      return;
    }
    // Prevent action if not logged in or loading
    if (!issueId || state.loading) return;

    const isCurrentlyLiked = state.likes.includes(userId);
    const newLikes = isCurrentlyLiked 
      ? state.likes.filter(id => id !== userId)
      : [...state.likes, userId];
    const newCount = isCurrentlyLiked ? state.count - 1 : state.count + 1;

    setState((prev) => ({ 
      ...prev,
      likes: newLikes,
      count: newCount,
      loading: true 
    }));

    const ref = doc(db, "issues", issueId);
    try {
      await updateDoc(ref, {
        likes: isCurrentlyLiked ? arrayRemove(userId) : arrayUnion(userId),
        likesCount: increment(isCurrentlyLiked ? -1 : 1),
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      // Rollback on error
      setState((prev) => ({
        ...prev,
        likes: state.likes,
        count: state.count,
        loading: false
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <motion.button
      whileTap={!isLiked ? { scale: 0.9 } : {}}
      onClick={handleLike}
      disabled={state.loading}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all border ${
        isLiked 
          ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200" 
          : "bg-white border-gray-100 text-gray-500 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50/30"
      }`}
    >
      <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} strokeWidth={isLiked ? 2 : 2.5} />
      <span>{state.count}</span>
    </motion.button>
  );
}
