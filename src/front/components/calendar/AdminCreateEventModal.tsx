import React, { useState } from "react";
import Modal from "../ui/Modal";
import { createAdminEvent } from "../../services/calendar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (event: any) => void;
  identificationNumber: string;
}

const AdminCreateEventModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  identificationNumber,
}) => {
  const [type, setType] = useState<"worked" | "vacation" | "absence" | "requested">("worked");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !startDate) return;

    setLoading(true);
    try {
      const newEvent = await createAdminEvent({
        identificationNumber,
        type,
        startDate,
        endDate: endDate || startDate,
        notes,
        token,
      });
      onSuccess(newEvent);
    } catch (err) {
      alert("Error al crear evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear evento manualmente">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de evento</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "worked" | "vacation" | "absence" | "requested")}
            className="w-full border p-2 rounded"
          >
            <option value="worked">Jornada laboral</option>
            <option value="vacation">Vacaciones</option>
            <option value="absence">Ausencia</option>
            <option value="requested">Solicitud directa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Creando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminCreateEventModal;
