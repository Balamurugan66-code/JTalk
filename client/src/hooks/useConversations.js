import { useState } from "react";

export default function useConversations(initialConversations = []) {
  const [conversations, setConversations] = useState(initialConversations);

  const updateConversation = (message, currentUserId) => {
    const otherUserId =
      message.sender === currentUserId
        ? message.receiver
        : message.sender;

    setConversations((prev) => {
      const updated = prev.map((conversation) => {
        if (conversation._id !== otherUserId) {
          return conversation;
        }

        return {
          ...conversation,
          lastMessage: message.text,
          lastMessageSender:
            message.sender === currentUserId ? "me" : "them",
          lastMessageTime: message.createdAt,
        };
      });

      updated.sort(
        (a, b) =>
          new Date(b.lastMessageTime || 0) -
          new Date(a.lastMessageTime || 0)
      );

      return updated;
    });
  };

  return {
    conversations,
    setConversations,
    updateConversation,
  };
}