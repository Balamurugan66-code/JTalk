let io;

// userId -> Set(socketIds)
const onlineUsers = new Map();

export const initializeSocket = (socketServer) => {
  io = socketServer;

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("register", (userId) => {
      socket.userId = userId;

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId).add(socket.id);

      io.emit("online_users", [...onlineUsers.keys()]);
    });

    // ------------------------
    // Typing Indicator
    // ------------------------

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

    socket.on("disconnect", () => {
      const userId = socket.userId;

      if (userId && onlineUsers.has(userId)) {
        const sockets = onlineUsers.get(userId);

        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);
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

export const getOnlineUsers = () => {
  return [...onlineUsers.keys()];
};

export { io };