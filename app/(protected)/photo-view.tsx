import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalSearchParams } from "expo-router";
import { Image, View } from "react-native";

export default function PhotoViewScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const backgroundColor = useThemeColor({}, "background");

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      {/* Image */}
      <Image source={{ uri }} className="flex-1" resizeMode="contain" />
    </View>
  );
}
