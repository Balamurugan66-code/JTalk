import Message from "../models/Message.js";
import { io, getReceiverSocketId } from "../sockets/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiver, text, replyTo } = req.body;

    const attachment = req.file
      ? {
          url: req.file.path,
          fileName: req.file.originalname,
          fileType: req.file.mimetype,
          size: req.file.size,
        }
      : null;

    // Backward compatibility
    const image =
      attachment && attachment.fileType.startsWith("image/")
        ? attachment.url
        : "";

    if (!text?.trim() && !attachment) {
      return res.status(400).json({
        message: "Message cannot be empty.",
      });
    }

    const receiverSocketId = getReceiverSocketId(receiver);

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      text: text || "",
      image,
      attachment,
      replyTo: replyTo || null,
      status: receiverSocketId ? "delivered" : "sent",
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name",
        },
      });

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "receive_message",
        populatedMessage
      );
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;

    const allowed = ["👍", "❤️", "😂", "😮", "😢", "😡"];

    if (!allowed.includes(emoji)) {
      return res.status(400).json({
        message: "Invalid reaction.",
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    const existingReaction = message.reactions.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        message.reactions = message.reactions.filter(
          (r) => r.user.toString() !== req.user.id
        );
      } else {
        existingReaction.emoji = emoji;
      }
    } else {
      message.reactions.push({
        user: req.user.id,
        emoji,
      });
    }

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .populate("reactions.user", "name");

    const receiverSocketId = getReceiverSocketId(
      message.receiver.toString()
    );

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "message_reacted",
        populatedMessage
      );
    }

    res.json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can delete only your own messages.",
      });
    }

    message.deleted = true;
    message.deletedAt = new Date();
    message.deletedBy = req.user.id;

    message.text = "";
    message.image = "";
    message.attachment = {
      url: "",
      fileName: "",
      fileType: "",
      size: 0,
    };

    await message.save();

    const receiverSocketId = getReceiverSocketId(
      message.receiver.toString()
    );

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "message_deleted",
        message._id
      );
    }

    res.json({
      success: true,
      messageId: message._id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.updateMany(
      {
        sender: id,
        receiver: req.user.id,
        status: { $ne: "seen" },
      },
      {
        status: "seen",
      }
    );

    const messages = await Message.find({
      $or: [
        {
          sender: req.user.id,
          receiver: id,
        },
        {
          sender: id,
          receiver: req.user.id,
        },
      ],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("reactions.user", "name")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .sort({ createdAt: 1 });

    const senderSocketId = getReceiverSocketId(id);

    if (senderSocketId) {
      io.to(senderSocketId).emit("messages_seen", {
        viewer: req.user.id,
      });
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};