import React, { useEffect, useState } from "react";
import { getAllDayOffRequests, updateRequestStatus } from "../../services/calendar";
import type { BackendCalendarEvent } from "../../services/calendar";
import Button from "../../components/ui/Button";

const CalendarApplicationPage = () => {
  const [requests, setRequests] = useState<BackendCalendarEventWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) return;

      try {
        const data = await getAllDayOffRequests(token);
        setRequests(data.filter((r) => r.status === "pending"));
      } catch (err: any) {
        setError(err.message || "Error al cargar solicitudes");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleUpdateStatus = async (id: number, status: "approved" | "rejected") => {
    if (!token) return;

    try {
      await updateRequestStatus(id, status, token);

      // Actualiza el estado local
        setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err: any) {
      alert(err.message || "Error al actualizar solicitud");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Cargando solicitudes...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-[#0F2C33] mb-4">Solicitudes de días libres</h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white shadow rounded text-sm border border-gray-200">
          <thead className="bg-[#E6D1B4] text-[#0F2C33]">
            <tr>
              <th className="text-left px-4 py-2">Empleado</th>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="text-left px-4 py-2">Estado</th>
              <th className="text-left px-4 py-2">Notas</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2">{req.user_name} ({req.identification_number})</td>
                <td className="px-4 py-2">{req.start}</td>
                <td className="px-4 py-2 capitalize">{req.status}</td>
                <td className="px-4 py-2">{req.notes || "-"}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(req.id, "approved")}
                    disabled={req.status === "approved"}
                    className="text-green-600 hover:underline disabled:opacity-50"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req.id, "rejected")}
                    disabled={req.status === "rejected"}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Rechazar
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

type BackendCalendarEventWithUser = BackendCalendarEvent & {
  user_name: string;
  identification_number: string;
};

export default CalendarApplicationPage;
