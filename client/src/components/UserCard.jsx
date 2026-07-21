import { useSocket } from "../context/SocketContext";

export default function UserCard({
  user,
  onSelect,
  isSelected,
}) {
  const { typingUsers } = useSocket();

  const isTyping = !!typingUsers[user._id];

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getLastMessagePreview = () => {
    if (!user.lastMessage) {
      return "No messages yet";
    }

    const isPhoto =
      typeof user.lastMessage === "object" &&
      user.lastMessage.image;

    if (isPhoto) {
      if (user.lastMessage.text?.trim()) {
        return `📷 Photo • ${user.lastMessage.text}`;
      }

      return "📷 Photo";
    }

    return typeof user.lastMessage === "object"
      ? user.lastMessage.text
      : user.lastMessage;
  };

  return (
    <div
      onClick={() => onSelect(user)}
      className={`flex items-center gap-3 p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-blue-50 border-l-4 border-l-blue-600"
          : "hover:bg-gray-100 border-l-4 border-l-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
            user.isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold truncate">
            {user.name}
          </h3>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-xs text-gray-400">
              {formatTime(user.lastMessageTime)}
            </span>

            {user.unreadCount > 0 && (
              <span className="min-w-[20px] h-5 px-1 rounded-full bg-green-500 text-white text-[11px] flex items-center justify-center font-semibold">
                {user.unreadCount}
              </span>
            )}
          </div>
        </div>

        {isTyping ? (
          <p className="text-sm text-blue-600 italic truncate">
            Typing...
          </p>
        ) : (
          <p className="text-sm text-gray-500 truncate">
            {user.lastMessageSender === "me" ? "You: " : ""}
            {getLastMessagePreview()}
          </p>
        )}
      </div>
    </div>
  );
}