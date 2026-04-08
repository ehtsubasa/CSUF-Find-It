import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme() || "light";
  const router = useRouter();
  const segments = useSegments();
  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");

  useEffect(() => {
    if (loading) return;

    // Check if we're in an auth route or a protected route
    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";
    const inIntro = segments[0] === "introduction";
    const inIndex = segments[0] === undefined;

    // If user is not logged in and they're in the auth group, intro, or index, allow access
    if (!user && (inIndex || inIntro || inAuthGroup)) return;

    // If user is not logged in and they're not in the auth group, redirect to login
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    // If user is not logged in and we're not in the auth group, redirect to login
    if (user && !user.emailVerified) {
      console.log(
        "User email not verified, redirecting to verify-email screen",
        segments,
      );
      if (segments[1] !== "verify-email") {
        router.replace("/(auth)/verify-email");
      }
      return;
    }

    // If user is logged in and verified and in others, redirect to map screen
    if (user && user.emailVerified && !inProtectedGroup) {
      console.log("User logged in and verified, redirecting to map screen");
      router.replace("/(protected)/(tabs)/map");
    }
  }, [user, loading, segments, router]);

  if (loading) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="introduction" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(protected)" />
      </Stack>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
