import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useConversations } from "@/hooks/useConversations";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const currentUser = useAuth()?.user;
  const { chatUsers } = useConversations(currentUser);

  // loop through all chats and add up all unread messages
  const unreadMessagesCount = chatUsers.reduce(
    (total, user) => total + user.unreadCount,
    0,
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        tabBarActiveTintColor: theme.backgroundIcon,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: { backgroundColor: theme.background },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="list"
        options={{
          title: "My Posts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Dummy Camera Tab */}
      <Tabs.Screen
        name="camera-trigger"
        options={{
          title: "",
          tabBarShowLabel: false,
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              className="items-center justify-center"
              onPress={() => router.push("/camera")}
            >
              <View
                className="h-16 w-16 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.backgroundIcon }}
              >
                <Ionicons name="camera" size={28} color="#ffff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          headerBackButtonDisplayMode: "minimal",
          tabBarBadge:
            unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
