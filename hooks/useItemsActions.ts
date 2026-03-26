import * as Location from 'expo-location';
import { useMapLocation } from './useMapLocations';
import { db, storage } from '@/firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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
      const geocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      console.log('Geocode result:', geocode);
      if (!imgUrl || imgUrl.length === 0) {
        throw new Error('No image URIs provided');
      }

      const batchTimestamp = Date.now();

      const uploadedPhotoUrls = await Promise.all(
        imgUrl.map(async (localUri, index) => {
          const response = await fetch(localUri);
          const blob = await response.blob();

          const fileName =
            localUri.split('/').pop() || `image-${Date.now()}-${index}.jpg`;

          const storagePath = `reportedItems/${posterId}/${batchTimestamp}-${index}-${fileName}`;
          const imgRef = ref(storage, storagePath);

          const contentType = blob.type || 'image/jpeg';
          await uploadBytes(imgRef, blob, {
            contentType: contentType,
          });

          const downloadUrl = await getDownloadURL(imgRef);
          return downloadUrl;
        }),
      );

      console.log('Images uploaded successfully:', uploadedPhotoUrls);
      const docRef = await addDoc(collection(db, 'reportedItems'), {
        location: [lat, lng],
        photos: uploadedPhotoUrls,
        posterId: posterId,
        posterName: posterName,
        posterAvatar: posterAvatar,
        name: itemName,
        description: description,
        category: category,
        createdAt: new Date(),
        buildingName: buildingName || 'Unknown',
        status: 'active',
      });
      console.log('Document written with ID: ', docRef);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  // fetch all items from firestore
  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reportedItems'));
      const items = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name ?? data.description ?? 'No title',
          status: data.status ?? 'active',
          location: data.location ?? [0, 0],
          buildingName: data.buildingName ?? 'Unknown',
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(),

          // user info
          posterId: data.posterId ?? '',
          posterName: data.posterName ?? 'Unknown',
          posterAvatar: data.posterAvatar ?? '',
          photos: data.photos ?? [],
          category: data.category ?? 'Other',
          isActive: data.status === 'active',
        };
      });
      return items;
    } catch (e: any) {
      console.error('Error fetching documents: ', e);
      throw e;
    }
  };
  const getPosterName = async (posterId: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userDoc = querySnapshot.docs.find((user) => user.id === posterId);
      if (userDoc) {
        const userData = userDoc.data();
        return userData.name;
      } else {
        console.warn(`User with ID ${posterId} not found.`);
        return 'Unknown User';
      }
    } catch (e: any) {
      console.error('Error fetching user documents: ', e);
      throw e;
    }
  };

  return { submitItem, fetchItems, getPosterName };
}
