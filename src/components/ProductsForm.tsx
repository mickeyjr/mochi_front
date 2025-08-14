import { useRef, useState } from "react";
import { useFormStore } from "../state/formStore";
import axios from "axios";

export default function StoreForm() {
    const [form, setForm] = useState(
        {
            CodigoChino: "",
            CodigoBarras: "",
            Nombre: "",
            Descripcion: "",
            PrecioCosto: 0,
            PrecioUnitario: 0,
            IdEmployee: "",
            PrecioPublico: 0,
            Contenido: 0,
            stock: 0,
            EstadoDelProducto: "",
            InStock: true,
            GananciaPorUnidad: 0,
            Fecha: "",
            Lugar: "",
            Imagen: "",
            FechaEndExits: "",
            RegistrationType: "",
        }
    );

    const { setProductData } = useFormStore();
    const [loading, setLoading] = useState(false);
    const isSubmitting = useRef(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting.current) return;
        isSubmitting.current = true;
        setLoading(true);

        try {
            const newData = {
                ...form,
                IdEmployee: "202507181825140006782",
                Fecha: Date.now().toString(),
                Lugar: "",
                Imagen: "Test",
                FechaEndExits: "N/A",
                EstadoDelProducto: "En existencia",
                InStock: true,
                RegistrationType: 0
            };

            setProductData(newData);
            console.log("Enviando tienda:", newData);
            await axios.post("http://localhost:3001/productos", newData);
            alert("Producto Registrado!");

        }
        catch (error: unknown) {
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

            <label className="border p-2 rounded" >Codigo de barras externo</label>

            <input
                type="text"
                placeholder="Codigo de barras Externo"
                value={form.CodigoChino}
                onChange={(e) => setForm({ ...form, CodigoChino: e.target.value })}
                className="border p-2 rounded"
            />

            <label className="border p-2 rounded" >Codigo de barras interno</label>

            <input
                type="text"
                placeholder="Codigo de barras interno"
                value={form.CodigoBarras}
                onChange={(e) => setForm({ ...form, CodigoBarras: e.target.value })}
                className="border p-2 rounded"
            />

            <label className="border p-2 rounded" >Nombre del producto</label>

            <input
                type="text"
                placeholder="Nombre de producto"
                value={form.Nombre}
                onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
                className="border p-2 rounded"
            />

            <label className="border p-2 rounded" >Descripcion del producto</label>

            <input
                type="text"
                placeholder="Descripcion de producto"
                value={form.Descripcion}
                onChange={(e) => setForm({ ...form, Descripcion: e.target.value })}
                className="border p-2 rounded"
            />

            <label className="border p-2 rounded" >Costo del producto</label>

            <input
                type="number"
                placeholder="Costo del producto"
                value={form.PrecioCosto}
                onChange={(e) => setForm({ ...form, PrecioCosto: parseFloat(e.target.value) })}
                className="border p-2 rounded"
            />

            <label className="border p-2 rounded" >Precio Unitario</label>

            <input
                type="number"
                placeholder="Precio Unitario"
                value={form.PrecioUnitario}
                onChange={(e) => setForm({ ...form, PrecioUnitario: parseFloat(e.target.value) })}
                className="border p-2 rounded"
            />

            <label className="border p-2 rounded" >Contenido Interno</label>

            <input
                type="number"
                placeholder="Contenido interno"
                value={form.Contenido}
                onChange={(e) => setForm({ ...form, Contenido: parseFloat(e.target.value) })}
                className="border p-2 rounded"
            />

            <label className="border p-2 rounded" >Precio al pulico</label>

            <input
                type="number"
                placeholder="Precio al publico"
                value={form.PrecioPublico}
                onChange={(e) => setForm({ ...form, PrecioPublico: parseFloat(e.target.value) })}
                className="border p-2 rounded"
            />

            <label className="border p-2 rounded" >stock</label>

            <input
                type="number"
                placeholder="stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseFloat(e.target.value) })}
                className="border p-2 rounded"
            />

            <label className="border p-2 rounded" >Ganancia unitaria</label>

            <input
                type="number"
                placeholder="stock"
                value={form.GananciaPorUnidad}
                onChange={(e) => setForm({ ...form, GananciaPorUnidad: parseFloat(e.target.value) })}
                className="border p-2 rounded"
            />

            <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded ">
                {loading ? "Enviando..." : "Registrar"}
            </button>
        </form>
    );
}
