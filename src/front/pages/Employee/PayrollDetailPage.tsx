import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

interface PayrollDetail {
  id: number;
  month: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  createdAt: string;
}

const PayrollDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payroll, setPayroll] = useState<PayrollDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!id || !token) {
          console.error("Falta ID o token");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employee/payroll/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al cargar detalle de nómina");

        const data = await res.json();
        setPayroll(data);
      } catch (err) {
        console.error("Error en fetchDetail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!id || !token) return;

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employee/payroll/${id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al descargar el PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nomina_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar PDF:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-8 text-gray-600">Cargando detalle de nómina...</p>;
  }

  if (!payroll) {
    return <p className="text-center mt-8 text-red-500">Nómina no encontrada.</p>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-[#0F2C33] mb-4">Detalle de Nómina</h1>

      <div className="bg-white rounded shadow p-4 space-y-2 border border-gray-200">
        <p><strong>Mes:</strong> {payroll.month}</p>
        <p><strong>Salario base:</strong> {payroll.grossSalary.toFixed(2)} €</p>
        <p><strong>Deducciones:</strong> {payroll.deductions.toFixed(2)} €</p>
        <hr />
        <p><strong>Salario neto:</strong> {payroll.netSalary.toFixed(2)} €</p>
        <p className="text-sm text-gray-500">Generado el {new Date(payroll.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>Volver</Button>
        <Button variant="primary" onClick={handleDownloadPDF}>Descargar PDF</Button>
      </div>
    </div>
  );
};

export default PayrollDetailPage;