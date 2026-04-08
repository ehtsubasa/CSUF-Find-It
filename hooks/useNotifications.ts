import { db } from "@/firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export function useNotifications(currentUser: any) {
  const [lastSeenAt, setLastSeenAt] = useState<Date | null>(null);
  const [newItemsCount, setNewItemsCount] = useState(0);
  const [claimedPostsCount, setClaimedPostsCount] = useState(0);

  // Watch lastSeenAt from user doc in real-time so all hook instances stay in sync
  useEffect(() => {
    if (!currentUser?.uid) return;
    const userRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      const data = snap.data();
      if (data?.lastSeenAt) {
        setLastSeenAt(data.lastSeenAt.toDate());
      } else {
        // First-time user — initialise lastSeenAt so no stale notifications appear
        setDoc(
          userRef,
          { lastSeenAt: Timestamp.fromDate(new Date()) },
          { merge: true },
        );
      }
    });
    return unsubscribe;
  }, [currentUser?.uid]);

  // Count items posted by other users since lastSeenAt
  useEffect(() => {
    if (!currentUser?.uid || !lastSeenAt) return;
    const q = query(
      collection(db, "reportedItems"),
      where("createdAt", ">", Timestamp.fromDate(lastSeenAt)),
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setNewItemsCount(
        snap.docs.filter((d) => d.data().posterId !== currentUser.uid).length,
      );
    });
    return unsubscribe;
  }, [currentUser?.uid, lastSeenAt]);

  // Count user's posts that were claimed since lastSeenAt
  useEffect(() => {
    if (!currentUser?.uid || !lastSeenAt) return;
    const q = query(
      collection(db, "reportedItems"),
      where("posterId", "==", currentUser.uid),
      where("status", "==", "Returned"),
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setClaimedPostsCount(
        snap.docs.filter((d) => {
          const claimedAt = d.data().claimedAt?.toDate?.();
          return claimedAt && claimedAt > lastSeenAt!;
        }).length,
      );
    });
    return unsubscribe;
  }, [currentUser?.uid, lastSeenAt]);

  // Call when the user opens the notification dropdown — resets all counts
  const markAllSeen = async () => {
    if (!currentUser?.uid) return;
    await setDoc(
      doc(db, "users", currentUser.uid),
      { lastSeenAt: Timestamp.fromDate(new Date()) },
      { merge: true },
    );
    // State updates via the onSnapshot listener above
  };

  return {
    lastSeenAt,
    newItemsCount,
    claimedPostsCount,
    hasNotifications: newItemsCount > 0 || claimedPostsCount > 0,
    markAllSeen,
  };
}
