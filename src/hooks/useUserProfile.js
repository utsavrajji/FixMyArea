import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

export default function useUserProfile() {
  const [user, setUser] = useState(auth.currentUser || null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // keep auth state in sync if your app doesn't already
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) { setProfile(null); setLoading(false); return; }
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [user]);

  return { user, profile, loading };
}
