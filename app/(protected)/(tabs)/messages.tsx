import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebaseConfig";
import { useThemeColor } from "@/hooks/use-theme-color";
import { timeAgo } from "@/hooks/useTime";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface User {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: Timestamp;
}

export default function MessagesScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const currentUser = useAuth()?.user;
  const [chatUsers, setChatUsers] = useState([] as User[]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentUser?.uid),
    );
    const users: User[] = [];

    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();

      const otherUserId = data.participants.find(
        (uid: string) => uid !== currentUser?.uid,
      );

      if (!otherUserId) continue;

      const userRef = doc(db, "users", otherUserId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        users.push({
          uid: otherUserId,
          name: userData.name ?? "",
          email: userData.email ?? "",
          avatarUrl: userData.avatarUrl ?? "",
          lastMessage: data.lastMessage || "",
          timestamp: data.lastUpdated || Timestamp.now(),
        });
      }
    }

    setChatUsers(users);
  };

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <ScrollView className="flex-1 flex-col gap-4">
        {chatUsers.map((chatUsers) => (
          <TouchableOpacity
            key={chatUsers.uid}
            onPress={() => {
              const chatId = [currentUser?.uid, chatUsers.uid].sort().join("_");
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
    </View>
  );
}
