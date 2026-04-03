import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebaseConfig";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useItemsActions } from "@/hooks/useItemsActions";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Item = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  buildingName?: string;
  location?: number[];
  photos?: string[];
  posterId: string;
  posterName?: string;
  posterAvatar?: string;
  status: string;
  createdAt: any;
};

export default function SavedItemsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getBookmarkedItems, toggleBookmark } = useItemsActions();
  const [bookmarkedItems, setBookmarkedItems] = useState<Item[]>([]);
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    const loadBookmarkedItems = async () => {
      const data = await getBookmarkedItems(user?.uid);
      setBookmarkedItems(data);
    };

    loadBookmarkedItems();
  }, [user]);

  return (
    <View
      className="flex-1 px-4 pt-6"
      style={{ backgroundColor: backgroundColor }}
    >
      {bookmarkedItems.length > 0 ? (
        bookmarkedItems.map((item) => (
          <View
            key={item.id}
            className="mb-4 border p-4 rounded-lg"
            style={{ backgroundColor }}
          >
            <View className="flex-row gap-4">
              <Image
                source={{ uri: item.photos?.[0] }}
                style={{ width: 64, height: 64, borderRadius: 8 }}
              />
              <View className="flex-1 flex-row">
                <View className="flex-1 justify-between">
                  <Text
                    style={{ color: textColor }}
                    className="font-semibold text-lg"
                  >
                    {item.name ?? "No title"}
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className="text-base font-medium"
                  >
                    {item.posterName ?? "Unknown"}
                  </Text>
                  <Text style={{ color: textColor }} className="text-xs">
                    {item.status ?? "Unknown"}
                  </Text>
                  <View className="flex-row items-center ">
                    <Ionicons name="location" size={8} color={textColor} />
                    <Text
                      style={{ color: textColor }}
                      className="text-gray-400 ml-1 text-xs"
                    >
                      {item.buildingName ?? "Unknown"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  className="justify-center"
                  onPress={() => {
                    if (!user) return;
                    toggleBookmark(user.uid, item.id, true);

                    // update UI by removing the item from the list
                    setBookmarkedItems((prev) =>
                      prev.filter((i) => i.id !== item.id),
                    );
                  }}
                >
                  <Ionicons name="bookmark" size={24} color={textColor} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              className="mt-4 p-3 rounded-xl items-center flex-row justify-center gap-2"
              style={{ backgroundColor: "#2563EB" }} // blue
              onPress={async () => {
                if (!user) return;

                const userSnap = await getDoc(doc(db, "users", item.posterId));

                if (!userSnap.exists()) {
                  alert(
                    "User not found - they may have deleted their account.",
                  );
                  return;
                }

                const chatId = [user.uid, item.posterId].sort().join("_");

                router.push({
                  pathname: "/chat/[id]",
                  params: {
                    id: chatId,
                    posterId: item.posterId,
                    posterName: item.posterName,
                  },
                });
              }}
            >
              <Ionicons name="chatbubble" size={20} color="#fff" />
              <Text className="text-white font-semibold">Message Finder</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text className="text-gray-500">You haven't saved any items yet.</Text>
      )}
    </View>
  );
}
