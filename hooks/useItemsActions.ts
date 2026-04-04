import { DEFAULT_AVATAR } from "@/constants/user";
import { db, storage } from "@/firebaseConfig";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const normalizeStatus = (status?: string) => {
  const normalized = (status ?? "Active").trim().toLowerCase();
  return normalized === "active" ? "Active" : "Returned";
};

const mapReportedItem = (doc: any) => {
  const data = doc.data();
  const status = normalizeStatus(data.status);

  return {
    id: doc.id,
    name: data.name ?? data.description ?? "No title",
    status,
    location: data.location ?? [0, 0],
    buildingName: data.buildingName ?? "Unknown",
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    posterId: data.posterId ?? "",
    posterName: data.posterName ?? "Unknown",
    posterAvatar: data.posterAvatar ?? DEFAULT_AVATAR,
    photos: data.photos ?? [],
    category: data.category ?? "Other",
    isActive: status === "Active",
  };
};

export function useItemsActions() {
  const submitItem = async (
    lat: number,
    lng: number,
    imgUrl: string[],
    posterId: string,
    posterName: string,
    posterAvatar: string,
    itemName: string,
    description: string,
    category: string,
    buildingName: string,
  ) => {
    try {
      if (!imgUrl || imgUrl.length === 0) {
        throw new Error("No image URIs provided");
      }

      const uploadedPhotoUrls = await uploadImage(
        imgUrl,
        posterId,
        "reportedItems",
      );

      await addDoc(collection(db, "reportedItems"), {
        location: [lat, lng],
        photos: uploadedPhotoUrls,
        posterId: posterId,
        posterName: posterName,
        posterAvatar: posterAvatar,
        name: itemName,
        description: description,
        category: category,
        createdAt: new Date(),
        buildingName: buildingName || "Unknown",
        status: "Active",
      });

      await updateDoc(doc(db, "users", posterId), {
        itemsFoundCount: increment(1),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  // upload images for item posts and profile pictures, returns array of download URLs
  const uploadImage = async (
    imgUrl: string[],
    posterId: string,
    folder: string, // collection name to store images under (e.g. "reportedItems" or "profilePictures")
  ) => {
    const batchTimestamp = Date.now();
    return Promise.all(
      imgUrl.map(async (localUri, index) => {
        const response = await fetch(localUri);
        const blob = await response.blob();

        const fileName =
          localUri.split("/").pop() || `image-${Date.now()}-${index}.jpg`;

        const storagePath = `${folder}/${posterId}/${batchTimestamp}-${index}-${fileName}`;
        const imgRef = ref(storage, storagePath);

        const contentType = blob.type || "image/jpeg";
        await uploadBytes(imgRef, blob, {
          contentType: contentType,
        });

        const downloadUrl = await getDownloadURL(imgRef);
        return downloadUrl;
      }),
    );
  };

  // fetch all items from firestore for map display
  const getAllItems = async () => {
    try {
      // only fetch items that are still active
      const q = query(
        collection(db, "reportedItems"),
        where("status", "==", "Active"),
      );

      const querySnapshot = await getDocs(q);

      const items = querySnapshot.docs.map(mapReportedItem);
      return items;
    } catch (e: any) {
      console.error("Error fetching documents: ", e);
      throw e;
    }
  };

  const getUserItems = async (userId: string) => {
    try {
      const q = query(
        collection(db, "reportedItems"),
        where("posterId", "==", userId),
      );

      const querySnapshot = await getDocs(q);

      const items = querySnapshot.docs.map(mapReportedItem);
      return items;
    } catch (e: any) {
      console.error("Error fetching user items: ", e);
      throw e;
    }
  };

  const deletePost = async (id: string, posterId: string) => {
    try {
      const docRef = doc(db, "reportedItems", id);
      await deleteDoc(docRef);
      await updateDoc(doc(db, "users", posterId), {
        itemsFoundCount: increment(-1),
        itemsActiveCount: increment(-1),
      });
    } catch (e) {
      console.error("Error deleting document: ", e);
      throw e;
    }
  };

  const markAsReturned = async (id: string, posterId: string) => {
    try {
      const docRef = doc(db, "reportedItems", id);

      await updateDoc(docRef, {
        status: "Returned",
      });

      // increment the itemsReturnedCount for the poster
      await updateDoc(doc(db, "users", posterId), {
        itemsReturnedCount: increment(1),
        itemsActiveCount: increment(-1),
      });
    } catch (e) {
      console.error("Error marking document as returned: ", e);
      throw e;
    }
  };

  const toggleBookmark = async (
    userId: string,
    itemId: string,
    isSaved: boolean,
  ) => {
    try {
      if (!userId) {
        console.error("User ID is required to toggle bookmark");
        return;
      }
      const userRef = doc(db, "users", userId);

      if (isSaved) {
        // If already saved, remove from savedItems
        await updateDoc(userRef, {
          savedItems: arrayRemove(itemId),
        });
      } else {
        // If not saved, add to savedItems
        await updateDoc(userRef, {
          savedItems: arrayUnion(itemId),
        });
      }
    } catch (e) {
      console.error("Error saving bookmark: ", e);
    }
  };

  const getBookmarkedItems = async (userId?: string) => {
    if (!userId) return [];

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return [];
      }

      const userData = userSnap.data();
      const savedItemIds = userData.savedItems || [];

      if (savedItemIds.length === 0) return [];

      // fetch each bookmarked item by its ID and return the data as an array
      const items = await Promise.all(
        savedItemIds.map(async (id: string) => {
          const itemSnap = await getDoc(doc(db, "reportedItems", id));
          if (itemSnap.exists()) {
            return mapReportedItem(itemSnap);
          }
          return null;
        }),
      );

      // return only items that still exist (filter out nulls for deleted items)
      return items.filter(Boolean);
    } catch (e) {
      console.error("Error fetching bookmarked items: ", e);
      return [];
    }
  };

  return {
    submitItem,
    getAllItems,
    getUserItems,
    deletePost,
    markAsReturned,
    toggleBookmark,
    getBookmarkedItems,
    uploadImage,
  };
}
