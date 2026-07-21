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

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (about !== undefined) {
      user.about = about.trim();
    }

    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        about: user.about,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};