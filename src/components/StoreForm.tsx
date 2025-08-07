import { useRef, useState } from "react";
import { useFormStore } from "../state/formStore";

export default function StoreForm() {
  const [form, setForm] = useState({ name: "", address: "" });
  const { setStoreData } = useFormStore();
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false); // 🔒 bloqueo manual

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting.current) return; // 🔒 Evita que entren varias
    isSubmitting.current = true;
    setLoading(true);

    try {
      console.log("Enviando tienda:", form);
      setStoreData(form);
      await new Promise((res) => setTimeout(res, 1000));
      alert("Tienda registrada!");
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <input
        type="text"
        placeholder="Nombre de la tienda"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Dirección"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="border p-2 rounded"
      />
      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
        {loading ? "Enviando..." : "Registrar"}
      </button>
    </form>
  );
}
