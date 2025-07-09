export async function requestDayOff({ userId, title, startDate, endDate, notes, token }) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/calendar/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`  // si usas JWT
      },
      body: JSON.stringify({
        user_id: userId,
        title,
        start_date: startDate,
        end_date: endDate || null,
        notes,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al enviar la solicitud");
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Solicitud de día libre fallida:", error);
    throw error;
  }
}
