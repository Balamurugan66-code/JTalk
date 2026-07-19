import { useRef, useState } from "react";
import { sendMessage } from "../services/messageService";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function MessageInput({ selectedUser, onMessageSent }) {
  const [text, setText] = useState("");

  const { socket } = useSocket();
  const { user } = useAuth();

  const typingRef = useRef(false);
  const timeoutRef = useRef(null);

  const handleTyping = (value) => {
    setText(value);

    if (!selectedUser) return;

    // Emit "typing" only once
    if (!typingRef.current) {
      typingRef.current = true;

      socket.emit("typing", {
        senderId: user.id,
        receiverId: selectedUser._id,
      });
    }

    // Reset timer
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      typingRef.current = false;

      socket.emit("stop_typing", {
        senderId: user.id,
        receiverId: selectedUser._id,
      });
    }, 1000);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    if (!selectedUser) return;

    const message = await sendMessage(selectedUser._id, text);

    onMessageSent(message);

    clearTimeout(timeoutRef.current);

    typingRef.current = false;

    socket.emit("stop_typing", {
      senderId: user.id,
      receiverId: selectedUser._id,
    });

    setText("");
  };

  return (
    <div className="bg-white border-t border-gray-300 p-4 flex gap-3">
      <input
        value={text}
        onChange={(e) => handleTyping(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg transition"
      >
        Send
      </button>
    </div>
  );
}