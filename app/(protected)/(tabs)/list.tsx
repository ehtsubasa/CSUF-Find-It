import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import PostCard from "@/components/list/PostCard";
import TabSelector from "@/components/list/TabSelector";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useItemsActions } from "@/hooks/useItemsActions";
import { timeAgo } from "@/hooks/useTime";

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
  const [selectedTab, setSelectedTab] = useState<"Active" | "Returned">(
    "Active",
  );
  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { getUserItems, markAsReturned } = useItemsActions();
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user) return;
    const loadUserPosts = async () => {
      const items = await getUserItems(user.uid);
      setUserPosts(items);
      console.log("Loading user posts with params:", items);
    };
    loadUserPosts();
  }, []);

  const handleMarkAsReturned = async (postId: string, posterId: string) => {
    await markAsReturned(postId, posterId);
    // Update local state to reflect the change
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, status: "returned" } : post,
      ),
    );
  };

  // Filter posts based on selected tab
  const filteredPosts = userPosts.filter((post) =>
    selectedTab === "Active"
      ? post.status === "active"
      : post.status === "returned",
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
            posterId={post.posterId}
            title={post.name}
            status={post.status}
            photo={post.photos[0]}
            time={timeAgo(post.createdAt, {
              upperCase: true,
              recentLabel: "recently",
            })}
            location={post.buildingName || "Unknown Location"}
            tabActive={selectedTab === "Active"}
            onMarkAsReturned={handleMarkAsReturned}
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
