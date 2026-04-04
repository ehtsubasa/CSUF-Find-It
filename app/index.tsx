import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: backgroundColor }}
    >
      <View className="flex-1 justify-center items-center">
        <Image
          source={require("../assets/images/Logoo.png")}
          style={{ width: 256, height: 256 }}
          contentFit="contain"
        />
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl font-extrabold text-orange-600 mb-2">
          <Text className="text-orange-600">Titan</Text>
          <Text className="text-blue-600"> Find</Text>
        </Text>
        <Text className="text-center text-sm text-gray-400 mb-10">
          Lost something on campus? We can help you find it!
        </Text>
        {/* <Link href="/register" asChild> */}
        <Link href="/introduction" asChild>
          <Pressable className="w-full bg-blue-600 py-4 rounded-2xl mb-4">
            <Text className="text-center text-white text-lg font-semibold">
              Get Started
            </Text>
          </Pressable>
        </Link>
        <Link href="/login" asChild>
          <Pressable className="w-full border border-blue-600 py-4 rounded-2xl">
            <Text className="text-center text-blue-600 text-lg font-semibold">
              I already have an account
            </Text>
          </Pressable>
        </Link>
      </View>
      <View className="items-center">
        <Text className="text-center text-blue-600 text-sm">
          <Text className="underline">Terms of Service</Text>
          {" • "}
          <Text className="underline">Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
