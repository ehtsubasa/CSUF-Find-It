import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export default function SettingsSection({ userProfile }: { userProfile: any }) {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const colorScheme = useColorScheme() ?? "light";

  const { logOut } = useAuth();

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <View className="px-4 mb-6">
      {/* Logout */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 rounded-xl"
        style={{ backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#fff" }}
      >
        <Pressable onPress={handleLogout}>
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{
                backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#f3f4f6",
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </View>
            <Text className="text-base text-red-500">Logout</Text>
          </View>
        </Pressable>
      </TouchableOpacity>
    </View>
  );
}
