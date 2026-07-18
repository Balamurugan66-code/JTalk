let io;

const userSocketMap = {};

export const initializeSocket = (socketServer) => {
  io = socketServer;

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("register", (userId) => {
      userSocketMap[userId] = socket.id;
    });

    socket.on("disconnect", () => {
      for (const userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }

      console.log("User Disconnected:", socket.id);
    });
  });
};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

export { io };