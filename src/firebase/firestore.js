// Firestore Helper Functions for FixMyArea

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// Create new issue
export const createIssue = async (issueData) => {
  try {
    const docRef = await addDoc(collection(db, "issues"), {
      ...issueData,
      createdAt: serverTimestamp(),
      likes: 0,
      comments: [],
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding issue:", error);
    throw error;
  }
};

// Get all issues within area (filter by city or district)
export const fetchIssuesByLocation = async (criteria = {}) => {
  try {
    const ref = collection(db, "issues");
    let q = ref;

    if (criteria.city) q = query(ref, where("city", "==", criteria.city));
    if (criteria.district) q = query(ref, where("district", "==", criteria.district));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

// Get issues created by current user
export const fetchUserIssues = async (userId) => {
  try {
    const ref = collection(db, "issues");
    const q = query(ref, where("createdBy", "==", userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error loading user issues:", error);
    return [];
  }
};

// Update issue status (Admin or user verified)
export const updateIssueStatus = async (id, status) => {
  try {
    const issueRef = doc(db, "issues", id);
    await updateDoc(issueRef, { status });
  } catch (error) {
    console.error("Error updating issue status:", error);
    throw error;
  }
};

// Like / Upvote Handler
export const incrementLike = async (issueId, currentLikes) => {
  const docRef = doc(db, "issues", issueId);
  await updateDoc(docRef, { likes: currentLikes + 1 });
};

// Add comment to issue
export const addCommentToIssue = async (issueId, comment) => {
  try {
    const issueRef = doc(db, "issues", issueId);
    const snapshot = await getDoc(issueRef);
    const existingComments = snapshot.data().comments || [];
    await updateDoc(issueRef, {
      comments: [...existingComments, comment],
    });
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

// Delete issue (optional feature)
export const deleteIssue = async (id) => {
  try {
    await deleteDoc(doc(db, "issues", id));
  } catch (error) {
    console.error("Error deleting issue:", error);
  }
};
