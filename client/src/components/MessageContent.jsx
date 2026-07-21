import AttachmentRenderer from "./AttachmentRenderer";

export default function MessageContent({
  message,
  isMine,
  isGroup = false,
}) {
  if (message.deleted) {
    return (
      <p className="italic text-sm opacity-70">
        🚫{" "}
        {isMine
          ? "You deleted this message"
          : "This message was deleted"}
      </p>
    );
  }

  return (
    <>
      {isGroup && !isMine && (
        <p className="text-xs font-semibold text-purple-600 mb-1">
          {message.sender?.name}
        </p>
      )}

      {message.attachment?.url ? (
        <AttachmentRenderer
          attachment={message.attachment}
          isMine={isMine}
        />
      ) : (
        message.image && (
          <img
            src={message.image}
            alt="Shared"
            className="rounded-xl mb-2 max-w-full max-h-80 object-cover border"
          />
        )
      )}

      {message.text && (
        <p className="break-words whitespace-pre-wrap">
          {message.text}
        </p>
      )}
    </>
  );
}