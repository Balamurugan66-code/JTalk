import api from "./api";

export const sendMessage = async (receiverId, text, replyTo = null) => {
  const { data } = await api.post("/messages", {
    receiver: receiverId,
    text,
    replyTo,
  });

  return data;
};

export const getMessages = async (userId) => {
  const { data } = await api.get(`/messages/${userId}`);
  return data;
};