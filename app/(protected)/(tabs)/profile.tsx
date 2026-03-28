import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, View } from "react-native";

import ActivitySection from "@/components/profile/ActivitySection";
import ProfileCard from "@/components/profile/ProfileCard";
import SettingsSection from "@/components/profile/SettingsSection";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function ProfileScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ScrollView className="flex-1">
        <ProfileCard />

        <ActivitySection />

        <SettingsSection />
      </ScrollView>
    </View>
  );
}
