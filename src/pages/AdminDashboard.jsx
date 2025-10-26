import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import IssueReviewCard from "../components/IssueReviewCard";
import Analytics from "../components/Analytics";
import { useNavigate } from "react-router-dom";

const STATUS = [
  "All", "Pending", "Under Review", "Not Important", "Fake", "In Progress", "Resolved", "Rejected"
];
const CATEGORIES = [
  "All","Road & Infrastructure","Garbage & Cleanliness","Water Supply","Electricity",
  "Environment & Parks","Traffic & Transport","Safety & Security","Public Buildings & Facilities",
  "Housing Area Problems","Accessibility for Disabled","Drainage & Sewage","Public Utilities",
  "Emergency / Urgent Issues","Community & Social Issues","Government Services",
];

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Pending");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  // Admin gate: always in useEffect
  useEffect(() => {
    if (sessionStorage.getItem("admin") !== "true") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      let q = collection(db, "issues");
      let qArr = [];
      if (status && status !== "All") qArr.push(where("status", "==", status));
      if (category && category !== "All") qArr.push(where("category", "==", category));
      let qFinal = qArr.length ? query(q, ...qArr) : q;
      const snap = await getDocs(qFinal);
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (search.trim()) {
        data = data.filter(
          i =>
            i.title?.toLowerCase().includes(search.toLowerCase()) ||
            i.description?.toLowerCase().includes(search.toLowerCase())
        );
      }
      setIssues(data);
      setLoading(false);
    };
    fetchIssues();
  }, [category, status, search]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 p-6 bg-white shadow-sm border-r min-h-screen flex flex-col gap-4">
        <div className="font-bold text-lg text-orange-800">Admin Menu</div>
        {STATUS.map(s => (
          <button
            key={s}
            className={`text-left w-full px-3 py-2 rounded transition font-medium ${
              status === s ? "bg-orange-100 text-orange-800" : "hover:bg-gray-50 text-gray-700"
            }`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
        <button
          className="mt-8 text-left w-full px-3 py-2 bg-gray-200 rounded font-medium"
          onClick={() => setSelected("analytics")}
        >
          📊 Analytics
        </button>
        <button
          className="mt-24 text-xs text-gray-600 hover:text-orange-600 underline"
          onClick={() => { sessionStorage.removeItem("admin"); navigate("/admin"); }}
        >
          Logout Admin
        </button>
      </aside>

      {/* Main Body */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center gap-3 mb-5">
          <input
            placeholder="Search issues, description"
            className="border px-3 py-2 rounded w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c === "All" ? "" : c}>{c}</option>
            ))}
          </select>
        </div>

        {selected === "analytics" ? (
          <Analytics />
        ) : loading ? (
          <div className="text-gray-500">Loading issues...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issues.map(issue => (
              <IssueReviewCard key={issue.id} issue={issue} />
            ))}
            {!issues.length && <div className="text-gray-400">No issues found.</div>}
          </div>
        )}
      </main>
    </div>
  );
}
