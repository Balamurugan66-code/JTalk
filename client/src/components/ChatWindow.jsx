import { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { getMessages } from "../services/messageService";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function ChatWindow({ user }) {
  const [messages, setMessages] = useState([]);

  const { socket, typingUsers } = useSocket();
  const { user: currentUser } = useAuth();

  const isTyping = user ? !!typingUsers[user._id] : false;

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  // Load chat history whenever a different user is selected
  useEffect(() => {
    if (!user) return;

    async function loadChat() {
      const msgs = await getMessages(user._id);
      setMessages(msgs);
    }

    loadChat();
  }, [user]);

  // Add newly sent message immediately
  const handleMessageSent = (message) => {
    setMessages((prev) => [...prev, message]);

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

      <MessageList messages={messages} />

      <MessageInput
        selectedUser={user}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}