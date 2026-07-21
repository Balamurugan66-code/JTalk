export default function ReplyPreview({
  replyTo,
  isMine = false,
}) {
  if (!replyTo) return null;

  const getPreview = () => {
    if (replyTo.deleted) {
      return "🚫 This message was deleted";
    }

    if (replyTo.text) {
      return replyTo.text;
    }

    if (replyTo.attachment?.fileType) {
      const type = replyTo.attachment.fileType;

      if (type.startsWith("image/")) return "📷 Photo";
      if (type.startsWith("video/")) return "🎥 Video";
      if (type.startsWith("audio/")) return "🎵 Audio";

      if (type === "application/pdf") return "📄 PDF";

      if (
        type.includes("word") ||
        type.includes("document")
      ) {
        return "📝 Document";
      }

      if (
        type.includes("excel") ||
        type.includes("sheet")
      ) {
        return "📊 Spreadsheet";
      }

      if (
        type.includes("powerpoint") ||
        type.includes("presentation")
      ) {
        return "📽 Presentation";
      }

      if (
        type.includes("zip") ||
        type.includes("rar") ||
        type.includes("compressed")
      ) {
        return "🗜 Archive";
      }

      return "📎 Attachment";
    }

    if (replyTo.image) {
      return "📷 Photo";
    }

    return "📎 Attachment";
  };

  return (
    <div
      className={`mb-2 border-l-4 pl-2 rounded ${
        isMine
          ? "border-blue-200 bg-blue-500"
          : "border-blue-100 bg-gray-100"
      }`}
    >
      <p className="text-xs font-semibold">
        {replyTo.sender?.name || "Unknown"}
      </p>

      <p className="text-xs truncate">
        {getPreview()}
      </p>
    </div>
  );
}