import { useAuth } from "../context/AuthContext";

export default function MessageBubble({
  message,
  onReply,
}) {
  const { user } = useAuth();

  const isMine = message.sender._id === user.id;

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
        onDoubleClick={() => onReply(message)}
        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow cursor-pointer ${
          isMine
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-900 rounded-bl-md"
        }`}
      >
        {message.replyTo && (
          <div
            className={`mb-2 border-l-4 pl-2 rounded ${
              isMine
                ? "border-blue-200 bg-blue-500"
                : "border-blue-500 bg-gray-100"
            }`}
          >
            <p className="text-xs font-semibold">
              {message.replyTo.sender.name}
            </p>

            <p className="text-xs truncate">
              {message.replyTo.text}
            </p>
          </div>
        )}

        <p>{message.text}</p>

        <div
          className={`mt-1 flex items-center gap-1 text-[10px] ${
            isMine ? "text-blue-100" : "text-gray-500"
          }`}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
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