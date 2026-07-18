import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const data = await getUsers();
      setUsers(data);
    }

    loadUsers();
  }, []);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar
        users={users}
        onSelect={setSelectedUser}
      />

      <ChatWindow
        user={selectedUser}
      />
    </div>
  );
}