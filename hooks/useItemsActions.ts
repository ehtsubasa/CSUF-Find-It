import { db } from "@/firebaseConfig";
import * as Location from "expo-location";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useMapLocation } from "./useMapLocations";

export function useItemsActions() {
  const { location, getBuildingName } = useMapLocation();
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
      //   const response = await fetch(imgUrl[0]);
      //   const blob = await response.blob();
      //   const storageRef = ref(
      //     storage,
      //     imgUrl[0].split('/').slice(-1)[0], // Use the filename from the URL
      //   );
      //   await uploadBytes(storageRef, blob);
      //   const downloadURL = await getDownloadURL(storageRef);
      const downloadURL = imgUrl[0]; // temp replacement
      const geocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      console.log("Geocode result:", geocode);
      const docRef = await addDoc(collection(db, "reportedItems"), {
        location: [lat, lng],
        photos: [downloadURL],
        posterId: posterId,
        posterName: posterName,
        posterAvatar: posterAvatar,
        name: itemName,
        description: description,
        category: category,
        createdAt: new Date(),
        buildingName: buildingName || "Unknown",
        status: "active",
      });
      console.log("Document written with ID: ", docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // fetch all items from firestore
  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reportedItems"));
      const items = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name ?? data.description ?? "No title",
          status: data.status ?? "active",
          location: data.location ?? [0, 0],
          buildingName: data.buildingName ?? "Unknown",
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(),

          // user info
          posterId: data.posterId ?? "",
          posterName: data.posterName ?? "Unknown",
          posterAvatar: data.posterAvatar ?? "",
          photos: data.photos ?? [],
          category: data.category ?? "Other",
          isActive: data.status === "active",
        };
      });
      return items;
    } catch (e: any) {
      console.error("Error fetching documents: ", e);
      throw e;
    }
  };

  return { submitItem, fetchItems };
}
