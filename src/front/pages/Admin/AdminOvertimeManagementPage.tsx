import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

interface Overtime {
  id: number | null;
  userId: number;
  name: string;
  date: string;
  hours: number;
  approved: boolean;
  notes: string;
}

interface Employee {
  id: number;
  name: string;
}

const AdminOvertimeManagementPage = () => {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [overtimes, setOvertimes] = useState<Overtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOvertime, setSelectedOvertime] = useState<Overtime | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);

  const fetchOvertimes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${baseUrl}/api/admin/overtime?month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setOvertimes(data);
    } catch (err) {
      console.error("Error al obtener horas extra:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${baseUrl}/api/admin/employees`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
    }
  };

  const combinedData = employees.map((emp) => {
    const match = overtimes.find((ot) => ot.userId === emp.id);
    return match ?? {
      id: null,
      userId: emp.id,
      name: emp.name,
      date: "",
      hours: 0,
      approved: false,
      notes: "",
    };
  });

  const handleSave = async () => {
    if (!selectedOvertime) return;

    const token = localStorage.getItem("token");
    const isNew = selectedOvertime.id === null;
    const url = isNew
      ? `${baseUrl}/api/admin/overtime`
      : `${baseUrl}/api/admin/overtime/${selectedOvertime.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedOvertime),
      });
      if (!res.ok) throw new Error("Error al guardar la hora extra");
      alert(isNew ? "Hora extra añadida" : "Hora extra actualizada");
      setSelectedOvertime(null);
      setShowNewModal(false);
      fetchOvertimes();
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  const handleDelete = async () => {
  if (!selectedOvertime || !selectedOvertime.id) return;

  const token = localStorage.getItem("token");
  const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta hora extra?");
  if (!confirmed) return;

  try {
    const res = await fetch(`${baseUrl}/api/admin/overtime/${selectedOvertime.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error al eliminar la hora extra");

    alert("Hora extra eliminada");
    setSelectedOvertime(null);
    setShowNewModal(false);
    fetchOvertimes();
  } catch (err) {
    console.error(err);
    alert("Error al eliminar");
  }
};

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchOvertimes();
  }, [month]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0F2C33] mb-4">Gestor de Horas Extra</h1>

      <div className="flex items-center justify-between mb-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <Button variant="secondary" onClick={() => setShowNewModal(true)}>
          Añadir hora extra
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <table className="w-full table-auto bg-white shadow rounded text-sm border border-gray-200">
          <thead className="bg-[#E6D1B4] text-[#0F2C33]">
            <tr>
              <th className="text-left px-4 py-2">Empleado</th>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="text-left px-4 py-2">Horas</th>
              <th className="text-left px-4 py-2">Aprobado</th>
              <th className="text-left px-4 py-2">Notas</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((ot) => (
              <tr key={`${ot.userId}-${ot.date || "none"}`} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2">{ot.name}</td>
                <td className="px-4 py-2">{ot.date || "-"}</td>
                <td className="px-4 py-2">{ot.hours.toFixed(2)} h</td>
                <td className="px-4 py-2">{ot.approved ? "Sí" : "No"}</td>
                <td className="px-4 py-2">{ot.notes || "-"}</td>
                <td className="px-4 py-2">
                  <Button variant="ghost" onClick={() => setSelectedOvertime(ot)}>
                    {ot.id ? "Editar" : "Añadir"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(selectedOvertime || showNewModal) && (
  <Modal
    isOpen
    onClose={() => {
      setSelectedOvertime(null);
      setShowNewModal(false);
    }}
    title={selectedOvertime?.id ? "Editar hora extra" : "Nueva hora extra"}
  >
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-4"
    >
      {!selectedOvertime?.id && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Empleado</label>
          <select
            value={selectedOvertime?.userId || ""}
            onChange={(e) =>
              setSelectedOvertime((prev) => ({
                ...(prev || { id: null, approved: false, date: "", hours: 0, notes: "", name: "" }),
                userId: parseInt(e.target.value),
                name: employees.find((emp) => emp.id === parseInt(e.target.value))?.name || "",
              }))
            }
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="">Selecciona un empleado</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha</label>
        <input
          type="date"
          value={selectedOvertime?.date || ""}
          onChange={(e) =>
            setSelectedOvertime((prev) => ({ ...(prev as Overtime), date: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Horas</label>
        <input
          type="number"
          step="0.25"
          value={selectedOvertime?.hours || 0}
          onChange={(e) =>
            setSelectedOvertime((prev) => ({
              ...(prev as Overtime),
              hours: parseFloat(e.target.value) || 0,
            }))
          }
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notas</label>
        <input
          type="text"
          value={selectedOvertime?.notes || ""}
          onChange={(e) =>
            setSelectedOvertime((prev) => ({ ...(prev as Overtime), notes: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="approved"
          checked={selectedOvertime?.approved || false}
          onChange={(e) =>
            setSelectedOvertime((prev) => ({ ...(prev as Overtime), approved: e.target.checked }))
          }
        />
        <label htmlFor="approved" className="text-sm">Aprobado</label>
      </div>

      <div className="flex justify-between items-center gap-4 pt-2 border-t mt-4">
        {selectedOvertime?.id && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white p-1 px-4 rounded"
          >
            Eliminar
          </button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button type="button" variant="ghost" onClick={() => {
            setSelectedOvertime(null);
            setShowNewModal(false);
          }}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar
          </Button>
        </div>
      </div>
    </form>
  </Modal>
)}
    </div>
  );
};

export default AdminOvertimeManagementPage;
