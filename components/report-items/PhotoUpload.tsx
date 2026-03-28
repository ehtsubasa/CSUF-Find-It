import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface PhotoUploadProps {
  photos?: string[];
  from?: string;
  onRemovePhoto?: (index: number) => void;
}

export default function PhotoUpload({
  photos = [],
  from,
  onRemovePhoto,
}: PhotoUploadProps) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const colorScheme = useColorScheme() ?? "light";
  const scrollViewRef = useRef<ScrollView>(null);
  const prevPhotosLength = useRef(photos.length);

  const placeholderBgColor = colorScheme === "dark" ? "#1a1a1a" : "#f9fafb";
  const borderColor = colorScheme === "dark" ? "#2a2a2a" : "#e5e7eb";

  // Scroll to the end ONLY when adding photos (not when removing)
  useEffect(() => {
    if (photos.length > prevPhotosLength.current && scrollViewRef.current) {
      // Only scroll if we're adding photos
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
    prevPhotosLength.current = photos.length;
  }, [photos.length]);

  const handleRemovePhoto = (indexToRemove: number) => {
    // Use callback if provided, otherwise fallback to navigation (for backward compatibility)
    if (onRemovePhoto) {
      onRemovePhoto(indexToRemove);
    } else {
      const updatedPhotos = photos.filter(
        (_, index) => index !== indexToRemove,
      );

      // Navigate back with updated photos array
      router.replace({
        pathname: "/report-item",
        params: from
          ? { from, photos: JSON.stringify(updatedPhotos) }
          : { photos: JSON.stringify(updatedPhotos) },
      });
    }
  };

  const handleAddPhoto = () => {
    router.push({
      pathname: "/camera",
      params: from
        ? {
            from,
            photos: JSON.stringify(photos),
            returnTo: "/report-item",
          }
        : {
            photos: JSON.stringify(photos),
            returnTo: "/report-item",
          },
    });
  };

  const canAddMore = photos.length < 4;

  const AddPhotoButton = ({ label }: { label: string }) => (
    <TouchableOpacity
      className="w-40 h-40 rounded-xl items-center justify-center"
      style={{
        backgroundColor: placeholderBgColor,
        borderWidth: 2,
        borderColor: borderColor,
        borderStyle: "dashed",
      }}
      onPress={handleAddPhoto}
    >
      <Ionicons name="camera-outline" size={28} color={iconColor} />
      <Text className="text-xs mt-1" style={{ color: iconColor }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="px-4 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-bold" style={{ color: textColor }}>
          Item Photos
        </Text>
        {photos.length > 0 && (
          <Text className="text-sm" style={{ color: iconColor }}>
            {photos.length}/4
          </Text>
        )}
      </View>

      {/* Horizontal Scrollable Layout - Only when there are photos */}
      {photos.length > 0 ? (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          scrollEventThrottle={16}
          decelerationRate="fast"
        >
          {/* Show existing photos */}
          {photos.map((photoUri, index) => (
            <View key={index} className="relative mr-4">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/photo-view",
                    params: { uri: photoUri },
                  })
                }
              >
                <Image
                  source={{ uri: photoUri }}
                  className="w-40 h-40 rounded-xl"
                  style={{ resizeMode: "cover" }}
                />
              </TouchableOpacity>
              {/* Remove Photo Button */}
              <TouchableOpacity
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 3,
                }}
                onPress={() => handleRemovePhoto(index)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Photo Button when there are photos */}
          {canAddMore && <AddPhotoButton label="Add More" />}
        </ScrollView>
      ) : (
        /* Add Photo Button when there are NO photos  */
        <View className="py-6">
          <AddPhotoButton label="Add Photo" />
        </View>
      )}

      {/* Help Text */}
      <Text className="text-xs mt-2" style={{ color: iconColor }}>
        {photos.length === 0
          ? "Add up to 4 clear photos to help identify the item"
          : photos.length === 4
            ? "Maximum 4 photos added"
            : `You can add ${4 - photos.length} more photo${4 - photos.length === 1 ? "" : "s"}`}
      </Text>
    </View>
  );
}
