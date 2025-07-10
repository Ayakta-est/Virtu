import React, { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

interface User {
  id: number;
  name: string;
  identification_number: string;
  role: string;
}

const CalendarManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/not-authorized");
    }

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Error al cargar usuarios.");
      }
    };

    fetchUsers();
  }, [navigate]);

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-[#0F2C33]">Gestión de calendarios</h1>
        <Button onClick={() => navigate("/admin/calendar/application")}>
          Ver solicitudes
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white shadow rounded text-sm border border-gray-200">
          <thead className="bg-[#E6D1B4] text-[#0F2C33]">
            <tr>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">ID de empleado</th>
              <th className="text-left px-4 py-2">Rol</th>
              <th className="text-left px-4 py-2">Calendario</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.identification_number}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => navigate(`/admin/calendar/${u.identification_number}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Ver calendario
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarManagementPage;
