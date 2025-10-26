import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";

export default function RetweetButton({ issueId, onRetweet }) {
  const userId = auth.currentUser?.uid || "demo-user";
  const handleRetweet = async () => {
    if (!issueId) return;
    // Retweet logic (appends userId to a retweets array in this issue)
    const ref = doc(db, "issues", issueId);
    await updateDoc(ref, { retweets: arrayUnion(userId) });

    // Optionally, create user's own reference copy here, or update a separate collection.
    onRetweet?.();
    alert("Issue retweeted/shared to your profile/feed!");
  };
  return (
    <button
      type="button"
      onClick={handleRetweet}
      className="px-3 py-1 rounded border border-green-400 bg-green-50 text-green-700 text-sm hover:bg-green-100 ml-2"
    >
      Retweet / Share
    </button>
  );
}
