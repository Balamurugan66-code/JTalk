import { useAuth } from "../context/AuthContext";

export default function MessageBubble({ message }) {
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
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${
          isMine
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-900 rounded-bl-md"
        }`}
      >
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