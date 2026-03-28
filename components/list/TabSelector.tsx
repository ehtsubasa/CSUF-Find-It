import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TabSelectorProps {
  selectedTab: "Active" | "Returned";
  onSelectTab: (tab: "Active" | "Returned") => void;
}

export default function TabSelector({
  selectedTab,
  onSelectTab,
}: TabSelectorProps) {
  return (
    <View className="flex-row px-5 py-3 gap-3">
      {/* ACTIVE TAB */}
      <TouchableOpacity
        className="flex-1 py-3 rounded-2xl items-center"
        style={{
          backgroundColor: selectedTab === "Active" ? "#2c3e63" : "transparent",
        }}
        onPress={() => onSelectTab("Active")}
      >
        <Text
          className="font-semibold"
          style={{
            color: selectedTab === "Active" ? "#fff" : "#9ca3af",
          }}
        >
          Active
        </Text>
      </TouchableOpacity>

      {/* RETURNED TAB */}
      <TouchableOpacity
        className="flex-1 py-3 rounded-2xl items-center"
        style={{
          backgroundColor:
            selectedTab === "Returned" ? "#2c3e63" : "transparent",
        }}
        onPress={() => onSelectTab("Returned")}
      >
        <Text
          className="font-semibold"
          style={{
            color: selectedTab === "Returned" ? "#fff" : "#9ca3af",
          }}
        >
          Returned
        </Text>
      </TouchableOpacity>
    </View>
  );
}
