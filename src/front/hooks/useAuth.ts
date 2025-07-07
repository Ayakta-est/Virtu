import { useState } from "react";
import { login } from "../services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (ident: string, password: string) => {
    setLoading(true);
    try {
      const data = await login(ident, password);

      // Guardar en localStorage (opcional)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("identification_number", data.user.identification_number);
      localStorage.setItem("name", data.user.name);

      setError(null);
      return {
        id: data.user.id,
        name: data.user.name,
        role: data.user.role,
      };
    } catch (err) {
      setError("Credenciales incorrectas");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
};
