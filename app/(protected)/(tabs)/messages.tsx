import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useConversations } from "@/hooks/useConversations";
import { timeAgo } from "@/hooks/useTime";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MessagesScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const currentUser = useAuth()?.user;
  const { chatUsers } = useConversations(currentUser);

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      {!chatUsers.length ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg" style={{ color: textColor }}>
            No conversations yet
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 flex-col gap-4">
          {chatUsers.map((chatUsers) => (
            <TouchableOpacity
              key={chatUsers.uid}
              onPress={() => {
                const chatId = [currentUser?.uid, chatUsers.uid]
                  .sort()
                  .join("_");
                router.push({
                  pathname: "/chat/[id]",
                  params: {
                    id: chatId,
                    posterName: chatUsers.name,
                    posterId: chatUsers.uid,
                    posterAvatar: encodeURIComponent(chatUsers.avatarUrl),
                  },
                });
              }}
              className="flex-row w-full p-4 rounded-xl text-center justify-between"
            >
              <View className="flex-row items-center gap-4">
                <Image
                  source={chatUsers.avatarUrl}
                  contentFit="cover"
                  transition={1000}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <View className="flex-col">
                  <Text className="text-lg" style={{ color: textColor }}>
                    {chatUsers.name}
                  </Text>
                  <Text className=" text-sm" style={{ color: textColor }}>
                    {chatUsers.lastMessage}
                  </Text>
                </View>
              </View>
              <View className="text-center justify-center">
                <Text className="text-sm" style={{ color: textColor }}>
                  {timeAgo(chatUsers.timestamp.toDate(), {
                    recentLabel: "now",
                    upperCase: false,
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
