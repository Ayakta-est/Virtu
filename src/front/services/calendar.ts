// Puedes definir este tipo en otro archivo si lo vas a reutilizar
export type BackendCalendarEvent = {
  id: number;
  userId: number;
  title: string;
  type: "worked" | "vacation" | "absence" | "requested";
  status?: "pending" | "approved" | "rejected";
  start: string;
  end?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BackendCalendarEventWithUser = BackendCalendarEvent & {
  user_name: string;
  identification_number: string;
};

export async function getUserCalendarEvents(
  identificationNumber: string,
  token: string
): Promise<BackendCalendarEvent[]> {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/calendar/${identificationNumber}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al cargar eventos del calendario");
  }

  return await res.json();
}

export async function requestDayOff({
  identificationNumber,
  title,
  startDate,
  endDate,
  notes,
  token,
}: {
  identificationNumber: string;
  title: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  token: string;
}): Promise<BackendCalendarEvent> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/calendar/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      identification_number: identificationNumber,
      title,
      start_date: startDate,
      end_date: endDate || undefined,
      notes,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al enviar solicitud");
  }

  return await response.json();
}

export async function updateRequestStatus(
  eventId: number,
  status: "approved" | "rejected",
  token: string
): Promise<{ message: string }> {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/calendar/requests/${eventId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al actualizar solicitud");
  }

  return await res.json(); 
}

export async function getAllDayOffRequests(token: string): Promise<BackendCalendarEventWithUser[]> {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/calendar/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al obtener solicitudes");
  }

  return await res.json();
}

export async function createAdminEvent({
  identificationNumber,
  type,
  startDate,
  endDate,
  notes,
  token,
}: {
  identificationNumber: string;
  type: "worked" | "vacation" | "absence" | "requested";
  startDate: string;
  endDate?: string;
  notes?: string;
  token: string;
}) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/calendar/admin/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      identification_number: identificationNumber,
      type,
      start_date: startDate,
      end_date: endDate,
      notes,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al crear evento");
  }

  return await res.json();
}

export type CalendarEvent = {
  id: string; // string para FullCalendar
  userId: number;
  title: string;
  type: "worked" | "vacation" | "absence" | "requested";
  status?: "pending" | "approved" | "rejected";
  start: string;
  end: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  backgroundColor: string;
  borderColor: string;
};
