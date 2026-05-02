import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RetweetButton({ issueId, title }) {
  const userId = auth.currentUser?.uid;
  
  const handleShare = async () => {
    if (!issueId) return;

    // Optional: Log share event in Firestore
    if (userId) {
      const ref = doc(db, "issues", issueId);
      await updateDoc(ref, { shares: arrayUnion(userId) }).catch(() => {});
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "FixMyArea — Issue Report",
          text: `Check out this issue on FixMyArea: ${title || "Community Issue"}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm transition-all hover:border-emerald-200 hover:text-emerald-600"
    >
      <Share2 className="w-4 h-4" strokeWidth={2.5} />
      <span>Share</span>
    </motion.button>
  );
}
