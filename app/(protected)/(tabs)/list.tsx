import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import PostCard from "@/components/list/PostCard";
import TabSelector from "@/components/list/TabSelector";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebaseConfig";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { timeAgo } from "@/hooks/useTime";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

interface Post {
  id: string;
  name: string;
  posterId: string;
  posterName: string;
  status: string;
  buildingName: string;
  createdAt: Date;
  photos: string[];
}

export default function MyPostsScreen() {
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const [selectedTab, setSelectedTab] = useState<"Active" | "Returned">(
    "Active",
  );
  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "reportedItems"),
      where("posterId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserPosts(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name ?? "No title",
            posterId: data.posterId ?? "",
            posterName: data.posterName ?? "",
            status: data.status ?? "Active",
            buildingName: data.buildingName ?? "Unknown",
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            photos: data.photos ?? [],
          };
        }),
      );
    });
    return unsubscribe;
  }, [user?.uid]);

  // Filter posts based on selected tab
  const filteredPosts = userPosts.filter((p) =>
    selectedTab === "Active"
      ? p.status.toLowerCase() === "active"
      : p.status.toLowerCase() !== "active",
  );

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <TabSelector selectedTab={selectedTab} onSelectTab={setSelectedTab} />

      <ScrollView className="flex-1 px-4">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.name}
            status={post.status}
            photo={post.photos[0]}
            time={timeAgo(post.createdAt, {
              upperCase: true,
              recentLabel: "recently",
            })}
            location={post.buildingName || "Unknown Location"}
            tabActive={selectedTab === "Active"}
          />
        ))}

        {filteredPosts.length === 0 && (
          <View className="items-center justify-center py-20">
            <Text className="text-base" style={{ color: iconColor }}>
              No {selectedTab.toLowerCase()} posts
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
