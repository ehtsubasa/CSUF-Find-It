import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ActivitySection({ userProfile }: { userProfile: any }) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const colorScheme = useColorScheme() ?? "light";

  return (
    <View className="px-4 mb-6">
      <Text
        className="text-xs font-semibold mb-3 tracking-wider"
        style={{ color: iconColor }}
      >
        ACTIVITY
      </Text>

      {/* My Posts */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 mb-2 rounded-xl"
        style={{ backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#fff" }}
        onPress={() =>
          router.push({
            pathname: "/list",
            params: { returnTo: "/profile" },
          })
        }
      >
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{
              backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#f3f4f6",
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={textColor}
            />
          </View>
          <Text className="text-base" style={{ color: textColor }}>
            My Posts
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Ionicons name="chevron-forward" size={20} color={iconColor} />
        </View>
      </TouchableOpacity>

      {/* Saved Items */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 rounded-xl"
        style={{ backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#fff" }}
        onPress={() => router.push("/saved-items")}
      >
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{
              backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#f3f4f6",
            }}
          >
            <Ionicons name="bookmark-outline" size={20} color={textColor} />
          </View>
          <Text className="text-base" style={{ color: textColor }}>
            Saved Items
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}
