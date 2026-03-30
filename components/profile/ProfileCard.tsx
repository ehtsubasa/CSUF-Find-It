import { db } from "@/firebaseConfig";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useItemsActions } from "@/hooks/useItemsActions";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function ProfileCard({ userProfile }: { userProfile: any }) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const colorScheme = useColorScheme() ?? "light";
  const [image, setImage] = useState<string | null>(null);
  const { uploadImage } = useItemsActions();

  const cardBgColor = colorScheme === "dark" ? "#1a1a1a" : "#f9fafb";

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setImage(localUri);

      const [avatarUrl] = await uploadImage(
        [localUri],
        userProfile.uid,
        "avatars",
      );

      await updateDoc(doc(db, "users", userProfile.uid), {
        avatarUrl,
      });
    }
  };

  return (
    <View>
      {/* Profile Info */}
      <View className="items-center py-8">
        <View className="relative mb-4">
          <TouchableOpacity
            className="w-24 h-24 rounded-full items-center justify-center"
            style={{ backgroundColor: cardBgColor }}
            onPress={pickImage}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={32}
              color={iconColor}
              className="absolute z-10 opacity-20"
            />
            <Image
              source={{ uri: userProfile?.avatarUrl }}
              style={{ width: 96, height: 96, borderRadius: 48 }}
            />
          </TouchableOpacity>

          {/* Verification Badge */}
          <View
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-500 items-center justify-center"
            style={{
              borderWidth: 3,
              borderColor: "#fff",
            }}
          >
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        </View>

        <Text className="text-xl font-bold mb-1" style={{ color: textColor }}>
          {userProfile?.name}
        </Text>

        <Text className="text-sm" style={{ color: iconColor }}>
          {userProfile?.email}
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="flex-row px-4 gap-3 mb-6">
        {/* Items Found */}
        <View
          className="flex-1 py-4 rounded-2xl items-center"
          style={{ backgroundColor: cardBgColor }}
        >
          <Text
            className="text-3xl font-bold mb-1"
            style={{ color: tintColor }}
          >
            {userProfile?.itemsFoundCount ?? 0}
          </Text>
          <Text className="text-xs font-semibold" style={{ color: iconColor }}>
            ITEMS FOUND
          </Text>
        </View>

        {/* Items Returned */}
        <View
          className="flex-1 py-4 rounded-2xl items-center"
          style={{ backgroundColor: cardBgColor }}
        >
          <Text
            className="text-3xl font-bold mb-1"
            style={{ color: tintColor }}
          >
            {userProfile?.itemsReturnedCount ?? 0}
          </Text>
          <Text className="text-xs font-semibold" style={{ color: iconColor }}>
            ITEMS RETURNED
          </Text>
        </View>
      </View>
    </View>
  );
}
