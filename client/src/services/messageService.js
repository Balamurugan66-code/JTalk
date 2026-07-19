import api from "./api";

export const sendMessage = async (
  receiverId,
  text = "",
  replyTo = null,
  image = null
) => {
  const formData = new FormData();

  formData.append("receiver", receiverId);
  formData.append("text", text);

  if (replyTo) {
    formData.append("replyTo", replyTo);
  }

  if (image) {
    formData.append("image", image);
  }

  const { data } = await api.post("/messages", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getMessages = async (userId) => {
  const { data } = await api.get(`/messages/${userId}`);
  return data;
};

export const deleteMessage = async (messageId) => {
  const { data } = await api.delete(`/messages/${messageId}`);
  return data;
};