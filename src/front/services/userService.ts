import api from "../api/apiClient";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const createUser = async (user: {
  name: string;
  password: string;
  identification_number?: string;
}) => {
  const res = await fetch(`${baseURL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${baseURL}/api/users`);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
};