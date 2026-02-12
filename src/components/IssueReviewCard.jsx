import { useState } from "react";
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import StatusDropdown from "./StatusDropdown";
import EmailForm from "./EmailForm";

export default function IssueReviewCard({ issue }) {
  const [showEmail, setShowEmail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleStatusChange = async (val) => {
    const ref = doc(db, "issues", issue.id);
    await updateDoc(ref, { status: val });
    alert("Status updated!");
  };

  return (
    <div className="bg-white border rounded-xl shadow p-4 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-bold text-lg text-gray-900">{issue.title}</h3>
        <span className={`text-xs rounded-full px-3 py-[2px] bg-gray-100 border ${issue.status === "Resolved"
          ? "border-green-400 text-green-700"
          : issue.status === "Pending"
            ? "border-orange-400 text-orange-700"
            : "border-gray-400 text-gray-600"
          }`}>
          {issue.status}
        </span>
      </div>
      <div className="text-sm text-gray-500">{issue.category}</div>
      <div className="text-gray-600 text-sm my-1">{issue.description}</div>
      {issue.photoURL && (
        <img src={issue.photoURL} alt="proof" className="w-48 h-32 object-cover rounded my-1" />
      )}
      <div className="text-xs text-gray-500">{Object.values(issue.location || {}).filter(Boolean).join(", ")}</div>

      <div className="flex items-center gap-3 mt-3">
        <StatusDropdown status={issue.status} setStatus={handleStatusChange} />
        <button onClick={() => setShowEmail(v => !v)} className="px-3 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300">Send Email</button>
        <button onClick={() => setShowEdit(v => !v)} className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 border border-gray-300">Edit</button>
      </div>

      {showEmail && <EmailForm issue={issue} onClose={() => setShowEmail(false)} />}

      {/* Optional edit modal section */}
      {showEdit && (
        <div className="p-3 mt-3 rounded bg-gray-50 border">
          <div className="text-xs text-gray-600 mb-1">Edit fields (coming soon)</div>
        </div>
      )}
    </div>
  );
}
