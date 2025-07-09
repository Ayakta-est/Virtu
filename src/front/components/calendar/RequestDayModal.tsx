import { useState } from "react";
import { requestDayOff } from "./requestDayOff";

export function RequestDayModal({ user, token, onClose, onSuccess }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await requestDayOff({
        userId: user.id,
        title: "Solicitud día libre",
        startDate,
        endDate,
        notes,
        token
      });

      onSuccess(result); // puedes refrescar el calendario, cerrar modal, etc.
      onClose();

    } catch (err) {
      setError(error || "Error al enviar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h2 className="text-lg font-bold">Solicitar día libre</h2>

      <label>Desde:</label>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

      <label>Hasta (opcional):</label>
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

      <label>Motivo (opcional):</label>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} />

      {error && <p className="text-red-500">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>

      <button onClick={onClose} className="ml-2">Cancelar</button>
    </div>
  );
}
