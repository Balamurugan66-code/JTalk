export default function ChatHeader({
  user,
  isTyping,
}) {
  const formatLastSeen = (date) => {
    if (!date) return "Offline";

    const lastSeen = new Date(date);
    const now = new Date();

    const diff = Math.floor(
      (now - lastSeen) / 1000
    );

    if (diff < 60) {
      return "Last seen just now";
    }

    if (diff < 3600) {
      return `Last seen ${Math.floor(
        diff / 60
      )} min ago`;
    }

    if (diff < 86400) {
      return `Last seen ${Math.floor(
        diff / 3600
      )} hr ago`;
    }

    return `Last seen ${lastSeen.toLocaleString()}`;
  };

  return (
    <div className="h-20 bg-white border-b border-gray-300 flex items-center px-6 shadow-sm">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
            user.isOnline
              ? "bg-green-500"
              : "bg-gray-400"
          }`}
        />
      </div>

      <div className="ml-4">
        <h2 className="font-semibold text-lg">
          {user.name}
        </h2>

        {isTyping ? (
          <p className="text-sm text-blue-600 italic animate-pulse">
            Typing...
          </p>
        ) : (
          <p
            className={`text-sm font-medium ${
              user.isOnline
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {user.isOnline
              ? "Online"
              : formatLastSeen(user.lastSeen)}
          </p>
        )}
      </div>
    </div>
  );
}