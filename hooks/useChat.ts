import { db } from "@/firebaseConfig";
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
  updateDoc
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { IMessage } from "react-native-gifted-chat";

const DEFAULT_PFP =
  "https://firebasestorage.googleapis.com/v0/b/titanfind-806b8.firebasestorage.app/o/avatars%2FDEFAULT_PFP.png?alt=media&token=2c4ed3fe-bf09-4ee9-a1f6-0684e7ef1d03";

// Custom hook to manage chat messages and sending
export function useChat(
  conversationId: string,
  currentUser: any,
  posterId: string,
) {
  const [messages, setMessages] = useState<IMessage[]>([]);

  // listen messages
  useEffect(() => {
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const formattedMessages = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toDate(),
          user: {
            _id: data.senderId,
            name: data.senderName || "Unknown",
            avatar: data.senderAvatar || DEFAULT_PFP,
          },
        };
      });

      setMessages(formattedMessages);
    });

    return unsubscribe;
  }, [conversationId]);

  // mark messages as read
  useEffect(() => {
    if (!currentUser || !conversationId) return;
    // reference to the conversation document
    const conversationRef = doc(db, "conversations", conversationId);
    // update unread count for current user to 0
    updateDoc(conversationRef, {
      [`unreadCounts.${currentUser.uid}`]: 0,
    });
  }, [currentUser, conversationId]);

  // send message
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!currentUser || !conversationId) return;

      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
        "messages",
      );
      const conversationRef = doc(db, "conversations", conversationId);

      const messagePayload = {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || "Unknown",
        senderAvatar: currentUser.photoURL || DEFAULT_PFP,
        text: messageText,
        type: "text",
        createdAt: serverTimestamp(),
        isRead: false,
      };

      await addDoc(messagesRef, messagePayload);

      // ensure doc exists
      await setDoc(
        conversationRef,
        {
          participants: [currentUser.uid, posterId],
        },
        { merge: true },
      );

      // update last message, timestamp, and increment unread count for the other user
      await updateDoc(conversationRef, {
        lastMessage: messageText,
        lastUpdated: serverTimestamp(),
        lastMessageSenderId: currentUser.uid,
        [`unreadCounts.${posterId}`]: increment(1),
      });
    },
    [currentUser, conversationId, posterId],
  );

  return { messages, sendMessage };
}
