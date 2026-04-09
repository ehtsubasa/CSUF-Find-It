import { useThemeColor } from "@/hooks/use-theme-color";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TextInput, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  newItemsCount: number;
  claimedPostsCount: number;
  newMessagesCount: number;
  onNotificationDismiss: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  newItemsCount,
  claimedPostsCount,
  newMessagesCount,
  onNotificationDismiss,
}: HeaderProps) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const backgroundColor = useThemeColor({}, "background");
  const buttonBackgroundColor = useThemeColor({}, "buttonBackground");

  const hasAny =
    newItemsCount > 0 || claimedPostsCount > 0 || newMessagesCount > 0;

  return (
    <View
      className="px-4 pt-12 pb-4"
      style={{
        backgroundColor,
        borderBottomWidth: 1,
        borderBottomColor: backgroundColor,
      }}
    >
      {/* Top Row */}
      <View
        className="flex-row items-center justify-between mb-3"
        style={{ backgroundColor }}
      >
        {/* Logo + Title */}
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full items-center justify-center mr-2">
            <Ionicons name="map" size={20} color={iconColor} />
          </View>
          <Text className="text-xl font-bold" style={{ color: textColor }}>
            Campus Map
          </Text>
        </View>

        {/* Notification Bell */}
        <Menu>
          <MenuTrigger>
            <View className="relative">
              <Ionicons
                name="notifications-outline"
                size={24}
                color={iconColor}
              />
              {hasAny && (
                <View className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
              )}
            </View>
          </MenuTrigger>

          <MenuOptions
            customStyles={{
              optionsContainer: {
                backgroundColor,
                borderRadius: 12,
                padding: 8,
                width: 240,

                marginTop: 25,
              },
            }}
          >
            {newMessagesCount > 0 && (
              <MenuOption onSelect={onNotificationDismiss}>
                <View className="flex-row items-center gap-3 px-2 py-2">
                  <Ionicons name="chatbubble" size={16} color="#3b82f6" />
                  <Text style={{ color: textColor }}>
                    {newMessagesCount} new message
                    {newMessagesCount > 1 ? "s" : ""}
                  </Text>
                </View>
              </MenuOption>
            )}

            {claimedPostsCount > 0 && (
              <MenuOption onSelect={onNotificationDismiss}>
                <View className="flex-row items-center gap-3 px-2 py-2">
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={{ color: textColor }}>
                    {claimedPostsCount} item
                    {claimedPostsCount > 1 ? "s were" : " was"} claimed
                  </Text>
                </View>
              </MenuOption>
            )}

            {newItemsCount > 0 && (
              <MenuOption onSelect={onNotificationDismiss}>
                <View className="flex-row items-center gap-3 px-2 py-2">
                  <Ionicons name="location" size={16} color="#f59e0b" />
                  <Text style={{ color: textColor }}>
                    {newItemsCount} new item
                    {newItemsCount > 1 ? "s" : ""}
                  </Text>
                </View>
              </MenuOption>
            )}

            {!hasAny && (
              <MenuOption disabled>
                <Text style={{ color: textColor }}>No new notifications</Text>
              </MenuOption>
            )}
          </MenuOptions>
        </Menu>
      </View>

      {/* Search Bar */}
      <View
        className="flex-row items-center rounded-lg px-3 py-2"
        style={{ backgroundColor: buttonBackgroundColor }}
      >
        <Ionicons name="search" size={20} color={iconColor} />
        <TextInput
          placeholder="Search buildings or items"
          value={searchQuery}
          onChangeText={onSearchChange}
          className="flex-1 ml-2"
          style={{ color: textColor }}
          placeholderTextColor={textColor}
        />
      </View>
    </View>
  );
}
