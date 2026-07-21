import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  deleteMessage,
  reactToMessage,
} from "../services/messageService";

import ReplyPreview from "./ReplyPreview";
import ReactionBar from "./ReactionBar";
import MessageContent from "./MessageContent";

export default function MessageBubble({
  message,
  onReply,
  isGroup = false,
}) {
  const { user } = useAuth();

  const isMine = message.sender._id === user.id;

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Delete this message for everyone?"
      )
    ) {
      return;
    }

    try {
      await deleteMessage(message._id);

      message.deleted = true;
      message.text = "";
      message.image = "";

      if (message.attachment) {
        message.attachment = null;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReaction = async (emoji) => {
    try {
      await reactToMessage(message._id, emoji);
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
        isMine
          ? "justify-end"
          : "justify-start"
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
        <ReactionBar
          message={message}
          userId={user.id}
          onReact={handleReaction}
        />

        {isMine && !message.deleted && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100"
          >
            🗑
          </button>
        )}

        <ReplyPreview
          replyTo={message.replyTo}
          isMine={isMine}
        />

        <MessageContent
          message={message}
          isMine={isMine}
          isGroup={isGroup}
        />
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

          {isMine && (
            <span>{getStatus()}</span>
          )}
        </div>
      </div>
    </div>
  );
}