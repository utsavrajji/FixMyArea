import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import IssueCard from "./IssueCard";

export default function MyIssues() {
  const userId = auth.currentUser?.uid || "demo-user";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "issues"), where("userId", "==", userId));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [userId]);

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (!list.length) return <p className="text-gray-600">You haven't posted any issues yet.</p>;

  return (
    <div className="space-y-3">
      {list.map((it) => (
        <IssueCard key={it.id} issue={it} />
      ))}
    </div>
  );
}
