import { useEffect, useState, useCallback } from "react";
import { getConversations } from "../services/conversationService";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useSocket } from "../context/SocketContext";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const { onlineUsers } = useSocket();

  const loadConversations = useCallback(async () => {
    const data = await getConversations();

    const updated = data.map((conversation) => ({
      ...conversation,
      isOnline: onlineUsers.includes(conversation._id),
    }));

    setConversations(updated);

    setSelectedConversation((prev) => {
      if (!prev) return null;

      return (
        updated.find((conversation) => conversation._id === prev._id) || null
      );
    });
  }, [onlineUsers]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar
        users={conversations}
        selectedUser={selectedConversation}
        onSelect={setSelectedConversation}
      />

      <ChatWindow
        user={selectedConversation}
        refreshConversations={loadConversations}
      />
    </div>
  );
}