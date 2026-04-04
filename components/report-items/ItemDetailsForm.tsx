import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const CATEGORIES = ["Electronics", "Clothing", "Keys", "Other"];

export default function ItemDetailsForm({
  itemName,
  setItemName,
  selectedCategory,
  setSelectedCategory,
  description,
  setDescription,
}: {
  itemName: string;
  setItemName: (name: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  description: string;
  setDescription: (desc: string) => void;
}) {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const backgroundColor = useThemeColor({}, "background");
  const colorScheme = useColorScheme() ?? "light";

  const inputBgColor = colorScheme === "dark" ? "#1a1a1a" : "#f9fafb";
  const borderColor = useThemeColor({}, "border");
  const buttonBackgroundColor = useThemeColor({}, "buttonBackground");

  return (
    <View className="px-6 mb-4 mt-4">
      <Text className="text-lg font-bold mb-4" style={{ color: textColor }}>
        Item Details
      </Text>

      {/* Item Name */}
      <View className="mb-4">
        <Text
          className="text-sm font-semibold mb-2"
          style={{ color: textColor }}
        >
          Item Name
        </Text>
        <TextInput
          className="px-4 py-4 rounded-xl text-base"
          style={{
            backgroundColor: inputBgColor,
            borderWidth: 1,
            borderColor: borderColor,
            color: textColor,
          }}
          placeholder="e.g. iPhone 13, Car Key, Blue Backpack"
          placeholderTextColor={iconColor}
          maxLength={80}
          value={itemName}
          onChangeText={setItemName}
        />
      </View>

      {/* Category Dropdown */}
      <View className="mb-4">
        <Text
          className="text-sm font-semibold mb-2"
          style={{ color: textColor }}
        >
          Category
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-4 rounded-xl"
          style={{
            backgroundColor: buttonBackgroundColor,
            borderWidth: 1,
            borderColor: borderColor,
          }}
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text
            className="text-base"
            style={{ color: selectedCategory ? textColor : iconColor }}
          >
            {selectedCategory || "Select a category"}
          </Text>
          <Ionicons name="chevron-down" size={20} color={iconColor} />
        </TouchableOpacity>

        {/* Category Options (only shown when dropdown is "open") */}
        {showCategoryPicker && (
          <View
            className="mt-2 rounded-xl overflow-hidden"
            style={{
              backgroundColor: buttonBackgroundColor,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            {CATEGORIES.map((category, index) => (
              <TouchableOpacity
                key={category}
                className="px-4 py-3"
                style={{
                  borderBottomWidth: index < CATEGORIES.length - 1 ? 1 : 0,
                  borderBottomColor: borderColor,
                }}
                onPress={() => {
                  setSelectedCategory(category);
                  setShowCategoryPicker(false);
                }}
              >
                <Text className="text-base" style={{ color: textColor }}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Description */}
      <View>
        <Text
          className="text-sm font-semibold mb-2"
          style={{ color: textColor }}
        >
          Description
        </Text>
        <TextInput
          className="px-4 py-4 rounded-xl text-base"
          style={{
            backgroundColor: inputBgColor,
            borderWidth: 1,
            borderColor: borderColor,
            color: textColor,
            height: 140,
            textAlignVertical: "top",
          }}
          placeholder="e.g. Silver iPhone 13 with a blue case and a sticker of a cat on the back..."
          placeholderTextColor={iconColor}
          multiline
          maxLength={300}
          value={description}
          onChangeText={setDescription}
        />
        <Text className="text-xs text-right mt-1" style={{ color: iconColor }}>
          {description.length}/300 characters
        </Text>
      </View>
    </View>
  );
}
