import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, View } from "react-native";

import ActivitySection from "@/components/profile/ActivitySection";
import ProfileCard from "@/components/profile/ProfileCard";
import SettingsSection from "@/components/profile/SettingsSection";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfileScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const colorScheme = useColorScheme();

  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ScrollView className="flex-1">
        <ProfileCard userProfile={userProfile} />

        <ActivitySection userProfile={userProfile} />

        <SettingsSection userProfile={userProfile} />
      </ScrollView>
    </View>
  );
}
