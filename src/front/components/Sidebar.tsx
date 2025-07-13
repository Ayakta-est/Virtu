import React, { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Modal from "../components/ui/Modal";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { store } = useGlobalReducer();
  const user = store.user;
  const sidebarRef = useRef<HTMLDivElement>(null);

  const goTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  // 🔹 Swipe para cerrar
  useEffect(() => {
    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      // Si se desliza a la izquierda más de 50px, cerrar
      if (diff > 50) {
        setIsOpen(false);
      }
    };

    const sidebarEl = sidebarRef.current;
    if (sidebarEl) {
      sidebarEl.addEventListener("touchstart", handleTouchStart);
      sidebarEl.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (sidebarEl) {
        sidebarEl.removeEventListener("touchstart", handleTouchStart);
        sidebarEl.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  return (
    <>
      {/* Botón hamburguesa (solo cuando cerrado) */}
      {!isOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-700 p-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}

      <aside
        ref={sidebarRef}
        className={`bg-teal-800 fixed top-0 left-0 h-screen w-64 text-white px-4 py-6 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:block`}
      >
        {/* Botón cerrar (solo en móvil) */}
        <div className="md:hidden flex justify-end">
          <button onClick={() => setIsOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>

        <h2
          className="text-2xl font-bold mb-8 text-white cursor-pointer"
          onClick={() => goTo("/")}
        >
          Virtu
        </h2>

        <nav>
          <ul className="space-y-4">
            <li><button onClick={() => goTo("/employee")} className="hover:underline">Mi virtu</button></li>
            <li><button onClick={() => goTo("/employee/calendar")} className="hover:underline">Calendario</button></li>
            <li><button onClick={() => goTo("/employee/payroll")} className="hover:underline">Nómina</button></li>
            <li><button onClick={() => goTo("/employee/assistant")} className="hover:underline">Habla con nosotros</button></li>
          </ul>

          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="w-full text-left text-l text-white hover:underline"
            >
              Cerrar sesión
            </button>
          </div>
        </nav>

        {/* ADMINISTRACIÓN */}
        {user?.role === "admin" && (
          <>
            <hr className="my-6 border-white/30" />
            <h3 className="text-sm text-white/60 uppercase mb-2 py-2">Administración</h3>
            <nav>
              <ul className="space-y-3">
                <li><button onClick={() => goTo("admin/users")} className="hover:underline">Gestión de usuarios</button></li>
                <li><button onClick={() => goTo("/admin/notices")} className="hover:underline">Gestión de noticias</button></li>
                <li><button onClick={() => goTo("/admin/calendar-management")} className="hover:underline">Gestión de calendarios</button></li>
                <li><button onClick={() => goTo("admin/payroll-management")} className="hover:underline">Gestión de nóminas</button></li>
              </ul>
            </nav>
          </>
        )}
      </aside>

      {/* Modal de logout */}
      {logoutModalOpen && (
        <Modal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} title="¿Cerrar sesión?">
          <div className="flex justify-end space-x-2">
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded cursor-pointer" onClick={() => setLogoutModalOpen(false)}>Cancelar</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer" onClick={() => {
              localStorage.clear();
              navigate("/loginpage");
            }}>
              Cerrar sesión
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
