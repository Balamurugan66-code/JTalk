import { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { getMessages } from "../services/messageService";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function ChatWindow({
  user,
  refreshConversations,
}) {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);

  const { socket, typingUsers } = useSocket();
  const { user: currentUser } = useAuth();

  const isTyping = user ? !!typingUsers[user._id] : false;

  useEffect(() => {
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
        user &&
        ((senderId === user._id && receiverId === currentUser.id) ||
          (senderId === currentUser.id && receiverId === user._id))
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

    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_seen", handleMessagesSeen);
    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_seen", handleMessagesSeen);
      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [socket, user, currentUser, refreshConversations]);

  useEffect(() => {
    if (!user) return;

    async function loadChat() {
      const msgs = await getMessages(user._id);
      setMessages(msgs);
    }

    loadChat();
  }, [user]);

  const handleMessageSent = async (message) => {
    setMessages((prev) => [...prev, message]);

    setReplyMessage(null);

    await refreshConversations();

    socket.emit("stop_typing", {
      senderId: currentUser.id,
      receiverId: user._id,
    });
  };

  if (!user) {
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
        user={user}
        isTyping={isTyping}
      />

      <MessageList
        messages={messages}
        onReply={setReplyMessage}
      />

      <MessageInput
        selectedUser={user}
        onMessageSent={handleMessageSent}
        replyMessage={replyMessage}
        onCancelReply={() => setReplyMessage(null)}
      />
    </div>
  );
}