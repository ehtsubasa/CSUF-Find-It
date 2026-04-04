import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthActions } from "@/hooks/useAuthActions";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthActions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const buttonBackgroundColor = useThemeColor({}, "buttonBackground");
  const borderColor = useThemeColor({}, "border");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Fill all fields");
      return;
    }

    if (!email.endsWith("@csu.fullerton.edu")) {
      setError("Use your CSUF email");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be 6+ chars");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await register(name, email, password);
      router.replace("/(auth)/verify-email");
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: backgroundColor }}
    >
      <View className="flex-1 items-center justify-center">
        <Text
          className="text-5xl mb-10 font-extrabold"
          style={{ color: textColor }}
        >
          Sign Up
        </Text>
        <View
          className="gap-4 border rounded-md p-4 mt-4 w-3/4"
          style={{ borderColor: borderColor }}
        >
          {error ? <Text className="text-red-500">{error}</Text> : null}
          <Text style={{ color: textColor }}>Name</Text>
          <TextInput
            className="border rounded-md p-2 mt-1"
            placeholder="Enter your name"
            placeholderTextColor={textColor}
            keyboardType="default"
            value={name}
            onChangeText={setName}
            style={{ borderColor: borderColor, color: textColor }}
          />
          <Text style={{ color: textColor }}>School Email</Text>
          <TextInput
            className="border rounded-md p-2 mt-1"
            value={email}
            onChangeText={setEmail}
            placeholder="example@csu.fullerton.edu"
            placeholderTextColor={textColor}
            keyboardType="email-address"
            style={{ borderColor: borderColor, color: textColor }}
          />
          <Text style={{ color: textColor }}>Password</Text>
          <TextInput
            className="border rounded-md p-2 mt-1"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Enter your password"
            placeholderTextColor={textColor}
            keyboardType="default"
            style={{ borderColor: borderColor, color: textColor }}
          />
          <Text style={{ color: textColor }}>Repeat password</Text>
          <TextInput
            className="border rounded-md p-2 mt-1"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholder="Repeat your password"
            placeholderTextColor={textColor}
            keyboardType="default"
            style={{ borderColor: borderColor, color: textColor }}
          />
          <Pressable
            className="bg-gray-800 py-3 rounded-md mt-6"
            onPress={handleSignup}
            disabled={loading}
            style={{ backgroundColor: buttonBackgroundColor }}
          >
            <Text
              className="text-center  text-lg font-semibold"
              style={{ color: textColor }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Text>
          </Pressable>
          <View className="items-start">
            <Link
              href="/login"
              className="text-sm underline mt-4"
              style={{ color: textColor, textDecorationColor: textColor }}
            >
              Already have an account? Sign In
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
