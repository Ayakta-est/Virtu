import axios from "../api/apiClient";

export const login = async (identification_number: string, password: string) => {
  const response = await axios.post("/auth/login", { identification_number, password });
  return response.data; // token y/o user info
};