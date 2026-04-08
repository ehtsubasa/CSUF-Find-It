import { DEFAULT_AVATAR } from "@/constants/user";
import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { IMessage } from "react-native-gifted-chat";
import { useItemsActions } from "./useItemsActions";

// Custom hook to manage chat messages and sending
export function useChat(
  conversationId: string,
  currentUser: any,
  posterId: string,
  startInDraft = false,
) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversationExists, setConversationExists] = useState(!startInDraft);
  const { uploadImage } = useItemsActions();

  // Check if conversation exists on mount if starting in draft mode
  useEffect(() => {
    if (
      !startInDraft ||
      !conversationId ||
      !currentUser ||
      conversationExists
    ) {
      return;
    }

    let isCancelled = false;

    const checkExistingConversation = async () => {
      try {
        // Check if conversation doc exists - if it does, we can switch out of draft mode and load messages
        const snap = await getDoc(doc(db, "conversations", conversationId));
        if (!isCancelled && snap.exists()) {
          setConversationExists(true);
        }
      } catch (error: any) {
        if (error?.code !== "permission-denied") {
          console.error("Failed to check conversation:", error);
        }
      }
    };

    checkExistingConversation();

    return () => {
      isCancelled = true;
    };
  }, [startInDraft, conversationId, currentUser, conversationExists]);

  // subscribe to messages in conversation
  useEffect(() => {
    if (!conversationId || !currentUser) return;
    if (!conversationExists) return;

    const convoRef = doc(db, "conversations", conversationId);
    let unsubscribeMessages: (() => void) | undefined;

    const unsubscribeConversation = onSnapshot(
      convoRef,
      (snap) => {
        if (!snap.exists()) {
          setConversationExists(false);
          setMessages([]);
          return;
        }

        setConversationExists(true);

        unsubscribeMessages?.();

        const q = query(
          collection(db, "conversations", conversationId, "messages"),
          orderBy("createdAt", "desc"),
        );

        unsubscribeMessages = onSnapshot(q, (snapshot) => {
          const formattedMessages = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              _id: doc.id,
              text: data.text,
              createdAt: data.createdAt?.toDate() || new Date(),
              user: {
                _id: data.senderId,
                name: data.senderName || "Unknown",
                avatar: data.senderAvatar || DEFAULT_AVATAR,
              },
              item: data.item || null,
              type: data.type || "text",
              image: data.image || null,
            };
          });

          setMessages(formattedMessages);
        });
      },
      () => {
        setMessages([]);
      },
    );

    return () => {
      unsubscribeMessages?.();
      unsubscribeConversation();
    };
  }, [conversationId, currentUser, conversationExists]);

  // mark messages as read
  useEffect(() => {
    const markAsRead = async () => {
      if (!currentUser || !conversationId || !conversationExists) {
        return;
      }

      const conversationRef = doc(db, "conversations", conversationId);

      // mark messages as read
      await setDoc(
        conversationRef,
        {
          [`unreadCounts.${currentUser.uid}`]: 0,
        },
        { merge: true },
      );
    };

    markAsRead();
  }, [currentUser, conversationId, conversationExists]);

  // send message
  const sendMessage = useCallback(
    async (messageText: string, imageUri?: string[]) => {
      if (!currentUser || !conversationId || !posterId) {
        Alert.alert("Error", "Missing user or conversation information");
        return;
      }

      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
        "messages",
      );
      const conversationRef = doc(db, "conversations", conversationId);
      const uploadedPhotoUrls = await uploadImage(
        imageUri || [],
        currentUser.uid,
        "conversations",
      );
      // ensure doc exists
      await setDoc(
        conversationRef,
        {
          participants: [currentUser.uid, posterId].sort(),
        },
        { merge: true },
      );
      setConversationExists(true);

      const messagePayload = {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || "Unknown",
        senderAvatar: currentUser.photoURL || DEFAULT_AVATAR,
        text: messageText || "",
        type: imageUri && imageUri.length > 0 ? "image" : "text", // if there are images, set type to "image"
        image: uploadedPhotoUrls[0] || null,
        createdAt: serverTimestamp(),
      };

      await addDoc(messagesRef, messagePayload);

      // update last message, timestamp, and increment unread count for the other user
      await setDoc(
        conversationRef,
        {
          lastMessage:
            messageText ||
            (imageUri && imageUri.length > 0 ? "Sent an image" : ""),
          lastUpdated: serverTimestamp(),
          lastMessageSenderId: currentUser.uid,
          [`unreadCounts.${posterId}`]: increment(1),
        },
        { merge: true },
      );
    },
    [currentUser, conversationId, posterId, uploadImage],
  );

  return { messages, sendMessage, conversationExists };
}
