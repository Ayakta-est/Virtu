import { useEffect, useRef, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import Button from "../../components/ui/Button";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function EmployeeProfile() {
  const { store } = useGlobalReducer();
  const [userData, setUserData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${baseUrl}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ Error ${res.status}: ${errorText}`);
        return;
      }

      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("Error en fetchUser:", err);
    }
  };



  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");
    const res = await fetch(`${baseUrl}/api/profile/upload-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const updated = await res.json();
      setUserData((prev: any) => ({ ...prev, profile_image: updated.profile_image }));
    }
    setUploading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!userData) return <p className="p-4">Cargando perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 md:flex md:items-center md:justify-between">
        {/* Información del usuario + Imagen */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative w-32 h-32 shrink-0">
            <img
              src={userData.profile_image || "/default-profile.png"}
              alt="Foto de perfil"
              className="w-full h-full object-cover rounded-full border border-gray-300 shadow cursor-pointer transition hover:opacity-90"
              onClick={() => fileInputRef.current?.click()}
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                <span className="text-xs font-medium text-gray-600">Subiendo...</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>

          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-semibold text-gray-800">{userData.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{userData.role}</p>
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-500 mb-1">Puesto</label>
          <div className="text-gray-800">{userData.workstation || "—"}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-500 mb-1">Departamento</label>
          <div className="text-gray-800">{userData.departament || "—"}</div>
        </div>
      </div>
    </div>
  );
}
