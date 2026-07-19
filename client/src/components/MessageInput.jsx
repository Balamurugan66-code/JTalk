import { useRef, useState } from "react";
import { sendMessage } from "../services/messageService";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function MessageInput({
  selectedUser,
  onMessageSent,
  replyMessage,
  onCancelReply,
}) {
  const [text, setText] = useState("");

  const { socket } = useSocket();
  const { user } = useAuth();

  const typingRef = useRef(false);
  const timeoutRef = useRef(null);

  const handleTyping = (value) => {
    setText(value);

    if (!selectedUser) return;

    if (!typingRef.current) {
      typingRef.current = true;

      socket.emit("typing", {
        senderId: user.id,
        receiverId: selectedUser._id,
      });
    }

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

    const message = await sendMessage(
      selectedUser._id,
      text,
      replyMessage?._id
    );

    onMessageSent(message);

    clearTimeout(timeoutRef.current);

    typingRef.current = false;

    socket.emit("stop_typing", {
      senderId: user.id,
      receiverId: selectedUser._id,
    });

    setText("");

    if (onCancelReply) {
      onCancelReply();
    }
  };

  return (
    <div className="bg-white border-t border-gray-300">
      {replyMessage && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-blue-600">
              Replying to {replyMessage.sender.name}
            </p>

            <p className="text-sm truncate">
              {replyMessage.text}
            </p>
          </div>

          <button
            onClick={onCancelReply}
            className="text-xl text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        </div>
      )}

      <div className="p-4 flex gap-3">
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
    </div>
  );
}