import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Payroll {
  id: number;
  month: string;
  netSalary: number;
}

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payroll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener nóminas");

        const data = await res.json();
        setPayrolls(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, []);

  if (loading) {
    return <p className="text-center mt-8 text-gray-600">Cargando nóminas...</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-[#0F2C33] mb-4">Mis Nóminas</h1>

      {payrolls.length === 0 ? (
        <p className="text-gray-500">No hay nóminas disponibles.</p>
      ) : (
        <table className="w-full table-auto bg-white shadow rounded text-sm border border-gray-200">
          <thead className="bg-[#E6D1B4] text-[#0F2C33]">
            <tr>
              <th className="text-left px-4 py-2">Mes</th>
              <th className="text-left px-4 py-2">Salario Neto</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2">{p.month}</td>
                <td className="px-4 py-2">{p.netSalary.toFixed(2)} €</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => navigate(`/employee/payroll/${p.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PayrollPage;
