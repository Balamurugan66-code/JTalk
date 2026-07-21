import User from "../models/User.js";

let io;

// userId -> Set(socketIds)
const onlineUsers = new Map();

export const initializeSocket = (socketServer) => {
  io = socketServer;

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("register", async (userId) => {
      socket.userId = userId;

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId).add(socket.id);

      await User.findByIdAndUpdate(userId, {
        isOnline: true,
      });

      io.emit("online_users", [...onlineUsers.keys()]);
    });

    // ===========================
    // Direct Chat Typing
    // ===========================

    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", {
          senderId,
        });
      }
    });

    socket.on("stop_typing", ({ senderId, receiverId }) => {
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stop_typing", {
          senderId,
        });
      }
    });

    // ===========================
    // Group Rooms
    // ===========================

    socket.on("join_group", (groupId) => {
      socket.join(groupId);
      console.log(`${socket.id} joined group ${groupId}`);
    });

    socket.on("leave_group", (groupId) => {
      socket.leave(groupId);
      console.log(`${socket.id} left group ${groupId}`);
    });

    socket.on("send_group_message", ({ groupId, message }) => {
      io.to(groupId).emit("receive_group_message", message);
    });

    socket.on("typing_group", ({ groupId, sender }) => {
      socket.to(groupId).emit("typing_group", sender);
    });

    socket.on("stop_typing_group", ({ groupId }) => {
      socket.to(groupId).emit("stop_typing_group");
    });

    // ===========================
    // Disconnect
    // ===========================

    socket.on("disconnect", async () => {
      const userId = socket.userId;

      if (userId && onlineUsers.has(userId)) {
        const sockets = onlineUsers.get(userId);

        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);

          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });
        }

        io.emit("online_users", [...onlineUsers.keys()]);
      }

      console.log("User Disconnected:", socket.id);
    });
  });
};

export const getReceiverSocketId = (userId) => {
  const sockets = onlineUsers.get(userId);

  if (!sockets || sockets.size === 0) return null;

  return [...sockets][0];
};

export const getOnlineUsers = () => [...onlineUsers.keys()];

export { io };