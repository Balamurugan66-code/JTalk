import api from "./api";

/* ===========================
   Direct Messages
=========================== */

export const sendMessage = async (
  receiverId,
  text = "",
  replyTo = null,
  attachment = null
) => {
  const formData = new FormData();

  formData.append("receiver", receiverId);
  formData.append("text", text);

  if (replyTo) {
    formData.append("replyTo", replyTo);
  }

  if (attachment) {
    formData.append("image", attachment);
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

/* ===========================
   Group Messages
=========================== */

export const getGroupMessages = async (groupId) => {
  const { data } = await api.get(
    `/groups/${groupId}/messages`
  );

  return data;
};

export const sendGroupMessage = async (
  groupId,
  text = "",
  attachment = null,
  replyTo = null
) => {
  const formData = new FormData();

  formData.append("text", text);

  if (replyTo) {
    formData.append("replyTo", replyTo);
  }

  if (attachment) {
    formData.append("image", attachment);
  }

  const { data } = await api.post(
    `/groups/${groupId}/messages`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

/* ===========================
   Common
=========================== */

export const deleteMessage = async (messageId) => {
  const { data } = await api.delete(
    `/messages/${messageId}`
  );

  return data;
};

export const reactToMessage = async (
  messageId,
  emoji
) => {
  const { data } = await api.post(
    `/messages/${messageId}/react`,
    {
      emoji,
    }
  );

  return data;
};