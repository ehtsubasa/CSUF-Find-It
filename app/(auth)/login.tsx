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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl mb-10 font-extrabold">Sign In</Text>
        <View className="gap-4 border border-gray-300 rounded-md p-4 mt-4 w-3/4">
          <Text>School Email</Text>
          <TextInput
            keyboardType="email-address"
            className="border border-gray-300 rounded-md p-2 mt-1"
            placeholder="example@csu.fullerton.edu"
            placeholderTextColor={"#6c7781"}
            value={email}
            onChangeText={setEmail}
          />
          <Text>Password</Text>
          <TextInput
            keyboardType="default"
            secureTextEntry={true}
            className="border border-gray-300 rounded-md p-2 mt-1"
            placeholder="Enter your password"
            placeholderTextColor={"#6c7781"}
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text className="text-red-500">{error}</Text> : null}

          <Pressable
            className="bg-gray-800 py-3 rounded-md mt-6"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-center text-white text-lg font-semibold">
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </Pressable>

          <View className="items-start">
            <Link href="/account-recovery" className="text-sm underline mt-4">
              Forgot password?
            </Link>
            <Link href="/register" className="text-sm underline mt-4">
              Don't have an account? Sign Up
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
