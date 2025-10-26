import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import IssueCard from "./IssueCard";

export default function IssueFeed({ filterLocation, sort = "recent", category = "" }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const { state, district, block, village, panchayat, pinCode } = filterLocation;

  useEffect(() => {
    // base ref
    const colRef = collection(db, "issues");
    const clauses = [];

    // location filters
    if (state) clauses.push(where("location.state", "==", state));
    if (district) clauses.push(where("location.district", "==", district));
    if (block) clauses.push(where("location.block", "==", block));
    if (village) clauses.push(where("location.village", "==", village));
    if (panchayat) clauses.push(where("location.panchayat", "==", panchayat));
    if (pinCode) clauses.push(where("location.pinCode", "==", pinCode));

    // category filter
    if (category) clauses.push(where("category", "==", category));

    // sort
    let sortField = "createdAt";
    let sortDirection = "desc";
    if (sort === "liked") sortField = "likesCount"; // maintain likesCount for indexing/sorting
    // "near" needs geo-query; kept as TODO.

    let q = query(colRef, ...clauses, orderBy(sortField, sortDirection));

    setLoading(true);
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setIssues(data);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [state, district, block, village, panchayat, pinCode, sort, category]);

  if (loading) return <p className="text-gray-600">Loading...</p>;

  if (!issues.length) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 text-gray-600">
        No issues found for selected location.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}
