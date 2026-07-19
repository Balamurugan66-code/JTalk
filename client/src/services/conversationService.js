import api from "./api";

export const getConversations = async () => {
  const response = await api.get("/conversations");
  return response.data;
};