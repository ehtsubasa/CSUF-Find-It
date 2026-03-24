import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

interface PostCardProps {
  id: string;
  title: string;
  status: string;
  location: string;
  time: string;
  tabActive: boolean;
}

export default function PostCard({
  title,
  status,
  location,
  time,
  tabActive,
}: PostCardProps) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const colorScheme = useColorScheme() ?? "light";

  return (
    <View
      className="flex-row items-center p-4 mb-3 rounded-2xl"
      style={{
        backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* Placeholder Image */}
      <View
        className="w-20 h-20 rounded-xl items-center justify-center mr-4"
        style={{
          backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#e5e7eb",
        }}
      >
        <Ionicons name="image-outline" size={32} color={iconColor} />
      </View>

      {/* Item Info */}
      <View className="flex-1">
        <Text className="font-bold text-base mb-1" style={{ color: textColor }}>
          {title}
        </Text>
        <Text className="text-xs mb-1" style={{ color: iconColor }}>
          {status}
        </Text>
        <Text className="text-sm" style={{ color: iconColor }}>
          {location} • {time}
        </Text>
      </View>

      {/* Active Indicator & Menu */}
      <View className="items-center gap-2">
        {tabActive && <View className="w-3 h-3 rounded-full bg-green-500" />}
        <Menu>
          <MenuTrigger>
            <Ionicons name="ellipsis-vertical" size={20} color={iconColor} />
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingVertical: 8,
              width: 180,
              marginLeft: -20,
            }}
          >
            <MenuOption>
              <View className="flex-row items-center px-4 py-3 gap-3">
                <Ionicons name="pencil" size={18} color={iconColor} />
                <Text style={{ color: iconColor, fontSize: 15 }}>
                  Edit Post
                </Text>
              </View>
            </MenuOption>
            <MenuOption>
              <View className="flex-row items-center px-4 py-3 gap-3">
                <Ionicons name="checkmark" size={18} color={iconColor} />
                <Text style={{ color: iconColor, fontSize: 15 }}>
                  Mark as Resolved
                </Text>
              </View>
            </MenuOption>
            <MenuOption>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#374151",
                  marginVertical: 6,
                  marginHorizontal: 12,
                }}
              />
            </MenuOption>
            <MenuOption>
              <View className="flex-row items-center px-4 py-3 gap-3">
                <Ionicons name="trash" size={18} color={iconColor} />
                <Text style={{ color: iconColor, fontSize: 15 }}>
                  Delete Post
                </Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
}
