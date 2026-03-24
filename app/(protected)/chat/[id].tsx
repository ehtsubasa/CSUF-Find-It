import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebaseConfig";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
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
  const [messages, setMessages] = useState<IMessage[]>([] as IMessage[]);
  const inset = useSafeAreaInsets();
  const [text, setText] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUser = useAuth()?.user;
  const headerHeight = useHeaderHeight();
  const { posterId } = useLocalSearchParams<{ posterId: string }>();

  useEffect(() => {
    const q = query(
      collection(db, "conversations", id, "messages"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toDate(),
          user: {
            _id: data.senderId,
          },
        };
      });

      setMessages(msgs);
    });

    return unsubscribe;
  }, [id]);

  const onSend = useCallback(async (messages: IMessage[] = []) => {
    const message = messages[0];
    if (!message || !id || !currentUser) return;
    try {
      const messagesRef = collection(db, "conversations", id, "messages");
      const conversationRef = doc(db, "conversations", id);

      // Write message to subcollection
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: message.text,
        type: "text",
        createdAt: serverTimestamp(),
        isRead: false,
      });

      // Update parent conversation
      await setDoc(
        conversationRef,
        {
          participants: [currentUser.uid, posterId],
          lastMessage: message.text,
          lastUpdated: serverTimestamp(),
          lastMessageSenderId: currentUser.uid,
          unreadCount: increment(1),
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, []);

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
        onSend={(messages: any) => onSend(messages)}
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
