import api from "../api/apiClient";

export const createUser = async (data: { name: string; password: string }) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};