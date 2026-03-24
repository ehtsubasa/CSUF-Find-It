import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface CategoryButtonsProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const categories = [
  { name: "Electronics", icon: "phone-portrait-outline" },
  { name: "Clothing", icon: "shirt-outline" },
  { name: "Keys", icon: "key-outline" },
] as const;

export default function CategoryButtons({
  selectedCategory,
  onSelectCategory,
}: CategoryButtonsProps) {
  const selectedColor = useThemeColor({}, "backgroundIcon");
  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor(
    { light: "#f3f4f6", dark: "#2a2a2a" },
    "background",
  );

  return (
    <View className="py-2 justify-center">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          alignItems: "center",
          gap: 10,
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          return (
            <TouchableOpacity
              key={category.name}
              onPress={() =>
                onSelectCategory(isSelected ? null : category.name)
              }
              className="px-3 py-2 rounded-2xl flex-row items-center"
              style={{
                backgroundColor: isSelected ? selectedColor : cardColor,
              }}
            >
              <Ionicons
                name={category.icon}
                size={14}
                color={isSelected ? "#fff" : textColor}
                style={{ marginRight: 4 }}
              />
              <Text
                className="text-xs font-medium"
                style={{ color: isSelected ? "#fff" : textColor }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
