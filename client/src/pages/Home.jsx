import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useSocket } from "../context/SocketContext";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const { onlineUsers } = useSocket();

  useEffect(() => {
    async function loadUsers() {
      const data = await getUsers();
      setUsers(data);
    }

    loadUsers();
  }, []);

  // Update users whenever online users change
  useEffect(() => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
        isOnline: onlineUsers.includes(user._id),
      }))
    );

    setSelectedUser((prevSelected) => {
      if (!prevSelected) return prevSelected;

      return {
        ...prevSelected,
        isOnline: onlineUsers.includes(prevSelected._id),
      };
    });
  }, [onlineUsers]);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar
  users={users}
  selectedUser={selectedUser}
  onSelect={setSelectedUser}
/>

      <ChatWindow
        user={selectedUser}
      />
    </div>
  );
}