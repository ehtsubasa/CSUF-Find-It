import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useChat } from "@/hooks/useChat";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
  useColorScheme,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_IMAGE_COUNT = 1;

export default function MessagesDetail() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const buttonBackgroundColor = useThemeColor({}, "buttonBackground");
  const inset = useSafeAreaInsets();
  const [text, setText] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const currentUser = useAuth()?.user;
  const headerHeight = useHeaderHeight();
  const customHeaderHeight = 10; // Height of the item info header
  const [images, setImages] = useState<string[]>([]);
  const { id, posterId, selectedItemId } = useLocalSearchParams<{
    id: string;
    posterId: string;
    selectedItemId?: string;
  }>();
  const shouldStartInDraft = Boolean(selectedItemId);
  const { messages, sendMessage } = useChat(
    id,
    currentUser,
    posterId,
    shouldStartInDraft,
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
        [
          { text: "OK", onPress: () => {} },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      if (images.length + newImages.length <= MAX_IMAGE_COUNT) {
        setImages((prev) => [...prev, ...newImages]);
      } else {
        Alert.alert("Limit reached", `You can only select 1 image.`);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        marginBottom: inset.bottom,
        backgroundColor: backgroundColor,
      }}
    >
      <GiftedChat
        messages={messages}
        text={text}
        onSend={(messages: any) => {
          sendMessage(messages[0].text || "", images);
          // Clear input and images after sending
          setText("");
          setImages([]);
        }}
        user={{
          _id: currentUser?.uid || "1",
          name: currentUser?.displayName || "You",
        }}
        keyboardAvoidingViewProps={{
          keyboardVerticalOffset: headerHeight + customHeaderHeight,
        }}
        isAlignedTop
        isSendButtonAlwaysVisible
        textInputProps={{
          style: isDark && { backgroundColor: "#2a2a2a", color: "#fff" },
          onChangeText: setText,
        }}
        renderSend={(props) => (
          <Send {...props} isTextOptional={true}>
            <View
              style={{
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
                marginVertical: 10,
                backgroundColor: backgroundColor,
                borderRadius: 22,
              }}
            >
              <Ionicons name="send" size={22} color={iconColor} />
            </View>
          </Send>
        )}
        renderInputToolbar={(props) => (
          <View>
            {images.length > 0 && (
              <View
                style={{
                  height: 85,
                  justifyContent: "center",
                }}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                    alignItems: "center",
                  }}
                >
                  {images.map((img, index) => (
                    <View
                      key={index}
                      style={{
                        position: "relative",
                        marginRight: 10,
                      }}
                    >
                      <Image
                        source={{ uri: img }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 10,
                        }}
                        contentFit="cover"
                      />

                      <TouchableOpacity
                        onPress={() =>
                          setImages((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          backgroundColor: "white",
                          borderRadius: 10,
                          padding: 2,
                        }}
                      >
                        <Ionicons name="close" size={12} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: backgroundColor,
                height: 60,
              }}
              renderActions={() => (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 10,
                    borderRadius: 20,
                    backgroundColor: buttonBackgroundColor,
                    marginVertical: 10,
                  }}
                  onPress={pickImage}
                >
                  <Ionicons name="image" size={22} color={iconColor} />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputProps={{
              style: {
                backgroundColor: buttonBackgroundColor,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 8,
                color: isDark ? "white" : "black",
                marginHorizontal: 8,
                minHeight: 38,
                marginVertical: 10,
              },
              onChangeText: setText,
              placeholder: "Type a message...",
              placeholderTextColor: textColor,
            }}
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 0,
              },
              left: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 16,
              },
            }}
          />
        )}
      />
    </View>
  );
}
