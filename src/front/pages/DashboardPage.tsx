import React from "react";

const DashboardPage = () => {
  const name = localStorage.getItem("name");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#0F2C33] mb-4">Bienvenido al Panel</h1>
      <p className="text-[#2E9CA0]">Hola {name || "usuario"}, estás autenticado.</p>
    </div>
  );
};

export default DashboardPage;
