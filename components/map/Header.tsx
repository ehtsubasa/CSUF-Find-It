import { useThemeColor } from "@/hooks/use-theme-color";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasNotifications: boolean;
  newItemsCount: number;
  claimedPostsCount: number;
  newMessagesCount: number;
  onNotificationDismiss: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  hasNotifications,
  newItemsCount,
  claimedPostsCount,
  newMessagesCount,
  onNotificationDismiss,
}: HeaderProps) {
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");
  const iconColor = useThemeColor({}, "icon");
  const backgroundColor = useThemeColor({}, "background");
  const buttonBackgroundColor = useThemeColor({}, "buttonBackground");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleBellPress = () => {
    if (!dropdownVisible) {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
      onNotificationDismiss();
    }
  };

  const handleDismiss = () => {
    setDropdownVisible(false);
    onNotificationDismiss();
  };

  const hasAny = hasNotifications || newMessagesCount > 0;

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
        <TouchableOpacity className="relative" onPress={handleBellPress}>
          <Ionicons name="notifications-outline" size={24} color={iconColor} />
          {hasAny && (
            <View className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
          )}
        </TouchableOpacity>
      </View>

      {/* Notification Dropdown */}
      {dropdownVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleDismiss}
          className="absolute top-20 right-4 z-50 rounded-xl overflow-hidden"
          style={{
            backgroundColor,
            borderWidth: 1,
            borderColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
            minWidth: 240,
          }}
        >
          {newMessagesCount > 0 && (
            <View
              className="flex-row items-center gap-3 px-4 py-3"
              style={{ borderBottomWidth: 1, borderBottomColor: borderColor }}
            >
              <Ionicons name="chatbubble" size={16} color="#3b82f6" />
              <Text style={{ color: textColor }}>
                You have {newMessagesCount} new{" "}
                {newMessagesCount === 1 ? "message" : "messages"}
              </Text>
            </View>
          )}
          {claimedPostsCount > 0 && (
            <View
              className="flex-row items-center gap-3 px-4 py-3"
              style={{ borderBottomWidth: 1, borderBottomColor: borderColor }}
            >
              <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              <Text style={{ color: textColor }}>
                {claimedPostsCount === 1
                  ? "One of your items was claimed"
                  : `${claimedPostsCount} of your items were claimed`}
              </Text>
            </View>
          )}
          {newItemsCount > 0 && (
            <View className="flex-row items-center gap-3 px-4 py-3">
              <Ionicons name="location" size={16} color="#f59e0b" />
              <Text style={{ color: textColor }}>
                {newItemsCount} new{" "}
                {newItemsCount === 1 ? "item was" : "items were"} posted while
                you were away
              </Text>
            </View>
          )}
          {!hasAny && (
            <View
              className="px-4 py-3"
              style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", borderRadius: 12 }}
            >
              <Text style={{ color: textColor }}>No new notifications</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

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
