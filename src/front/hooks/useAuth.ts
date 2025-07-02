// login/logout, user info

import { useState } from "react";
import { login } from "../services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (ident: string, password: string) => {
    setLoading(true);
    try {
      const data = await login(ident, password);
      localStorage.setItem("token", data.token);
      setError(null);
      return true;
    } catch (err) {
      setError("Credenciales incorrectas");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
};
