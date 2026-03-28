import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function LocationSection({
  buildingName,
  setBuildingName,
  onEditPress,
  setIsUserEdited,
  isLoading,
}: {
  buildingName: string;
  setBuildingName: (name: string) => void;
  onEditPress: () => void;
  setIsUserEdited: (isEdited: boolean) => void;
  isLoading: boolean;
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const colorScheme = useColorScheme() ?? "light";
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View className="px-6 mb-6">
      <Text className="text-lg font-bold mb-3" style={{ color: textColor }}>
        Item Location
      </Text>

      <View
        className="flex-row items-center justify-between p-4 rounded-2xl"
        style={{
          backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#f3f4f6",
        }}
      >
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: tintColor + "20" }}
          >
            <Ionicons name="location" size={24} color={tintColor} />
          </View>

          <View className="flex-1">
            {isEditing ? (
              <TextInput
                value={buildingName}
                onChangeText={(text) => {
                  setBuildingName(text);
                  setIsUserEdited(true);
                }}
                autoFocus
                onBlur={() => setIsEditing(false)}
                placeholder="Enter location"
                style={{ color: textColor }}
              />
            ) : isLoading ? (
              <Text className="text-base font-medium mb-1 text-gray-400">
                Finding location...
              </Text>
            ) : (
              <Text
                onPress={() => setIsEditing(true)}
                className="text-base font-medium mb-1"
                style={{ color: textColor }}
              >
                {buildingName || "Tap to set location"}
              </Text>
            )}

            <Text className="text-sm" style={{ color: iconColor }}>
              Auto-detected building • Tap to edit if incorrect
            </Text>
          </View>
        </View>

        <Ionicons
          name={isEditing ? "checkmark" : "pencil"}
          size={20}
          color={iconColor}
        />
      </View>
    </View>
  );
}
