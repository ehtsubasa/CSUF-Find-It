import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthActions } from "@/hooks/useAuthActions";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const buttonBackgroundColor = useThemeColor({}, "buttonBackground");
  const borderColor = useThemeColor({}, "border");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 "
      style={{ backgroundColor: backgroundColor }}
    >
      <View className="flex-1 items-center justify-center">
        <Text
          className="text-5xl mb-10 font-extrabold"
          style={{ color: textColor }}
        >
          Sign In
        </Text>
        <View
          className="gap-4 border rounded-md p-4 mt-4 w-3/4"
          style={{ borderColor: borderColor }}
        >
          <Text style={{ color: textColor }}>School Email</Text>
          <TextInput
            keyboardType="email-address"
            className="border rounded-md p-2 mt-1"
            placeholder="example@csu.fullerton.edu"
            placeholderTextColor={textColor}
            value={email}
            onChangeText={setEmail}
            style={{ borderColor: borderColor, color: textColor }}
          />
          <Text style={{ color: textColor }}>Password</Text>
          <TextInput
            keyboardType="default"
            secureTextEntry={true}
            className="border rounded-md p-2 mt-1"
            placeholder="Enter your password"
            placeholderTextColor={textColor}
            value={password}
            onChangeText={setPassword}
            style={{ borderColor: borderColor, color: textColor }}
          />
          {error ? <Text className="text-red-500">{error}</Text> : null}

          <Pressable
            className=" py-3 rounded-md mt-6"
            onPress={handleLogin}
            disabled={loading}
            style={{ backgroundColor: buttonBackgroundColor }}
          >
            <Text
              className="text-center  text-lg font-semibold"
              style={{ color: textColor }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </Pressable>

          <View className="items-start">
            <Link
              href="/account-recovery"
              className="text-sm underline mt-4"
              style={{ color: textColor }}
            >
              Forgot password?
            </Link>
            <Link
              href="/register"
              className="text-sm underline mt-4"
              style={{ color: textColor }}
            >
              Don't have an account? Sign Up
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
