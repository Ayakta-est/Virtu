import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateNews() {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    short_description: "",
    content: "",
    category: "",
    link: "",
    is_featured: false,
  });

  const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Si es un checkbox, usamos checked
        if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
            setFormData({
            ...formData,
            [name]: e.target.checked,
            });
        } else {
            setFormData({
            ...formData,
            [name]: value,
            });
        }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando:", formData);

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate("/"); // o a donde desees después de crear
    } else {
      alert("Error al crear la noticia");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Crear Noticia</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="title" placeholder="Título" value={formData.title} onChange={handleChange} className="input" required />
        <input name="image" placeholder="URL de imagen" value={formData.image} onChange={handleChange} className="input" required />
        <input name="short_description" placeholder="Descripción corta" value={formData.short_description} onChange={handleChange} className="input" required />
        <textarea name="content" placeholder="Contenido completo" value={formData.content} onChange={handleChange} className="input h-32" required />
        <input name="category" placeholder="Categoría (Ej. Grupo, Personas...)" value={formData.category} onChange={handleChange} className="input" required />
        <input name="link" placeholder="Ruta (Ej. /notices/3)" value={formData.link} onChange={handleChange} className="input" required />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} />
          ¿Mostrar en carrusel?
        </label>
        <button type="submit" className="btn btn-primary w-full">Guardar</button>
      </form>
    </div>
  );
}
