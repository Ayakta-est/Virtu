import React from "react";
import { Link } from "react-router-dom";

const NotAuthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F2C33] text-white px-4">
      <h1 className="text-3xl font-bold mb-4">Acceso denegado</h1>
      <p className="mb-6">No tienes permisos para ver esta página.</p>
      <Link
        to="/"
        className="bg-[#2E9CA0] hover:bg-[#21616A] text-white px-4 py-2 rounded-md transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotAuthorizedPage;
