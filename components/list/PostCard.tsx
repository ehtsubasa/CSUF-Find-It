import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useItemsActions } from "@/hooks/useItemsActions";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

interface PostCardProps {
  id: string;
  posterId: string;
  title: string;
  status: string;
  location: string;
  time: string;
  tabActive: boolean;
  photo: string;
  onMarkAsReturned?: (postId: string, posterId: string) => void;
}

export default function PostCard({
  id,
  posterId,
  title,
  status,
  location,
  time,
  photo,
  onMarkAsReturned,
}: PostCardProps) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const colorScheme = useColorScheme() ?? "light";
  const backgroundColor = useThemeColor({}, "background");
  const { deletePost } = useItemsActions();

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
      <Image
        source={{ uri: photo }}
        contentFit="cover"
        transition={1000}
        style={{ width: 64, height: 64, borderRadius: 8, marginRight: 12 }}
      />

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
        {status === "active" && (
          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" size={20} color={iconColor} />
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                backgroundColor: backgroundColor,
                borderRadius: 12,
                paddingVertical: 8,
                width: 180,
                marginLeft: -20,
              }}
            >
              <MenuOption>
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3 gap-3"
                  onPress={() => console.log("Edit post")}
                >
                  <Ionicons name="pencil" size={18} color={iconColor} />
                  <Text style={{ color: iconColor, fontSize: 15 }}>
                    Edit Post
                  </Text>
                </TouchableOpacity>
              </MenuOption>
              <MenuOption>
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3 gap-3"
                  onPress={() => onMarkAsReturned?.(id, posterId)}
                >
                  <Ionicons name="checkmark" size={18} color={iconColor} />
                  <Text style={{ color: iconColor, fontSize: 15 }}>
                    Mark as Returned
                  </Text>
                </TouchableOpacity>
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
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3 gap-3"
                  onPress={() => deletePost(id, posterId)}
                >
                  <Ionicons name="trash" size={18} color={iconColor} />
                  <Text style={{ color: iconColor, fontSize: 15 }}>
                    Delete Post
                  </Text>
                </TouchableOpacity>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>
    </View>
  );
}
