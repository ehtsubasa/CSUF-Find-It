import { useThemeColor } from "@/hooks/use-theme-color";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const backgroundColor = useThemeColor({}, "background");
  return (
    <View className="px-4 pt-12 pb-4 border-b" style={{ backgroundColor }}>
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
        {/* Notification */}
        <TouchableOpacity className="relative">
          <Ionicons name="notifications-outline" size={24} color={iconColor} />
          <View className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center rounded-lg px-3 py-2 bg-gray-100">
        <Ionicons name="search" size={20} color={iconColor} />

        <TextInput
          placeholder="Search buildings or items"
          value={searchQuery}
          onChangeText={onSearchChange}
          className="flex-1 ml-2"
          style={{ color: textColor }}
          placeholderTextColor="#9ca3af"
        />
      </View>
    </View>
  );
}
