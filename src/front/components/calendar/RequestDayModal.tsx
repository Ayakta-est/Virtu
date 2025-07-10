import React, { useEffect, useState } from "react";
import { requestDayOff } from "../../services/calendar";
import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  identificationNumber: string;
  token: string;
  initialDate: string | null;
  onClose: () => void;
  onSuccess: (data: any) => void;
};

export function RequestDayModal({
  identificationNumber,
  token,
  initialDate,
  onClose,
  onSuccess,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(initialDate ?? today);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  }, [startDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!identificationNumber || !startDate) {
      setError("Faltan datos obligatorios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await requestDayOff({
        identificationNumber,
        title: "Solicitud día libre",
        startDate,
        endDate: startDate, // mismo día
        notes,
        token,
      });

      onSuccess(result);
    } catch (err: any) {
      setError(err.message || "Error al enviar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full mx-4 relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-[#0F2C33]">Solicitar día libre</h3>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !startDate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Solicitar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
