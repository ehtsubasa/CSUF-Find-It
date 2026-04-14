import React from "react";
import { Text, View } from "react-native";

export default function NotificationSettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-semibold">Notification Settings</Text>
      <Text className="text-gray-500 mt-2">
        Here you can customize your notification preferences.
      </Text>
    </View>
  );
}
