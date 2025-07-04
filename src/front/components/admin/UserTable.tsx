import React, { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";

interface User {
  id: number;
  name: string;
  identification_number: string;
  role: string;
}

interface Props {
  refresh: boolean;
}

const UserTable: React.FC<Props> = ({ refresh }) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error al cargar usuarios", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-[#E6D1B4] text-[#0F2C33]">
          <tr>
            <th className="text-left px-4 py-2">Nombre</th>
            <th className="text-left px-4 py-2">ID de Empleado</th>
            <th className="text-left px-4 py-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-t border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.identification_number}</td>
              <td className="px-4 py-2 capitalize">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
