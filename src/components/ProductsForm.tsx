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
            Imagen: null as File | null,
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
        console.log(form.Imagen);

        try {
            const newData = {
                ...form,
                IdEmployee: "202507181825140006782",
                Fecha: Date.now().toString(),
                Lugar: "",
                FechaEndExits: "N/A",
                EstadoDelProducto: "En existencia",
                InStock: true,
                RegistrationType: 0
            };

            setProductData(newData);
            console.log("Enviando tienda:", newData);
            await axios.post("http://localhost:3001/productos", newData, { headers: { "Content-Type": "multipart/form-data" } });
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
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto p-4">
            {[
                { label: "Código de barras externo", key: "CodigoChino", type: "text" },
                { label: "Código de barras interno", key: "CodigoBarras", type: "text" },
                { label: "Nombre del producto", key: "Nombre", type: "text" },
                { label: "Descripción del producto", key: "Descripcion", type: "text" },
                { label: "Costo del producto", key: "PrecioCosto", type: "number" },
                { label: "Precio Unitario", key: "PrecioUnitario", type: "number" },
                { label: "Contenido Interno", key: "Contenido", type: "number" },
                { label: "Precio al público", key: "PrecioPublico", type: "number" },
                { label: "Stock", key: "stock", type: "number" },
                { label: "Ganancia unitaria", key: "GananciaPorUnidad", type: "number" },
                { label: "Adicione una imagen del producto", key: "Imagen", type: "file" },
            ].map(({ label, key, type }) => {
                const formKey = key as keyof typeof form;

                return (
                    <div key={key} className="w-full sm:w-[48%] flex flex-col">
                        <label className="mb-1 font-semibold">{label}</label>
                        <input
                            type={type}
                            placeholder={label}
                            value={
                                type === "file"
                                    ? undefined
                                    : typeof form[formKey] === "number" || typeof form[formKey] === "string"
                                        ? form[formKey]
                                        : ""
                            }
                            onChange={(e) => {
                                if (type === "file") {
                                    setForm({ ...form, [formKey]: e.target.files?.[0] || null });
                                } else if (type === "number") {
                                    setForm({ ...form, [formKey]: parseFloat(e.target.value) });
                                } else {
                                    setForm({ ...form, [formKey]: e.target.value });
                                }
                            }}
                            className="border p-2 rounded"
                        />
                    </div>
                );
            })}

            <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-[48%] bg-blue-500 text-white p-2 rounded mt-2"
            >
                {loading ? "Enviando..." : "Registrar"}
            </button>
        </form>


    );
}
