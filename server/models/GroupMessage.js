import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emoji: {
      type: String,
      required: true,
      enum: ["👍", "❤️", "😂", "😮", "😢", "😡"],
    },
  },
  {
    _id: false,
  }
);

const attachmentSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },

    size: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const groupMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    text: {
      type: String,
      default: "",
      trim: true,
    },

    // Existing image support (kept for compatibility)
    image: {
      type: String,
      default: "",
    },

    // New universal attachment
    attachment: {
      type: attachmentSchema,
      default: () => ({}),
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupMessage",
      default: null,
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reactions: {
      type: [reactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "GroupMessage",
  groupMessageSchema
);