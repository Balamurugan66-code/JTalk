import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    const isAudio = file.mimetype.startsWith("audio/");

    return {
      folder: "JTalk",

      // Images & Videos use their own resource types.
      // Everything else (PDF, DOCX, ZIP, etc.) goes as "raw".
      resource_type: isImage
        ? "image"
        : isVideo
        ? "video"
        : isAudio
        ? "video"
        : "raw",

      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      // Images
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",

      // Documents
      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      "application/vnd.ms-powerpoint",

      "application/vnd.openxmlformats-officedocument.presentationml.presentation",

      "application/vnd.ms-excel",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "text/plain",

      "application/zip",

      "application/x-zip-compressed",

      // Audio
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",

      // Video
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file type: ${file.mimetype}`
        )
      );
    }
  },
});

export default cloudinary;