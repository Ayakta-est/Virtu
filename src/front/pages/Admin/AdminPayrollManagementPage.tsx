import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

interface Payroll {
  id: number;
  userId: number;
  userName: string;
  month: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  details: string;
}

const AdminPayrollManagementPage = () => {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/payroll-management?month=${month}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setPayrolls(data);
    } catch (err) {
      console.error("Error al obtener nóminas:", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePayrolls = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/payroll-management/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ month }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(data.message);
      fetchPayrolls();
    } catch (err) {
      alert("Error al generar nóminas");
      console.error(err);
    }
  };

  const closeModal = () => setSelectedPayroll(null);

  useEffect(() => {
    fetchPayrolls();
  }, [month]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0F2C33] mb-4">Gestor de Nóminas</h1>

      <div className="flex items-center justify-between mb-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <Button variant="secondary" onClick={generatePayrolls}>
          Generar nóminas del mes
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : payrolls.length === 0 ? (
        <p className="text-gray-500">No hay nóminas para este mes.</p>
      ) : (
        <table className="w-full table-auto bg-white shadow rounded text-sm border border-gray-200">
          <thead className="bg-[#E6D1B4] text-[#0F2C33]">
            <tr>
              <th className="text-left px-4 py-2">Empleado</th>
              <th className="text-left px-4 py-2">Mes</th>
              <th className="text-left px-4 py-2">Salario Bruto</th>
              <th className="text-left px-4 py-2">Deducciones</th>
              <th className="text-left px-4 py-2">Salario Neto</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2">{p.userName}</td>
                <td className="px-4 py-2">{p.month}</td>
                <td className="px-4 py-2">{p.grossSalary.toFixed(2)} €</td>
                <td className="px-4 py-2">{p.deductions.toFixed(2)} €</td>
                <td className="px-4 py-2 font-semibold">{p.netSalary.toFixed(2)} €</td>
                <td className="px-4 py-2">
                  <Button variant="ghost" onClick={() => setSelectedPayroll(p)}>Editar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={!!selectedPayroll} onClose={closeModal} title="Editar Nómina">
        <p>Próximamente: Formulario de edición</p>
      </Modal>
    </div>
  );
};

export default AdminPayrollManagementPage;
