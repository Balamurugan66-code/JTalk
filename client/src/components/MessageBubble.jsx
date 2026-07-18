import { useAuth } from "../context/AuthContext";

export default function MessageBubble({ message }) {
  const { user } = useAuth();

  const isMine = message.sender._id === user.id;

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

        <p
          className={`text-[10px] mt-1 ${
            isMine ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}