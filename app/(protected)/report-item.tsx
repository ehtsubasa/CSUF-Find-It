import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

import ItemDetailsForm from "@/components/report-items/ItemDetailsForm";
import LocationSection from "@/components/report-items/LocationSection";
import PhotoUpload from "@/components/report-items/PhotoUpload";
import SubmitButton from "@/components/report-items/SubmitButton";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useItemsActions } from "@/hooks/useItemsActions";
import { useMapLocation } from "@/hooks/useMapLocations";

export default function ReportItemScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { submitItem } = useItemsActions();
  const { location, handleUserLocation, errorMsg, getBuildingName } =
    useMapLocation();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [itemName, setItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [loadingBuilding, setLoadingBuilding] = useState(false);
  const [isUserEdited, setIsUserEdited] = useState(false);
  useEffect(() => {
    handleUserLocation();
  }, []);

  useEffect(() => {
    if (location) {
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location]);

  useEffect(() => {
    const fetchBuilding = async () => {
      if (!userLocation) return;

      setLoadingBuilding(true);

      try {
        const name = await getBuildingName(
          userLocation.latitude,
          userLocation.longitude,
        );
        if (name && !isUserEdited) {
          setBuildingName(name);
        }
      } catch (e) {
        console.log("Failed to get building");
      }

      setLoadingBuilding(false);
    };

    fetchBuilding();
  }, [userLocation]);

  // Get params from navigation
  const params = useLocalSearchParams<{
    from?: string | string[];
    photos?: string | string[];
  }>();

  // Parse 'from' param
  const fromParam = Array.isArray(params.from) ? params.from[0] : params.from;

  // Parse 'photos' param - it comes as a JSON string
  let photosParam: string[] = [];
  if (params.photos) {
    const photosValue = Array.isArray(params.photos)
      ? params.photos[0]
      : params.photos;
    if (typeof photosValue === "string") {
      try {
        photosParam = JSON.parse(photosValue);
      } catch {
        // If not valid JSON, treat as single photo URI
        photosParam = [photosValue];
      }
    }
  }

  // Manage photos locally to avoid navigation on removal
  const [localPhotos, setLocalPhotos] = useState<string[]>(photosParam);

  // Update local photos when params change (when returning from camera)
  useEffect(() => {
    setLocalPhotos(photosParam);
  }, [params.photos]);

  // Handle photo removal without navigation
  const handleRemovePhoto = (index: number) => {
    setLocalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!userLocation) {
      alert("Please enable location to report an item");
      return;
    }

    if (!itemName.trim()) {
      alert("Please enter an item name");
      return;
    }

    submitItem(
      userLocation.latitude,
      userLocation.longitude,
      localPhotos,
      user?.uid || "posterId-placeholder",
      user?.displayName || "posterName-placeholder",
      user?.photoURL || "posterAvatar-placeholder",
      itemName.trim(),
      description,
      selectedCategory,
      buildingName || "Unknown Location",
    );

    alert("Item reported successfully!");
    router.push("/(protected)/(tabs)/map");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor }}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Item Location */}
        <LocationSection
          isLoading={loadingBuilding}
          buildingName={buildingName}
          setBuildingName={setBuildingName}
          onEditPress={() => setBuildingName("")}
          setIsUserEdited={setIsUserEdited}
        />

        {/* Item Details (Category + Description) */}
        <ItemDetailsForm
          itemName={itemName}
          setItemName={setItemName}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          description={description}
          setDescription={setDescription}
        />

        {/* Photo Upload - Pass photos array and removal handler */}
        <PhotoUpload
          photos={localPhotos}
          from={fromParam}
          onRemovePhoto={handleRemovePhoto}
        />

        {/* Submit Button */}
        <SubmitButton onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
