import GroupMessage from "../models/GroupMessage.js";
import Conversation from "../models/Conversation.js";

/*
    GET /api/groups/:groupId/messages
*/
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Conversation.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    const messages = await GroupMessage.find({
      group: groupId,
    })
      .populate("sender", "name avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      })
      .populate("reactions.user", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load group messages.",
    });
  }
};

/*
    POST /api/groups/:groupId/messages
*/
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, replyTo } = req.body;

    const group = await Conversation.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    console.log("========== GROUP FILE ==========");
console.log(req.file);
console.log("===============================");

const attachment = req.file
  ? {
      url: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      size: req.file.size,
    }
  : null;

console.log("ATTACHMENT:", attachment);

    // Keep existing image support
    const image =
      attachment && attachment.fileType.startsWith("image/")
        ? attachment.url
        : "";

    if (!text?.trim() && !attachment) {
      return res.status(400).json({
        message: "Message cannot be empty.",
      });
    }

    const message = await GroupMessage.create({
      sender: req.user.id,
      group: groupId,
      text: text || "",
      image,
      attachment,
      replyTo: replyTo || null,
    });

    const populatedMessage = await GroupMessage.findById(
      message._id
    )
      .populate("sender", "name avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      })
      .populate("reactions.user", "name");

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to send group message.",
    });
  }
};