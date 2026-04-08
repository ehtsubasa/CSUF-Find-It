import { RecentItem, useRecentItems } from "@/hooks/useRecentItems";
import { timeAgo } from "@/hooks/useTime";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Props {
  lastSeenAt: Date | null;
  currentUserId: string;
  onSelectItem: (item: RecentItem) => void;
  selectedCategory: string | null;
}

export default function RecentlyFoundItems({ lastSeenAt, currentUserId, onSelectItem, selectedCategory }: Props) {
  const { items, loading } = useRecentItems(20);
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  return (
    <View className="absolute bottom-12 left-3">
      {loading ? (
        <ActivityIndicator className="mt-4" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2"
        >
          {filteredItems.map((item) => {
            const isNew =
              lastSeenAt !== null &&
              item.posterId !== currentUserId &&
              item.createdAt > lastSeenAt;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => onSelectItem(item)}
                className="w-52 bg-white rounded-xl mr-3 p-3"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  elevation: 3,
                  overflow: "visible",
                }}
              >
                {/* Image */}
                <View className="w-full h-24 bg-gray-200 items-center justify-center rounded-lg">
                  {item.photos.length > 0 ? (
                    <Image
                      source={{ uri: item.photos[0] }}
                      contentFit="cover"
                      style={{ width: "100%", height: "100%", borderRadius: 8 }}
                    />
                  ) : (
                    <Ionicons name="image" size={24} color="#6b7280" />
                  )}
                  {isNew && (
                    <View className="absolute -top-2 -right-2 z-10 w-4 h-4 rounded-full bg-red-500" />
                  )}
                </View>

                {/* Info */}
                <View className="mt-3">
                  <Text
                    className="text-md font-semibold text-gray-900"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
                    {item.buildingName} {" • "} {timeAgo(item.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
