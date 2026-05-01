import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import IssueCard from "./IssueCard";
import { IssueCardSkeleton } from "./Skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function IssueFeed({ filterLocation, sort = "recent", category = "", variant = "full" }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { state, district, block, village, panchayat, pinCode } = filterLocation;

  useEffect(() => {
    const clean = (value) => (value ?? "").trim();

    const normalizedState = clean(state);
    const normalizedDistrict = clean(district);
    const normalizedBlock = clean(block);
    const normalizedVillage = clean(village);
    const normalizedPanchayat = clean(panchayat);
    const normalizedPin = clean(pinCode);
    const normalizedCategory = clean(category);

    const matches = (source, target, exact = false) => {
      if (!target) return true;
      if (!source) return false;
      const sourceText = source.toString().toLowerCase();
      const targetText = target.toLowerCase();
      return exact ? sourceText === targetText : sourceText.includes(targetText);
    };

    const colRef = collection(db, "issues");
    const clauses = [];

    if (normalizedPin) {
      clauses.push(where("location.pinCode", "==", normalizedPin));
    } else if (normalizedState) {
      clauses.push(where("location.state", "==", normalizedState));
    }

    if (normalizedCategory) clauses.push(where("category", "==", normalizedCategory));

    const baseQuery = clauses.length ? query(colRef, ...clauses) : colRef;

    setLoading(true);
    setError("");

    const unsub = onSnapshot(
      baseQuery,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const filtered = data.filter((issue) => {
          const issueLocation = issue.location || {};
          const stateMatches = matches(issueLocation.state, normalizedState);
          const districtMatches = matches(issueLocation.district, normalizedDistrict);
          const blockMatches = matches(issueLocation.block, normalizedBlock);
          const villageMatches = matches(issueLocation.village, normalizedVillage);
          const panchayatMatches = matches(issueLocation.panchayat, normalizedPanchayat);
          const pinMatches = matches(issueLocation.pinCode, normalizedPin, true);
          return stateMatches && districtMatches && blockMatches && villageMatches && panchayatMatches && pinMatches;
        });
        setIssues(filtered);
        setLoading(false);
      },
      (err) => {
        console.error("IssueFeed snapshot error", err);
        setIssues([]);
        setError("Unable to fetch issues for selected location.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [state, district, block, village, panchayat, pinCode, category]);

  const sortedIssues = useMemo(() => {
    const list = [...issues];
    if (sort === "liked") {
      return list.sort((a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0));
    }

    const timeOf = (timestamp) => {
      if (!timestamp) return 0;
      if (typeof timestamp === "number") return timestamp;
      if (timestamp.toMillis) return timestamp.toMillis();
      if (timestamp.seconds) return timestamp.seconds * 1000;
      return new Date(timestamp).getTime() || 0;
    };

    return list.sort((a, b) => timeOf(b.createdAt) - timeOf(a.createdAt));
  }, [issues, sort]);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {[1, 2, 3].map((i) => (
              <IssueCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-red-200 rounded-2xl bg-red-50 p-6 text-center"
          >
            <p className="text-red-600 font-medium">{error}</p>
          </motion.div>
        ) : !sortedIssues.length ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center"
          >
            <p className="text-gray-500 font-medium">No record found matching your filters.</p>
          </motion.div>
        ) : (
          sortedIssues.map((issue) => (
            <motion.div
              key={issue.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <IssueCard issue={issue} variant={variant} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
