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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate("/");
    } else {
      alert("Error al crear la noticia");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Formulario */}
      <div className="bg-white shadow rounded p-6">
        <h1 className="text-xl font-bold text-[#0F2C33] mb-4">Crear Noticia</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="image"
            placeholder="URL de imagen"
            value={formData.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="short_description"
            placeholder="Descripción corta"
            value={formData.short_description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="content"
            placeholder="Contenido completo"
            value={formData.content}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded h-32"
            required
          />
          <input
            name="category"
            placeholder="Categoría (Ej. Grupo, Personas...)"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="link"
            placeholder="Ruta (Ej. /notices/3)"
            value={formData.link}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />
            ¿Mostrar en carrusel?
          </label>
          <button type="submit" className="w-full bg-[#0F2C33] text-white py-2 rounded hover:bg-[#21616A]">
            Guardar
          </button>
        </form>
      </div>

      {/* Vista previa */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#0F2C33]">Vista previa</h2>
        {formData.image && (
          <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded mb-4" />
        )}
        <h3 className="text-xl font-bold text-[#2E9CA0]">{formData.title || "Título de la noticia"}</h3>
        <p className="text-sm text-gray-500 mb-2">{formData.category}</p>
        <p className="text-gray-700 mb-4">{formData.short_description}</p>
        <p className="text-gray-600 text-sm">{formData.content}</p>
        {formData.is_featured && (
          <p className="mt-4 inline-block px-3 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
            Noticia destacada
          </p>
        )}
      </div>
    </div>
  );
}
