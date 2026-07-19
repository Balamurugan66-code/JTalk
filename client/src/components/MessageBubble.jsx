import { useAuth } from "../context/AuthContext";
import { deleteMessage } from "../services/messageService";

export default function MessageBubble({
  message,
  onReply,
}) {
  const { user } = useAuth();

  const isMine = message.sender._id === user.id;

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Delete this message for everyone?"
    );

    if (!confirmDelete) return;

    try {
      await deleteMessage(message._id);

      message.deleted = true;
      message.text = "";
      message.image = "";
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
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
        className={`relative max-w-[70%] px-4 py-2 rounded-2xl shadow cursor-pointer ${
          isMine
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-900 rounded-bl-md"
        }`}
      >
        {isMine && !message.deleted && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100"
            title="Delete for Everyone"
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
                  (message.replyTo.image ? "📷 Photo" : "")}
            </p>
          </div>
        )}

        {message.deleted ? (
          <p className="italic text-sm opacity-70">
            🚫 {isMine
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