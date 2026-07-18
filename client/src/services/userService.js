import api from "./api";

export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};