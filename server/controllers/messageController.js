import Message from "../models/Message.js";
import { io, getReceiverSocketId } from "../sockets/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      text,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    const receiverSocketId = getReceiverSocketId(receiver);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

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
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};