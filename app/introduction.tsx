import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// ─── Slide Data ───────────────────────────────────────────────────────────────

const slides = [
  {
    id: 0,
    title: "Snap it, Pin it.",
    description:
      "Found something? Just take a photo. We'll automatically pin the location to help the owner find it faster.",
    showSkip: true,
    showBack: false,
    image: require("@/assets/images/slide1.png"),
    buttonLabel: "Next",
    isLast: false,
  },
  {
    id: 1,
    title: "Safe Recovery",
    description:
      "Communicate securely with others through our in-app messaging. Coordinate returns without sharing your personal info.",
    showSkip: true,
    showBack: true,
    image: require("@/assets/images/slide2.png"),
    buttonLabel: "Next",
    isLast: false,
  },
  {
    id: 2,
    title: "Faster Results",
    description:
      "Faster than traditional offices. Find your lost items in real-time with our interactive campus map.",
    showSkip: false,
    showBack: true,
    image: require("@/assets/images/slide3.png"),
    buttonLabel: "Get Started",
    isLast: true,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToLogin = () => {
    router.replace("/(auth)/login");
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      goToLogin();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const slide = slides[currentIndex];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          {slide.showBack ? (
            <TouchableOpacity
              onPress={handleBack}
              className="flex-row items-center"
            >
              <Ionicons name="chevron-back" size={22} color="#374151" />
              <Text className="text-[#374151] font-medium text-base ml-1">
                Back
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {slide.showSkip && (
            <TouchableOpacity onPress={goToLogin}>
              <Text className="text-[#374151] font-medium text-base">Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Illustration */}
        <View className="flex-1 items-center justify-center">
          <Image
            source={slide.image}
            style={{ width: 288, height: 288 }}
            contentFit="contain"
          />
        </View>

        {/* Title + Description */}
        <View className="items-center gap-4 mb-32">
          <Text className="font-bold text-4xl text-center">{slide.title}</Text>

          <Text className="text-center text-lg text-slate-600 mx-3">
            {slide.description}
          </Text>
        </View>

        {/* Dots */}
        <View className="flex-row justify-center mb-6">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`w-2 h-2 rounded-full mx-1 ${
                i === currentIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          className="bg-blue-500 items-center rounded-xl py-4 mb-5"
        >
          <Text className="text-white font-semibold text-lg">
            {slide.buttonLabel} →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
