import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import RetweetButton from "./RetweetButton";
import { useState } from "react";

export default function IssueCard({ issue }) {
  const [showComments, setShowComments] = useState(false);

  const {
    id, title, category, subIssue, description, photoURL, status, location,
    likes = [], likesCount = 0
  } = issue;

  const pill =
    status === "Resolved"
      ? "bg-green-100 text-green-700"
      : status === "In Progress"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h3 className="font-semibold text-lg text-gray-900">{title || `${category} - ${subIssue}`}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${pill}`}>{status}</span>
      </div>
      {photoURL && (
        <img src={photoURL} alt="issue" className="w-40 h-28 object-cover rounded my-1" />
      )}
      <p className="text-sm text-gray-600 mb-1">{description}</p>

      <div className="flex items-center gap-2 text-xs mb-2 text-gray-500">
        <div>
          {[
            location?.village,
            location?.block,
            location?.district,
            location?.state,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm mt-1">
        <LikeButton issueId={id} likes={likes} likesCount={likesCount} />
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="px-3 py-1 rounded border border-blue-400 bg-blue-50 text-blue-700 text-sm hover:bg-blue-100"
        >
          {showComments ? "Hide" : "Show"} Comments
        </button>
        <RetweetButton issueId={id} />
      </div>
      {showComments && <CommentsSection issueId={id} />}
    </div>
  );
}
