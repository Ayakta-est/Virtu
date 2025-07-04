import axios from "../api/apiClient";

export const login = async (ident: string, password: string) => {
  const response = await axios.post("/api/login", {
    identification_number: ident,
    password: password,
  });
  return response.data;
};