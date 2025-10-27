import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import HistoryCard from "../components/HistoryCard";

export default function ResolvedIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErr("");
      try {
        const q = query(collection(db, "issues"), where("status", "==", "Resolved"));
        const snap = await getDocs(q);
        setIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        setErr(`Unable to load. Please try again. Error: ${e.message}`);
      }
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-3">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-800">Resolved Issues / History</h1>

      {loading && <div className="text-center text-gray-600 py-10">Loading...</div>}
      {!loading && err && <div className="text-center text-red-600 py-8">{err}</div>}
      {!loading && !err && !issues.length && (
        <div className="text-center text-gray-400 py-8">No resolved issues yet.</div>
      )}
      {!loading && !err && !!issues.length && (
        <div className="space-y-6">
          {issues.map(issue => <HistoryCard key={issue.id} issue={issue} />)}
        </div>
      )}
    </div>
  );
}
