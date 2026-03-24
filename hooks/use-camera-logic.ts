import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";

export function useCameraLogic() {
  // State
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Parse params
  const params = useLocalSearchParams<{
    from?: string | string[];
    photos?: string | string[];
    returnTo?: string | string[];
  }>();
  const fromParam = Array.isArray(params.from) ? params.from[0] : params.from;

  // Handle photos - can be string (JSON), string array, or undefined
  let existingPhotos: string[] = [];
  if (params.photos) {
    if (typeof params.photos === "string") {
      try {
        // Try to parse as JSON first
        existingPhotos = JSON.parse(params.photos);
      } catch {
        // If not JSON, treat as single photo URI
        existingPhotos = [params.photos];
      }
    } else if (Array.isArray(params.photos)) {
      existingPhotos = params.photos;
    }
  }

  // Helper: Build navigation params
  const buildParams = (photos: string[]) => {
    const navParams: { from?: string; photos?: string } = {};
    if (fromParam) navParams.from = fromParam;
    if (photos.length > 0) navParams.photos = JSON.stringify(photos);
    return navParams;
  };

  // Toggle camera facing (front/back)
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Take photo with camera
  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        const updatedPhotos = [...existingPhotos, photo.uri].slice(0, 4);
        router.replace({
          pathname: "/report-item",
          params: buildParams(updatedPhotos),
        });
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      alert("Failed to take picture. Please try again.");
    }
  };

  // Pick photo from gallery
  const pickFromGallery = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Sorry, we need gallery permissions to select photos!");
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const updatedPhotos = [...existingPhotos, result.assets[0].uri].slice(
          0,
          4,
        );
        router.replace({
          pathname: "/report-item",
          params: buildParams(updatedPhotos),
        });
      }
    } catch (error) {
      console.error("Error picking from gallery:", error);
      alert("Failed to open gallery. Please try again.");
    }
  };

  // Computed values
  const isMaxPhotos = existingPhotos.length >= 4;
  const photoCount = existingPhotos.length;

  return {
    // State
    facing,
    permission,
    cameraRef,
    existingPhotos,
    photoCount,
    isMaxPhotos,

    // Actions
    toggleCameraFacing,
    takePicture,
    pickFromGallery,
    requestPermission,
  };
}
