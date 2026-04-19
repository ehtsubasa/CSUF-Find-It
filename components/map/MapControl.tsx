import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type MapControlProps = {
  onUserLocation: () => void;
  onInititalLocation: () => void;
};

export default function MapControl({
  onUserLocation,
  onInititalLocation,
}: MapControlProps) {
  const buttonBackground = useThemeColor({}, "buttonBackground");
  const iconColor = useThemeColor({}, "icon");
  return (
    <View className="absolute top-5 right-3 gap-2">
      <TouchableOpacity
        activeOpacity={0.8}
        className=" p-3 shadow-lg rounded-lg"
        style={{ backgroundColor: buttonBackground }}
        onPress={onInititalLocation}
      >
        <Ionicons name="school" size={24} color={iconColor} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        className=" p-3 shadow-lg rounded-lg"
        style={{ backgroundColor: buttonBackground }}
        onPress={onUserLocation}
      >
        <Ionicons name="navigate" size={24} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}
