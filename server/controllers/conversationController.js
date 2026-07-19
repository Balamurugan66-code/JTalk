import User from "../models/User.js";
import Message from "../models/Message.js";
import { getOnlineUsers } from "../sockets/socket.js";

export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const users = await User.find(
      {
        _id: { $ne: currentUserId },
      },
      "-password"
    );

    const onlineUsers = getOnlineUsers();

    const conversations = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            {
              sender: currentUserId,
              receiver: user._id,
            },
            {
              sender: user._id,
              receiver: currentUserId,
            },
          ],
        })
          .sort({ createdAt: -1 })
          .populate("sender", "name");

        return {
          ...user.toObject(),

          isOnline: onlineUsers.includes(user._id.toString()),

          lastMessage: lastMessage?.text || "",

          lastMessageSender: lastMessage
            ? lastMessage.sender._id.toString() === currentUserId
              ? "me"
              : "them"
            : null,

          lastMessageTime: lastMessage?.createdAt || null,
        };
      })
    );

    conversations.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;

      return (
        new Date(b.lastMessageTime) -
        new Date(a.lastMessageTime)
      );
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};