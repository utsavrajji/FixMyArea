import { useState, useEffect } from "react";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CommunityVotes({ issueId, initialVotes = 0 }) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(0); // 1 for up, -1 for down, 0 for none
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    setVotes(initialVotes);
  }, [initialVotes]);

  useEffect(() => {
    if (!issueId || !user) return;
    
    const fetchUserVote = async () => {
      try {
        const voteRef = doc(db, "issues", issueId, "userVotes", user.uid);
        const snap = await getDoc(voteRef);
        if (snap.exists()) {
          setUserVote(snap.data().vote || 0);
        }
      } catch (err) {
        console.error("Error fetching user vote:", err);
      }
    };
    
    fetchUserVote();
  }, [issueId, user]);

  const handleVote = async (newVote) => {
    if (!user) {
      alert("Please login to participate in community voting.");
      return;
    }
    if (!issueId || loading) return;

    setLoading(true);
    const issueRef = doc(db, "issues", issueId);
    const voteRef = doc(db, "issues", issueId, "userVotes", user.uid);

    try {
      let voteChange = 0;
      
      if (userVote === newVote) {
        // Remove vote
        voteChange = -newVote;
        await setDoc(voteRef, { vote: 0 }, { merge: true });
        setUserVote(0);
      } else {
        // Change or add vote
        voteChange = newVote - userVote;
        await setDoc(voteRef, { vote: newVote }, { merge: true });
        setUserVote(newVote);
      }

      await updateDoc(issueRef, {
        upvotes: increment(voteChange)
      });
      
      setVotes(prev => prev + voteChange);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-50/50 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(1)}
        className={`p-2 rounded-xl transition-all duration-300 ${
          userVote === 1 
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
            : "text-gray-400 hover:bg-white hover:text-emerald-500 hover:shadow-sm"
        }`}
      >
        <ChevronUp className="w-5 h-5" strokeWidth={3} />
      </motion.button>
      
      <div className="py-2 flex items-center justify-center min-w-[40px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={votes}
            initial={{ opacity: 0, y: userVote === 1 ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: userVote === 1 ? -5 : 5 }}
            className={`text-sm font-black tracking-tight ${
              votes > 0 ? "text-emerald-600" : votes < 0 ? "text-rose-600" : "text-gray-600"
            }`}
          >
            {votes}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ y: 2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(-1)}
        className={`p-2 rounded-xl transition-all duration-300 ${
          userVote === -1 
            ? "bg-rose-500 text-white shadow-lg shadow-rose-200" 
            : "text-gray-400 hover:bg-white hover:text-rose-500 hover:shadow-sm"
        }`}
      >
        <ChevronDown className="w-5 h-5" strokeWidth={3} />
      </motion.button>
    </div>
  );
}
