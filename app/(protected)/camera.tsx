import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import CameraControls from "@/components/report-items/CameraControls";
import { useCameraLogic } from "@/hooks/use-camera-logic";

export default function CameraScreen() {
  const {
    facing,
    permission,
    cameraRef,
    photoCount,
    isMaxPhotos,
    toggleCameraFacing,
    takePicture,
    pickFromGallery,
    requestPermission,
  } = useCameraLogic();

  // Loading state
  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  // Permission not granted
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-center mb-4 px-8">
          We need camera permission to take photos
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-full"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main camera view
  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      <View
        className="absolute inset-0 items-center justify-center"
        pointerEvents="none"
      >
        <View
          className="w-80 h-96 rounded-3xl"
          style={{
            borderWidth: 2,
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderStyle: "dashed",
          }}
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/60 py-3 px-6 rounded-b-3xl">
          <Text className="text-white text-center text-sm">
            Center the item and take a clear photo
          </Text>
        </View>
      </View>

      {/* Bottom Controls - Separated Component */}
      <CameraControls
        isMaxPhotos={isMaxPhotos}
        onGalleryPress={pickFromGallery}
        onCapturePress={takePicture}
        onFlipPress={toggleCameraFacing}
      />
    </View>
  );
}
