import { useState } from "react";
import { sendMessage } from "../services/messageService";

export default function MessageInput({ selectedUser, onMessageSent }) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;
    if (!selectedUser) return;

    const message = await sendMessage(selectedUser._id, text);

    onMessageSent(message);

    setText("");
  };

  return (
    <div className="bg-white border-t border-gray-300 p-4 flex gap-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
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