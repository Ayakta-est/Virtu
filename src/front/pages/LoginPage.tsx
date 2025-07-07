import React, { useState } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; // 👈 importante

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, loading, error } = useAuth();
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer(); // 👈 necesario para guardar el user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = await loginUser(employeeId, password);

    if (userData) {
      dispatch({
        type: "SET_USER",
        payload: userData, //contiene id, name y role
      });

      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F2C33] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-[#0F2C33]">Iniciar sesión</h2>

        <Input
          icon={<EnvelopeIcon className="w-5 h-5" />}
          placeholder="Identificador"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          type="text"
        />

        <Input
          icon={<LockClosedIcon className="w-5 h-5" />}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Cargando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
