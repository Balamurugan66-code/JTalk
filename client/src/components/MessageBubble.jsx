import { useState, useMemo, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  deleteMessage,
  reactToMessage,
} from "../services/messageService";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export default function MessageBubble({
  message,
  onReply,
}) {
  const { user } = useAuth();

  const [showPicker, setShowPicker] = useState(false);

  const pickerRef = useRef(null);

  const isMine = message.sender._id === user.id;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const groupedReactions = useMemo(() => {
    const grouped = {};

    (message.reactions || []).forEach((reaction) => {
      if (!grouped[reaction.emoji]) {
        grouped[reaction.emoji] = {
          count: 0,
          mine: false,
        };
      }

      grouped[reaction.emoji].count++;

      const reactionUser =
        typeof reaction.user === "object"
          ? reaction.user._id
          : reaction.user;

      if (reactionUser === user.id) {
        grouped[reaction.emoji].mine = true;
      }
    });

    return Object.entries(grouped);
  }, [message.reactions, user.id]);

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Delete this message for everyone?"
      )
    )
      return;

    try {
      await deleteMessage(message._id);

      message.deleted = true;
      message.text = "";
      message.image = "";
    } catch (err) {
      console.error(err);
    }
  };

  const handleReaction = async (emoji) => {
    try {
      await reactToMessage(message._id, emoji);
      setShowPicker(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatus = () => {
    switch (message.status) {
      case "seen":
        return (
          <span className="text-blue-300 font-semibold">
            ✓✓
          </span>
        );

      case "delivered":
        return "✓✓";

      default:
        return "✓";
    }
  };

  return (
    <div
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        onDoubleClick={() =>
          !message.deleted && onReply(message)
        }
        className={`group relative max-w-[70%] px-4 py-2 rounded-2xl shadow cursor-pointer ${
          isMine
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-900 rounded-bl-md"
        }`}
      >
        {!message.deleted && (
          <button
            onClick={() =>
              setShowPicker(!showPicker)
            }
            className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition bg-white rounded-full shadow px-1 text-sm"
          >
            😊
          </button>
        )}

        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute -top-12 left-0 bg-white rounded-full shadow-lg px-2 py-1 flex gap-1 z-50 animate-[fadeIn_.15s_ease]"
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() =>
                  handleReaction(emoji)
                }
                className="hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {isMine && !message.deleted && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100"
          >
            🗑
          </button>
        )}

        {message.replyTo && (
          <div
            className={`mb-2 border-l-4 pl-2 rounded ${
              isMine
                ? "border-blue-200 bg-blue-500"
                : "border-blue-100"
            }`}
          >
            <p className="text-xs font-semibold">
              {message.replyTo.sender.name}
            </p>

            <p className="text-xs truncate">
              {message.replyTo.deleted
                ? "🚫 This message was deleted"
                : message.replyTo.text ||
                  (message.replyTo.image
                    ? "📷 Photo"
                    : "")}
            </p>
          </div>
        )}

        {message.deleted ? (
          <p className="italic text-sm opacity-70">
            🚫{" "}
            {isMine
              ? "You deleted this message"
              : "This message was deleted"}
          </p>
        ) : (
          <>
            {message.image && (
              <img
                src={message.image}
                alt="Shared"
                className="rounded-xl mb-2 max-w-full max-h-80 object-cover border"
              />

            )}

            {message.text && <p>{message.text}</p>}
          </>
        )}

        {groupedReactions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {groupedReactions.map(
              ([emoji, data]) => (
                <button
                  key={emoji}
                  onClick={() =>
                    handleReaction(emoji)
                  }
                  className={`px-2 py-0.5 rounded-full border text-xs transition ${
                    data.mine
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-white text-black"
                  }`}
                >
                  {emoji} {data.count}
                </button>
              )
            )}
          </div>
        )}

        <div
          className={`mt-1 flex items-center gap-1 text-[10px] ${
            isMine
              ? "text-blue-100"
              : "text-gray-500"
          }`}
        >
          <span>
            {new Date(
              message.createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isMine && <span>{getStatus()}</span>}
        </div>
      </div>
    </div>
  );
}