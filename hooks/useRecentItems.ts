import { db } from "@/firebaseConfig";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface RecentItem {
  id: string;
  name: string;
  buildingName: string;
  createdAt: Date;
  photos: string[];
  category: string;
  posterId: string;
  posterName: string;
  posterAvatar: string;
}

export function useRecentItems(count: number = 5) {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "reportedItems"),
      orderBy("createdAt", "desc"),
      limit(count),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name ?? "Unknown",
          buildingName: data.buildingName ?? "Unknown",
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          photos: data.photos ?? [],
          posterId: data.posterId ?? "",
          posterName: data.posterName ?? "Unknown",
          posterAvatar: data.posterAvatar ?? "",
          category: data.category ?? "",
        };
      });
      setItems(fetched);
      setLoading(false);
    });

    return unsubscribe;
  }, [count]);

  return { items, loading };
}
