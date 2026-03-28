import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useChat } from "@/hooks/useChat";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
  useColorScheme,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MessagesDetail() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const buttonBackgroundColor = useThemeColor({}, "buttonBackground");
  const inset = useSafeAreaInsets();
  const [text, setText] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUser = useAuth()?.user;
  const headerHeight = useHeaderHeight();
  const { posterId } = useLocalSearchParams<{ posterId: string }>();
  const { messages, sendMessage } = useChat(id, currentUser, posterId);

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
        onSend={(messages: any) => sendMessage(messages[0].text)}
        user={{
          _id: currentUser?.uid || "1",
          name: currentUser?.displayName || "You",
        }}
        keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
        isAlignedTop
        isSendButtonAlwaysVisible
        textInputProps={{
          style: isDark && { backgroundColor: "#2a2a2a", color: "#fff" },
          onChangeText: setText,
        }}
        renderSend={(props) => (
          <Send {...props}>
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
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: backgroundColor,
              height: 60,
            }}
            renderActions={() => (
              <View
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
              >
                <Ionicons name="add-outline" size={24} color={iconColor} />
              </View>
            )}
          />
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
