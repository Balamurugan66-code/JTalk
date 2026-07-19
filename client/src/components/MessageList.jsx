import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  messages,
  onReply,
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [isNearBottom, setIsNearBottom] = useState(true);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const threshold = 100;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsNearBottom(distanceFromBottom < threshold);
  };

  useEffect(() => {
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, isNearBottom]);

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
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto bg-gray-100 p-6 space-y-3"
    >
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