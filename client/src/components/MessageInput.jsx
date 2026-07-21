import { useRef, useState } from "react";
import {
  sendMessage,
  sendGroupMessage,
} from "../services/messageService";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function MessageInput({
  selectedUser,
  onMessageSent,
  replyMessage,
  onCancelReply,
  chatType = "user",
  groupId = null,
}) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null);

  const fileInputRef = useRef(null);

  const { socket } = useSocket();
  const { user } = useAuth();

  const typingRef = useRef(false);
  const timeoutRef = useRef(null);

  const handleTyping = (value) => {
    setText(value);

    // ==========================
    // GROUP CHAT
    // ==========================
    if (chatType === "group") {
      if (!groupId) return;

      if (!typingRef.current) {
        typingRef.current = true;

        socket.emit("typing_group", {
          groupId,
          sender: user,
        });
      }

      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        typingRef.current = false;

        socket.emit("stop_typing_group", {
          groupId,
        });
      }, 1000);

      return;
    }

    // ==========================
    // DIRECT CHAT
    // ==========================
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
    if (!text.trim() && !attachment) return;

    let message;

    // ==========================
    // GROUP CHAT
    // ==========================
    if (chatType === "group") {
      message = await sendGroupMessage(
        groupId,
        text,
        attachment,
        replyMessage?._id
      );

      socket.emit("send_group_message", {
        groupId,
        message,
      });

      socket.emit("stop_typing_group", {
        groupId,
      });
    }

    // ==========================
    // DIRECT CHAT
    // ==========================
    else {
      if (!selectedUser) return;

      message = await sendMessage(
        selectedUser._id,
        text,
        replyMessage?._id,
        attachment
      );

      socket.emit("stop_typing", {
        senderId: user.id,
        receiverId: selectedUser._id,
      });
    }

    onMessageSent(message);

    clearTimeout(timeoutRef.current);
    typingRef.current = false;

    setText("");
    setAttachment(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onCancelReply?.();
  };

  const isImage =
    attachment && attachment.type.startsWith("image/");

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

      {attachment && (
        <div className="px-4 pt-3">
          {isImage ? (
            <img
              src={URL.createObjectURL(attachment)}
              alt="Preview"
              className="w-28 h-28 object-cover rounded-lg border"
            />
          ) : (
            <div className="border rounded-lg p-3 bg-gray-50 flex items-center gap-3">
              <span className="text-3xl">📎</span>

              <div className="overflow-hidden">
                <p className="font-medium truncate">
                  {attachment.name}
                </p>

                <p className="text-xs text-gray-500">
                  {(attachment.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current.click()}
          className="text-2xl"
          title="Attach file"
        >
          📎
        </button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => {
            if (e.target.files.length > 0) {
              setAttachment(e.target.files[0]);
            }
          }}
        />

        <input
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}