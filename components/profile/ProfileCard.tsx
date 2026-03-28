import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function ProfileCard() {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const colorScheme = useColorScheme() ?? "light";

  const currentUser = useAuth().user;

  const cardBgColor = colorScheme === "dark" ? "#1a1a1a" : "#f9fafb";
  return (
    <View>
      {/* Profile Info */}
      <View className="items-center py-8">
        <View className="relative mb-4">
          <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
            <Ionicons name="person" size={48} color="#6b7280" />
          </View>

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
          {currentUser?.displayName}
        </Text>

        <Text className="text-sm" style={{ color: iconColor }}>
          {currentUser?.email}
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
            1
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
            2
          </Text>
          <Text className="text-xs font-semibold" style={{ color: iconColor }}>
            ITEMS RETURNED
          </Text>
        </View>
      </View>
    </View>
  );
}
