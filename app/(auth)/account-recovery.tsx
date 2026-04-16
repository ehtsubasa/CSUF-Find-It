import { router } from "expo-router";
import { Pressable, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useState } from "react";

export default function AccountRecoveryScreen() {
  const { resetPassword } = useAuthActions();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
      alert("Password reset email sent! Please check your inbox.");
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-white'>
      <Text className='text-2xl mb-4'>Account Recovery</Text>
      <Text className='text-center mb-8 px-6'>
        To reset your password, please enter your school email address. We will
        send you a password reset link.
      </Text>
      <TextInput
        placeholder='Enter your email'
        keyboardType='email-address'
        className='border rounded-md p-2 w-3/4 mb-4'
        value={email}
        onChangeText={setEmail}
      />
      {error ? <Text className='text-red-500'>{error}</Text> : null}
      <Pressable
        onPress={() => handleResetPassword(email)}
        className='p-4'
      >
        <Text className='text-xl'>Reset Password</Text>
      </Pressable>
    </SafeAreaView>
  );
}
