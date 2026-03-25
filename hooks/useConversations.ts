import { db } from "@/firebaseConfig";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    Timestamp,
    where
} from "firebase/firestore";
import { useEffect, useState } from "react";

interface User {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: Timestamp;
  unreadCount: number;
}

export function useConversations(currentUser: any) {
  const [chatUsers, setChatUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentUser.uid),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const users: User[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();

        const otherUserId = data.participants.find(
          (uid: string) => uid !== currentUser.uid,
        );

        if (!otherUserId) continue;

        const userSnap = await getDoc(doc(db, "users", otherUserId));

        if (userSnap.exists()) {
          const userData = userSnap.data();

          users.push({
            uid: otherUserId,
            name: userData.name ?? "",
            email: userData.email ?? "",
            avatarUrl: userData.avatarUrl ?? "",
            lastMessage: data.lastMessage || "",
            timestamp: data.lastUpdated || Timestamp.now(),
            unreadCount: data.unreadCounts?.[currentUser.uid] ?? 0,
          });
        }
      }

      setChatUsers(users);
    });

    return unsubscribe;
  }, [currentUser?.uid]);

  return { chatUsers };
}
