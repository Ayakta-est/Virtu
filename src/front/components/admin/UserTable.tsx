import React, { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";
import Modal from "../ui/Modal";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

interface User {
  id: number;
  name: string;
  identification_number: string;
  role: string;
  profile_image?: string;
  workstation?: string;
  department?: string;
  is_active?: boolean;
}

interface Props {
  refresh: boolean;
}

const UserTable: React.FC<Props> = ({ refresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [completingUser, setCompletingUser] = useState<User | null>(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeForm, setCompleteForm] = useState({
    profile_image: "",
    workstation: "",
    department: "",
    is_active: true,
  });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error al cargar usuarios", err);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    const res = await fetch(`${baseUrl}/api/users/${userToDelete.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    } else {
      alert("Error al eliminar el usuario.");
    }

    setUserToDelete(null);
  };

  const handleCompleteUser = (user: User) => {
    setCompletingUser(user);
    setCompleteForm({
      profile_image: user.profile_image || "",
      workstation: user.workstation || "",
      department: user.department || "",
      is_active: user.is_active ?? true,
    });
    setCompleteModalOpen(true);
  };

  const submitComplete = async () => {
    if (!completingUser) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${baseUrl}/api/users/${completingUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(completeForm),
    });

    if (res.ok) {
      setCompleteModalOpen(false);
      fetchUsers();
    } else {
      alert("Error al completar datos.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto bg-white shadow rounded text-sm border border-gray-200">
        <thead className="bg-[#E6D1B4] text-[#0F2C33]">
          <tr>
            <th className="text-left px-4 py-2">Nombre</th>
            <th className="text-left px-4 py-2">ID de Empleado</th>
            <th className="text-left px-4 py-2">Rol</th>
            <th className="text-left px-4 py-2">Acciones</th>
            <th className="text-left px-4 py-2">Completar datos</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.identification_number}</td>
              <td className="px-4 py-2 capitalize">{u.role}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setModalOpen(true);
                  }}
                  className={`text-teal-800 hover:underline ${u.role === "admin" ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={u.role === "admin"}
                  title={u.role === "admin" ? "No puedes editar a un administrador" : ""}
                >
                  Editar
                </button>
                <button
                  onClick={() => setUserToDelete(u)}
                  className={`text-red-600 hover:underline ${u.role === "admin" ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={u.role === "admin"}
                  title={u.role === "admin" ? "No puedes eliminar a un administrador" : ""}
                >
                  Eliminar
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleCompleteUser(u)}
                  className="text-green-600 hover:underline"
                >
                  Completar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal edición */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Editar usuario"
      >
        {selectedUser && (
          <UserForm
            initialData={selectedUser}
            onSuccess={() => {
              setModalOpen(false);
              fetchUsers();
            }}
            onCancel={() => setModalOpen(false)}
          />
        )}
      </Modal>

      {/* Modal confirmación eliminación */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Confirmar eliminación"
      >
        <div className="space-y-4">
          <p>
            ¿Estás seguro de que quieres eliminar al usuario{" "}
            <strong>{userToDelete?.name}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setUserToDelete(null)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDeleteUser}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal completar datos */}
      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title="Completar datos"
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">URL Imagen</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={completeForm.profile_image}
              onChange={(e) => setCompleteForm({ ...completeForm, profile_image: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Puesto</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={completeForm.workstation}
              onChange={(e) => setCompleteForm({ ...completeForm, workstation: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Departamento</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={completeForm.department}
              onChange={(e) => setCompleteForm({ ...completeForm, department: e.target.value })}
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={completeForm.is_active}
              onChange={(e) => setCompleteForm({ ...completeForm, is_active: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Activo</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setCompleteModalOpen(false)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={submitComplete}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserTable;
