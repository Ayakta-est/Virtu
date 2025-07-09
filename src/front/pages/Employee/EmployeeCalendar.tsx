import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../../components/calendar/EventModal";
import { RequestDayModal } from "../../components/calendar/RequestDayModal"; // asumo que existe
import { requestDayOff } from "../../components/calendar/requestDayOff"; 
import { EventInput } from "@fullcalendar/core";

type CalendarEvent = EventInput & {
  type: "worked" | "vacation" | "absence" | "requested";
  status?: "pending" | "approved" | "rejected";
  notes?: string;
};
export default function EmployeeCalendar({ user, token }) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const handleAddEvent = async (newEventData) => {
    try {
      const createdEvent = await requestDayOff({
        userId: user.id,
        title: "Solicitud día libre",
        startDate: newEventData.startDate,
        endDate: newEventData.endDate,
        notes: newEventData.notes,
        token
      });

      setEvents((prev) => [...prev, {
        ...createdEvent,
        backgroundColor: getColor(createdEvent),
        borderColor: getColor(createdEvent),
      }]);
    } catch (err) {
      console.error("Error al solicitar día libre:", err);
    }
  };

  function getColor(event) {
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
          const found = events.find(e => e.id?.toString() === info.event.id?.toString());
          if (found) {
            setSelectedEvent(found);
          }
        }}
        height="auto"
      />

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {showRequestModal && (
        <RequestDayModal
          user={user}
          token={token}
          onClose={() => setShowRequestModal(false)}
          onSuccess={(data) => {
            handleAddEvent(data);
            setShowRequestModal(false);
          }}
        />
      )}
    </div>
  );
}
