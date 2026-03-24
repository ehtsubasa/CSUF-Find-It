import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function SubmitButton({ onPress }: { onPress: () => void }) {
  const buttonColor = useThemeColor({}, "buttonBackground");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  return (
    <TouchableOpacity
      className="mx-4 mb-10 mt-4 flex-row items-center justify-center py-4 rounded-2xl"
      style={{
        backgroundColor: buttonColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={onPress}
    >
      <Text className="font-bold text-lg mr-2" style={{ color: textColor }}>
        Post Item
      </Text>
      <Ionicons name="arrow-forward" size={20} color={iconColor} />
    </TouchableOpacity>
  );
}
