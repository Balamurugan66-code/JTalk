import React from "react";

export default function AttachmentRenderer({
  attachment,
  isMine = false,
}) {
  if (!attachment || !attachment.url) return null;

  const fileType = attachment.fileType || "";
  const fileName = attachment.fileName || "Attachment";

  const formatSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // IMAGE
  if (fileType.startsWith("image/")) {
    return (
      <img
        src={attachment.url}
        alt={fileName}
        className="rounded-xl mb-2 max-w-full max-h-80 object-cover border"
      />
    );
  }

  // VIDEO
  if (fileType.startsWith("video/")) {
    return (
      <video controls className="rounded-xl mb-2 max-w-full border">
        <source src={attachment.url} type={fileType} />
        Your browser does not support video playback.
      </video>
    );
  }

  // AUDIO
  if (fileType.startsWith("audio/")) {
    return (
      <audio controls className="w-full mb-2">
        <source src={attachment.url} type={fileType} />
        Your browser does not support audio playback.
      </audio>
    );
  }

  let icon = "📎";

  if (fileType === "application/pdf") icon = "📕";
  else if (
    fileType.includes("word") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  )
    icon = "📘";
  else if (
    fileType.includes("excel") ||
    fileType.includes("sheet") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  )
    icon = "📗";
  else if (
    fileType.includes("powerpoint") ||
    fileType.includes("presentation") ||
    fileName.endsWith(".ppt") ||
    fileName.endsWith(".pptx")
  )
    icon = "📙";
  else if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    fileType.includes("7z") ||
    fileType.includes("compressed")
  )
    icon = "🗜️";

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-3 mb-2 rounded-xl border transition ${
        isMine
          ? "bg-blue-500 border-blue-400 hover:bg-blue-400"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      <div className="text-4xl">{icon}</div>

      <div className="flex-1 overflow-hidden">
        <p
          className={`font-semibold truncate ${
            isMine ? "text-white" : "text-gray-900"
          }`}
        >
          {fileName}
        </p>

        <p
          className={`text-xs ${
            isMine ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {fileType || "Unknown"} • {formatSize(attachment.size)}
        </p>
      </div>

      <div
        className={`font-semibold whitespace-nowrap ${
          isMine ? "text-white" : "text-blue-600"
        }`}
      >
        Open
      </div>
    </a>
  );
}