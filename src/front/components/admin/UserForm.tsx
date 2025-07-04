import React, { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { createUser } from "../../services/userService";

interface UserFormProps {
  initialData?: {
    id?: number;
    name: string;
    password?: string;
    identification_number?: string;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!initialData;
  const [form, setForm] = useState({
    name: "",
    password: "",
    identification_number: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        password: "",
        identification_number: initialData.identification_number || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      // TO DO: update user logic
    } else {
      try {
        await createUser({ name: form.name, password: form.password });
        onSuccess();
      } catch (err) {
        console.error("Error creando usuario", err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Ej: Ana García"
      />

      {!isEditing && (
        <Input
          label="Contraseña"
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="••••••"
        />
      )}

      {isEditing && (
        <Input
          label="ID de empleado"
          name="identification_number"
          value={form.identification_number}
          readOnly
        />
      )}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">{isEditing ? "Actualizar" : "Crear"}</Button>
      </div>
    </form>
  );
};

export default UserForm;
