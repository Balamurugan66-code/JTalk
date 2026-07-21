import { useEffect, useMemo, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { getMessages } from "../services/messageService";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function ChatWindow({
  user,
  refreshConversations,
  setSelectedConversation,
}) {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);

  const { socket, typingUsers, onlineUsers } = useSocket();
  const { user: currentUser } = useAuth();

  const liveUser = useMemo(() => {
    if (!user) return null;

    return {
      ...user,
      isOnline: onlineUsers.includes(user._id),
    };
  }, [user, onlineUsers]);

  const isTyping = liveUser
    ? !!typingUsers[liveUser._id]
    : false;

  useEffect(() => {
    if (!liveUser || !currentUser) return;

    const handleReceiveMessage = (message) => {
      const senderId =
        typeof message.sender === "object"
          ? message.sender._id
          : message.sender;

      const receiverId =
        typeof message.receiver === "object"
          ? message.receiver._id
          : message.receiver;

      if (
        (senderId === liveUser._id &&
          receiverId === currentUser.id) ||
        (senderId === currentUser.id &&
          receiverId === liveUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }

      refreshConversations();
    };

    const handleMessagesSeen = () => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender._id === currentUser.id
            ? { ...msg, status: "seen" }
            : msg
        )
      );

      refreshConversations();
    };

    const handleMessageDeleted = (messageId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                deleted: true,
                text: "",
                image: "",
              }
            : msg
        )
      );

      refreshConversations();
    };

    const handleMessageReacted = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id
            ? updatedMessage
            : msg
        )
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_seen", handleMessagesSeen);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_reacted", handleMessageReacted);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_seen", handleMessagesSeen);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_reacted", handleMessageReacted);
    };
  }, [
    socket,
    liveUser?._id,
    currentUser?.id,
    refreshConversations,
  ]);

  useEffect(() => {
    if (!liveUser) return;

    async function loadChat() {
      try {
        const msgs = await getMessages(liveUser._id);
        setMessages(msgs);
      } catch (err) {
        console.error(err);
      }
    }

    loadChat();
  }, [liveUser?._id]);

  useEffect(() => {
    if (!liveUser) return;

    setSelectedConversation((prev) =>
      prev
        ? {
            ...prev,
            isOnline: onlineUsers.includes(prev._id),
          }
        : prev
    );
  }, [
    onlineUsers,
    liveUser?._id,
    setSelectedConversation,
  ]);

  const handleMessageSent = async (message) => {
    setMessages((prev) => [...prev, message]);

    setReplyMessage(null);

    await refreshConversations();

    socket.emit("stop_typing", {
      senderId: currentUser.id,
      receiverId: liveUser._id,
    });
  };

  if (!liveUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <h2 className="text-2xl text-gray-500">
          Select a conversation
        </h2>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader
        user={liveUser}
        isTyping={isTyping}
      />

      <MessageList
        messages={messages}
        onReply={setReplyMessage}
      />

      <MessageInput
        selectedUser={liveUser}
        onMessageSent={handleMessageSent}
        replyMessage={replyMessage}
        onCancelReply={() => setReplyMessage(null)}
      />
    </div>
  );
}