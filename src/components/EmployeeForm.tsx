import { useState, useRef } from "react";
import axios from "axios";
import { useFormStore } from "../state/formStore";

export default function EmployeeForm() {
  type FormType = {
    FullName: string;
    Age: string;
    Position: string;
    Role: string;
    StartDate: string;
    IdStore: string;
    Seniority: string;
    Address: string;
    Birthday: string;
  };
  const [form, setForm] = useState<FormType>({
    FullName: "",
    Age: "",
    Position: "",
    Role: "",
    StartDate: "",
    IdStore: "",
    Seniority: "",
    Address: "",
    Birthday: ""
  });
  const [birthdays, setBirday] = useState({
    BirthdayMonth: "",
    BirthdayDay: ""
  })
  const { setEmployeeData } = useFormStore();
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setLoading(true);
    try {
      setEmployeeData(form);
      await axios.post("http://localhost:3001/employes", form);
      alert("Empleado registrado correctamente");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message?.[0] || "Error desconocido";
        console.error("Error:", message);
        alert(message);
      } else if (error instanceof Error) {
        console.error("Error:", error.message);
        alert(error.message);
      } else {
        console.error("Error inesperado", error);
        alert("Ocurrió un error inesperado");
      }
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <label className="border p-2 rounded" >Nombre del empleado</label>

      <input
        type="text"
        placeholder="Nombre"
        value={form.FullName}
        onChange={(e) => setForm({ ...form, FullName: e.target.value })}
        className="border p-2 rounded"
      />

      <label className="border p-2 rounded" >Puesto</label>

      <input
        type="text"
        placeholder="Puesto"
        value={form.Position}
        onChange={(e) => setForm({ ...form, Position: e.target.value })}
        className="border p-2 rounded"
      />

      <label className="border p-2 rounded" >Roll</label>

      <input
        type="text"
        placeholder="Roll"
        value={form.Role}
        onChange={(e) => setForm({ ...form, Role: e.target.value })}
        className="border p-2 rounded"
      />

      <label className="border p-2 rounded">Fecha de inicio laboral</label>

      <input
        type="date"
        value={form.StartDate}
        onChange={(e) => setForm({ ...form, StartDate: e.target.value })}
        className="border p-2 rounded"
      />

      <label className="border p-2 rounded" >Tienda</label>

      <input
        type="text"
        placeholder="Selecciona una tienda"
        value={form.IdStore}
        onChange={(e) => setForm({ ...form, IdStore: e.target.value })}
        className="border p-2 rounded"
      />

      <label className="border p-2 rounded" >Direccion</label>

      <input
        type="text"
        placeholder="Direccion"
        value={form.Address}
        onChange={(e) => setForm({ ...form, Address: e.target.value })}
        className="border p-2 rounded"
      />


      <label className="border p-2 rounded">Cumpleaños</label>

      <select
        value={birthdays.BirthdayMonth}
        onChange={(e) => {
          const month = e.target.value;
          const day = birthdays.BirthdayDay;
          const birthday = month && day ? `${month}-${day}` : "";
          setBirday({ ...birthdays, BirthdayMonth: month });
          setForm({ ...form, Birthday: birthday });
        }}
        className="border p-2 rounded mr-2"
      >
        <option value="">Mes</option>
        {Array.from({ length: 12 }, (_, i) => {
          const value = String(i + 1).padStart(2, '0');
          const label = new Date(0, i).toLocaleString('es-MX', { month: 'long' });
          return <option key={value} value={value}>{label}</option>;
        })}
      </select>
      <select
        value={birthdays.BirthdayDay}
        onChange={(e) => {
          const day = e.target.value;
          const month = birthdays.BirthdayMonth;
          const birthday = month && day ? `${month}-${day}` : "";
          setForm({ ...form, Birthday: birthday });
          setBirday({ ...birthdays, BirthdayDay: day });
        }}
        className="border p-2 rounded"
      >
        <option value="">Día</option>
        {Array.from({ length: 31 }, (_, i) => {
          const value = String(i + 1).padStart(2, '0');
          return <option key={value} value={value}>{value}</option>;
        })}
      </select>

      <input
        type="text"
        placeholder="Edad"
        value={form.Age}
        onChange={(e) => setForm({ ...form, Age: e.target.value })}
        className="border p-2 rounded"
      />

      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
        {loading ? "Enviando..." : "Registrar"}
      </button>
    </form>
  );
}
