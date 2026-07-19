import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  messages,
  onReply,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          No messages yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-6 space-y-3">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          onReply={onReply}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}