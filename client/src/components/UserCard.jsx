import { useSocket } from "../context/SocketContext";

export default function UserCard({
  user,
  onSelect,
  isSelected,
}) {
  const { typingUsers } = useSocket();

  const isTyping = !!typingUsers[user._id];

  return (
    <div
      onClick={() => onSelect(user)}
      className={`flex items-center gap-3 p-4 border-b border-gray-200 cursor-pointer transition-all duration-200
      ${
        isSelected
          ? "bg-blue-50 border-l-4 border-l-blue-600"
          : "hover:bg-gray-100 border-l-4 border-l-transparent"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* Online Status */}
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
            user.isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">
          {user.name}
        </h3>

        {isTyping ? (
          <p className="text-sm text-blue-600 italic truncate">
            Typing...
          </p>
        ) : (
          <p className="text-sm text-gray-500 truncate">
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
}