import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    short_description: "",
    content: "",
    category: "",
    link: "",
    is_featured: false,
  });

  useEffect(() => {
    fetch(`${baseUrl}/api/notices/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch(() => alert("Error al cargar la noticia"));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            setFormData({
            ...formData,
            [target.name]: target.checked,
            });
        } else {
            setFormData({
            ...formData,
            [target.name]: target.value,
            });
        }
    };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${baseUrl}/api/notices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate("/admin/notices");
    } else {
      alert("Error al actualizar la noticia");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Editar Noticia</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="title" placeholder="Título" value={formData.title} onChange={handleChange} className="input" required />
        <input name="image" placeholder="URL de imagen" value={formData.image} onChange={handleChange} className="input" required />
        <input name="short_description" placeholder="Descripción corta" value={formData.short_description} onChange={handleChange} className="input" required />
        <textarea name="content" placeholder="Contenido completo" value={formData.content} onChange={handleChange} className="input h-32" required />
        <input name="category" placeholder="Categoría" value={formData.category} onChange={handleChange} className="input" required />
        <input name="link" placeholder="Ruta interna (Ej: /noticias/3)" value={formData.link} onChange={handleChange} className="input" required />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} />
          ¿Mostrar en carrusel?
        </label>
        <button type="submit" className="btn btn-primary w-full">Actualizar</button>
      </form>
    </div>
  );
}
