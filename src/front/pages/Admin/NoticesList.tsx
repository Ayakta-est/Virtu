import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

type NewsItem = {
  id: number;
  title: string;
  category: string;
  isFeatured: boolean;
  createdAt: string;
};

export default function NoticiasList() {
  const [noticias, setNoticias] = useState<NewsItem[]>([]);
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  useEffect(() => {
    fetch(`${baseUrl}/api/notices`)
      .then((res) => res.json())
      .then((data) => setNoticias(data))
      .catch((err) => console.error("Error cargando noticias:", err));
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta noticia?");
    if (!confirm) return;

    const res = await fetch(`${baseUrl}/api/notices/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNoticias((prev) => prev.filter((n) => n.id !== id));
    } else {
      alert("Error al eliminar la noticia.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Noticias</h1>
        <button
          onClick={() => navigate("/admin/notices/new")}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          + Nueva noticia
        </button>
      </div>

      <table className="w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Título</th>
            <th className="p-3">Categoría</th>
            <th className="p-3">Carrusel</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {noticias.map((n) => (
            <tr key={n.id} className="border-t">
              <td className="p-3">{n.title}</td>
              <td className="p-3">{n.category}</td>
              <td className="p-3">{n.isFeatured ? "✅" : "—"}</td>
              <td className="p-3">
                {format(new Date(n.createdAt), "dd/MM/yyyy")}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => navigate(`/admin/notices/edit/${n.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {noticias.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No hay noticias todavía.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
