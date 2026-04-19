import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ProtectedLayout() {
  const { posterName, posterAvatar } = useGlobalSearchParams<{
    posterName: string;
    posterAvatar: string;
  }>();

  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: iconColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="chat/[id]"
        options={{
          title: "",
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "left",
          headerShown: true,
          headerTitle: () => (
            <View className="flex-row items-center gap-2">
              <Image
                source={{
                  uri: posterAvatar,
                }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />

              <Text className="text-lg font-bold" style={{ color: textColor }}>
                {posterName}
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="report-item"
        options={{
          headerShown: true,
          headerTitle: () => (
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold" style={{ color: textColor }}>
                Report Item
              </Text>
            </View>
          ),
          headerRight: () => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Ionicons
                name="help-circle-outline"
                size={32}
                color={iconColor}
                onPress={() =>
                  alert("Need help? Contact support at support@findit.com")
                }
              />
            </View>
          ),
          headerLeft: () => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Ionicons
                name="close"
                size={32}
                color={iconColor}
                onPress={() => router.replace("/(protected)/(tabs)/map")}
              />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="camera"
        options={{ title: "Camera", headerShown: true }}
      />

      <Stack.Screen
        name="photo-view"
        options={{ title: "Photo View", headerShown: true }}
      />
      <Stack.Screen
        name="saved-items"
        options={{ title: "Saved Items", headerShown: true }}
      />
    </Stack>
  );
}
