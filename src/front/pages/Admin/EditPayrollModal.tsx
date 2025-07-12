// src/components/admin/payroll/EditPayrollModal.tsx
import React, { useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

interface EditPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: {
    id: number;
    grossSalary: number;
    deductions: number;
    netSalary: number;
  };
  onSave: () => void;
}

const EditPayrollModal: React.FC<EditPayrollModalProps> = ({ isOpen, onClose, payroll, onSave }) => {
  const [gross, setGross] = useState(payroll.grossSalary);
  const [deductions, setDeductions] = useState(payroll.deductions);
  const [loading, setLoading] = useState(false);
  const net = gross - deductions;

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/payroll/${payroll.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gross_salary: gross,
          deductions: deductions,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar cambios");
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("No se pudieron guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Nómina">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0F2C33]">Salario Bruto (€)</label>
          <input
            type="number"
            value={gross}
            onChange={(e) => setGross(parseFloat(e.target.value))}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F2C33]">Deducciones (€)</label>
          <input
            type="number"
            value={deductions}
            onChange={(e) => setDeductions(parseFloat(e.target.value))}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <p className="text-sm text-gray-600">
          <strong>Salario Neto:</strong> {net.toFixed(2)} €
        </p>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPayrollModal;
