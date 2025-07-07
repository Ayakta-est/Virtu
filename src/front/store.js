// Sirve como un mini Redux: mantiene el estado compartido entre componentes,
// como el usuario logueado, tareas, mensajes, etc.

export const initialStore = () => {
  // 🔁 Rehidratar el usuario desde localStorage
  const userFromStorage = localStorage.getItem("role")
    ? {
        id: null, // puedes guardar el ID si lo necesitas
        name: localStorage.getItem("name") || "",
        role: localStorage.getItem("role") || "",
        identification_number: localStorage.getItem("identification_number") || "",
      }
    : null;

  return {
    user: userFromStorage, // permite saber si alguien está logueado (y su rol)
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

// Este reducer permite modificar el store a través de acciones.
// Cada acción representa una intención clara (ej: loguear, cambiar color, etc.)
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...store,
        user: action.payload,
      };

    case "LOGOUT":
      // Elimina al usuario del estado (y puedes limpiar localStorage si quieres)
      localStorage.clear();
      return {
        ...store,
        user: null,
      };

    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    default:
      throw Error("Unknown action.");
  }
}
