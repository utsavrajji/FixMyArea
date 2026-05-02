import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import RetweetButton from "./RetweetButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, MessageCircle, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IssueCard({ issue, variant = "full" }) {
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();

  const {
    id, title, category, subIssue, description, photoURL, status, location,
    likes: likesArray = [], likesCount = 0, upvotes = 0, commentsCount = 0
  } = issue;

  const [likes, setLikes] = useState(likesCount);
  const [votes, setVotes] = useState(upvotes);
  const [comments, setComments] = useState(commentsCount);

  // Sync with real-time updates from props
  useEffect(() => {
    setLikes(issue.likesCount || 0);
    setVotes(issue.upvotes || 0);
    setComments(issue.commentsCount || 0);
  }, [issue.likesCount, issue.upvotes, issue.commentsCount]);

  const getStatusStyles = (s) => {
    switch (s) {
      case "Resolved": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "In Progress": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  const formattedLocation = [
    location?.village,
    location?.block,
    location?.district,
  ].filter(Boolean).join(", ");

  const handleClick = () => {
    if (variant === "summary" || variant === "full") {
      navigate(`/issue/${id}`);
    }
  };

  if (variant === "summary") {
    return (
      <motion.div 
        whileHover={{ y: -4 }}
        onClick={handleClick}
        className="group relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-4 flex gap-5 cursor-pointer shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300"
      >
        {photoURL ? (
          <div className="relative w-32 h-32 shrink-0 overflow-hidden rounded-2xl bg-gray-50">
            <img src={photoURL} alt="issue" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        ) : (
          <div className="w-32 h-32 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-200">
            <MapPin size={32} />
          </div>
        )}
        <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusStyles(status)}`}>
              {status}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{category}</span>
          </div>
          <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
            {title || `${category} - ${subIssue}`}
          </h3>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <ChevronUp className="w-3 h-3" strokeWidth={3} />
              <span>{votes}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
              <Heart className="w-3 h-3 fill-rose-500" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              <MessageCircle className="w-3 h-3 fill-emerald-500" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[80px]">{formattedLocation}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusStyles(status)}`}>
              {status}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{category}</span>
          </div>
          <h3 className="font-black text-xl text-gray-900 leading-tight">
            {title || `${category} - ${subIssue}`}
          </h3>
        </div>
        <button onClick={handleClick} className="text-emerald-600 font-bold text-sm hover:underline">View Detail</button>
      </div>

      {photoURL && (
        <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[16/9]">
          <img src={photoURL} alt="issue" className="w-full h-full object-cover" />
        </div>
      )}

      <p className="text-gray-600 leading-relaxed text-[15px]">{description}</p>

      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
        <span>{formattedLocation}</span>
      </div>

      <div className="mt-2 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LikeButton issueId={id} likes={issue.likes || []} likesCount={likes} />
          <RetweetButton issueId={id} title={title} />
        </div>
        
        <button
          onClick={() => setShowComments((v) => !v)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
            showComments 
              ? "bg-emerald-600 text-white shadow-emerald-200" 
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{showComments ? "Hide" : "Comments"}</span>
          {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-gray-50 mt-4">
              <CommentsSection issueId={id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
