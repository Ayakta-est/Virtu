import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { store } = useGlobalReducer();
  const user = store.user; // rol usuario logueado

  const goTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-700 p-2 rounded"
        onClick={() => setIsOpen((o) => !o)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`bg-teal-800
          fixed top-0 left-0 h-screen w-64 text-white px-4 py-6 z-40
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:block 
        `}
      >
        <h2
          className="text-2xl font-bold mb-8 text-white cursor-pointer"
          onClick={() => goTo("/")}
        >
          Virtu
        </h2>

        <nav>
          <ul className="space-y-4">
            <li>
              <button onClick={() => goTo("/employee")} className="hover:underline">Mi virtu</button>
            </li>
            <li>
              <button onClick={() => goTo("/employee/dashboardpage")} className="hover:underline">Calendario</button>
            </li>
            <li>
              <button onClick={() => goTo("/employee/payroll")} className="hover:underline">Nómina</button>
            </li>
            <li>
              <button onClick={() => goTo("/employee/timeoff")} className="hover:underline">Oficina de servicios</button>
            </li>
            <li>
              <button onClick={() => goTo("/contact")} className="hover:underline">Habla con nosotros</button>
            </li>
          </ul>
        </nav>

        {/* 👇 SOLO PARA ADMINISTRACIÓN */}
        {user?.role === "admin" && (
          <>
            <hr className="my-6 border-white/30" />
            <h3 className="text-sm text-white/60 uppercase mb-2">Administración</h3>
            <nav>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => goTo("/admin/noticias")} className="hover:underline">
                    Gestión de noticias
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </aside>
    </>
  );
}
