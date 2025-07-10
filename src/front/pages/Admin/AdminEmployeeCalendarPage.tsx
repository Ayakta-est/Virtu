import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getUserCalendarEvents, createAdminEvent } from "../../services/calendar";
import type { CalendarEvent, BackendCalendarEvent } from "../../services/calendar";
import Modal from "../../components/ui/Modal";
import AdminCreateEventModal from "../../components/calendar/AdminCreateEventModal";

function getColor(event: { type: string; status?: string }): string {
  switch (event.type) {
    case "worked":
      return "#d3d3d3";
    case "vacation":
      return "#32CD32";
    case "absence":
      return "#DC143C";
    case "requested":
      return event.status === "pending" ? "#87CEFA" : "#1E90FF";
    default:
      return "#999";
  }
}

function adaptToCalendarEvent(e: BackendCalendarEvent): CalendarEvent {
  return {
    ...e,
    id: String(e.id),
    start: e.start,
    end: e.end ?? e.start,
    backgroundColor: getColor(e),
    borderColor: getColor(e),
  };
}

const AdminEmployeeCalendarPage = () => {
  const { identification_number } = useParams();
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!identification_number || !token) return;

    const fetchEvents = async () => {
      try {
        const data = await getUserCalendarEvents(identification_number, token);
        const enriched = data.map((e) => ({
          ...e,
          id: String(e.id),
          start: e.start,
          end: e.end ?? e.start,
          backgroundColor: getColor(e),
          borderColor: getColor(e),
        }));
        setEvents(enriched);
      } catch (err: any) {
        setError("Error al cargar eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [identification_number, token]);

  const getColor = (event: BackendCalendarEvent) => {
    switch (event.type) {
      case "worked":
        return "#d3d3d3";
      case "vacation":
        return "#32CD32";
      case "absence":
        return "#DC143C";
      case "requested":
        return event.status === "pending" ? "#87CEFA" : "#1E90FF";
      default:
        return "#999";
    }
  };

  const handleEventCreated = (newEvent: BackendCalendarEvent) => {
    setEvents((prev) => [...prev, adaptToCalendarEvent(newEvent)]);

    setModalOpen(false);
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Cargando calendario...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-[#0F2C33]">Calendario de {identification_number}</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Crear evento
        </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />

      <AdminCreateEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleEventCreated}
        identificationNumber={identification_number!}
      />
    </div>
  );
};

export default AdminEmployeeCalendarPage;
