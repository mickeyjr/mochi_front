import { useRef, useState } from "react";
import { useFormStore } from "../state/formStore";

export default function StoreForm() {
  const [form, setForm] = useState({
    PaymentReceived: "",
    PaymentType: "",
    SalesLocation: "",
    IdStore: "",
    IdCashRegister: "",
    IdEmployee: "",
    products: [
      {
        idProduct: "",
        nombre: "",
        numeroDePiezas: 0,
        imagen: ""
      }
    ]
  });
  const { setSaleData } = useFormStore();
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setLoading(true);

    try {
      console.log("Enviando tienda:", form);
      setSaleData(form);
      await new Promise((res) => setTimeout(res, 1000));
      alert("Tienda registrada!");
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">

      <label className="block mb-1">Tipo de pago</label>

      <select
        value={form.PaymentType}
        onChange={(e) => setForm({ ...form, PaymentType: e.target.value })}
        className="border p-2 rounded w-full"
      >
        <option value="">Selecciona...</option>
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
      </select>

      <label className="block mb-1">Monto</label>

      <input
        type="text"
        placeholder="Monto recibido"
        value={form.PaymentReceived}
        onChange={(e) => setForm({ ...form, PaymentReceived: e.target.value })}
        className="border p-2 rounded"
      />

      <label className="block mb-1">Adiciona producto</label>

      <label className="block mb-1">En contruccion</label>

      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
        {loading ? "Enviando..." : "Registrar"}
      </button>
    </form>
  );
}
