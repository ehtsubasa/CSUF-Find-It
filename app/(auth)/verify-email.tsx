import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthActions } from "@/hooks/useAuthActions";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function EmailVerificationScreen() {
  const { user, logOut } = useAuth();
  const { resendVerification } = useAuthActions();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const buttonBackgroundColor = useThemeColor({}, "buttonBackground");
  const borderColor = useThemeColor({}, "border");

  const handleContinue = async () => {
    await user?.reload();
    if (user?.emailVerified) {
      console.log("\n");
      console.log("Reloaded user data:", user);
      router.replace("/(protected)/(tabs)/map");
    } else {
      alert("Your email is not verified yet. Please check your inbox.");
    }
  };

  const handleBackToLogin = async () => {
    await logOut();
    router.replace("/(auth)/login");
  };

  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: backgroundColor }}
    >
      <Image
        source={require("../../assets/images/tuffy-charging.png")}
        style={{ width: 300, height: 300, marginBottom: 32 }}
        contentFit="contain"
      />
      <Text className="text-4xl font-bold mb-4" style={{ color: textColor }}>
        Verify Your Email
      </Text>
      <Text
        className="text-center text-gray-400 mb-8 px-6"
        style={{ color: textColor }}
      >
        We sent a verification link to your school email. Tap the link in the
        email to confirm your account. {"\n"}
        <Text
          className="text-sm text-blue-500 mb-6 font-bold"
          style={{ color: textColor }}
        >
          {user?.email ?? "your email address"}
        </Text>
      </Text>

      <Pressable
        className="bg-[#084B8A] w-full py-3 rounded-md mb-4"
        onPress={handleContinue}
      >
        <Text className="text-center text-white font-semibold">
          I&apos;ve Verified My Email
        </Text>
      </Pressable>

      <Text className="text-center text-gray-400 mb-4">
        Still can&apos;t find the email?
      </Text>
      <Pressable
        className="bg-[#084B8A] py-3 px-6 rounded-md mb-6"
        onPress={resendVerification}
      >
        <Text className="text-white font-semibold">Resend Link</Text>
      </Pressable>

      <Pressable onPress={handleBackToLogin}>
        <Text className="text-sm text-gray-500 underline">Back to Login</Text>
      </Pressable>
    </View>
  );
}
