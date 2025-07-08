import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "../../components/admin/UserForm";
import UserTable from "../../components/admin/UserTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

const UsersPage = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/not-authorized");
    }
  }, []);

  const handleSuccess = () => {
    setModalOpen(false);
    setRefresh(!refresh);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-[#0F2C33]">Usuarios</h1>
        <Button onClick={() => setModalOpen(true)}>Crear usuario</Button>
      </div>

      <UserTable refresh={refresh} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo usuario">
        <UserForm onSuccess={handleSuccess} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default UsersPage;
