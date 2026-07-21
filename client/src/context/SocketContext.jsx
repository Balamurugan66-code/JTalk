import { createContext, useContext, useEffect, useState } from "react";
import socket from "../services/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  // Socket connection logs
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket Connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Socket Error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    socket.connect();

    console.log("Registering user:", user.id);

    socket.emit("register", user.id);

    socket.on("online_users", (users) => {
      console.log("Online Users:", users);
      setOnlineUsers(users);
    });

    socket.on("typing", ({ senderId }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [senderId]: true,
      }));
    });

    socket.on("stop_typing", ({ senderId }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[senderId];
        return updated;
      });
    });

    return () => {
      socket.off("online_users");
      socket.off("typing");
      socket.off("stop_typing");
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        typingUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}