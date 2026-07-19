import User from "../models/User.js";
import { getOnlineUsers } from "../sockets/socket.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {
        _id: { $ne: req.user.id },
      },
      "-password"
    );

    const onlineUsers = getOnlineUsers();

    const updatedUsers = users.map((user) => ({
      ...user.toObject(),
      isOnline: onlineUsers.includes(user._id.toString()),
    }));

    res.json(updatedUsers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};