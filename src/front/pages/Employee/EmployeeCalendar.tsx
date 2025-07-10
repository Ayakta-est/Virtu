import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../../components/calendar/EventModal";
import { RequestDayModal } from "../../components/calendar/RequestDayModal";
import { requestDayOff, getUserCalendarEvents } from "../../services/calendar";
import type { BackendCalendarEvent } from "../../services/calendar";

type CalendarEvent = EventInput & {
  type: "worked" | "vacation" | "absence" | "requested";
  status?: "pending" | "approved" | "rejected";
  notes?: string;
};

export default function EmployeeCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const identificationNumber = localStorage.getItem("identification_number");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      if (!identificationNumber || !token) return;

      try {
        const data = await getUserCalendarEvents(identificationNumber, token);
        const enriched = data.map((event) => toCalendarEvent(event));
        setEvents(enriched);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      }
    };

    fetchEvents();
  }, [identificationNumber, token]);

  function getColor(event: CalendarEvent): string {
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

  function toCalendarEvent(raw: BackendCalendarEvent): CalendarEvent {
    const base = {
      id: String(raw.id),
      title: raw.title,
      start: raw.start,
      end: raw.end ?? raw.start,
      type: raw.type,
      status: raw.status,
      notes: raw.notes,
    };

    return {
      ...base,
      backgroundColor: getColor(base),
      borderColor: getColor(base),
    };
  }

  if (!identificationNumber || !token) {
    return <p className="text-center mt-10 text-gray-600">Cargando usuario...</p>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Mi Calendario</h2>
        <button
          onClick={() => setShowRequestModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Solicitar día libre
        </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          const found = events.find(
            (e) => e.id?.toString() === info.event.id?.toString()
          );
          if (found) {
            setSelectedEvent(found);
          }
        }}
        dateClick={(arg) => {
          setSelectedDate(arg.dateStr);
          setShowRequestModal(true);
        }}
        height="auto"
      />

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {showRequestModal && (
        <RequestDayModal
          identificationNumber={identificationNumber}
          token={token}
          initialDate={selectedDate}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedDate(null);
          }}
          onSuccess={(data) => {
            const adapted = toCalendarEvent(data);
            setEvents((prev) => [...prev, adapted]);
            setShowRequestModal(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}
