import { createContext, useContext, useEffect } from "react";
import socket from "../services/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("register", user.id);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}