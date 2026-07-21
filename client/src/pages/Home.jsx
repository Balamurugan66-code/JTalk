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
    try {
      const data = await getConversations();

      const updated = data.map((conversation) => ({
        ...conversation,
        isOnline: onlineUsers.includes(conversation._id),
      }));

      setConversations(updated);

      setSelectedConversation((prev) => {
        if (!prev) return null;

        return (
          updated.find(
            (conversation) => conversation._id === prev._id
          ) || null
        );
      });
    } catch (err) {
      console.error(err);
    }
  }, [onlineUsers]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedConversation) return;

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation._id === selectedConversation._id
          ? {
              ...conversation,
              unreadCount: 0,
            }
          : conversation
      )
    );
  }, [selectedConversation]);

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
  setSelectedConversation={setSelectedConversation}
  onGroupDeleted={() => {
    setSelectedConversation(null);
    loadConversations();
  }}
/>
    </div>
  );
}