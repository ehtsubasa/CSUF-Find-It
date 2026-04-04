import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import '../global.css';

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
  const colorScheme = useColorScheme() || 'light';
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    // Check if we're in an auth route or a protected route
    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';

    if (user && !user.emailVerified) {
      console.log(
        'User email not verified, redirecting to verify-email screen',
        segments
      );
      if (segments[1] !== 'verify-email') {
        router.replace('/(auth)/verify-email');
      }
    }
    // if (user && !user.emailVerified) {
    //   // Route user to email verification screen if not verified
    //   if (segments[1] !== "verify-email") {
    //     router.replace("/(auth)/verify-email");
    //   }
    // } else if (user && user.emailVerified && !inProtectedGroup) {
    //   // If logged in and email verified but not in protected route, send to home
    //   router.replace("/(protected)/(tabs)/map");
    // } else if (!user && inProtectedGroup) {
    //   router.replace("/");
    // }

    // if (user && !inProtectedGroup) {
    //   router.replace('/(protected)/(tabs)/map');
    // } else if (!user && !inAuthGroup) {
    //   router.replace('/(auth)/login');
    // }
  }, [user, loading, segments]);

  if (loading) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='introduction' />
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(protected)' />
      </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
