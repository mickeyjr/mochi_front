import { useEffect, useRef, useState } from "react";
import { useFormStore } from "../state/formStore";
import axios from "axios";
import CameraCapture from "./CameraCapture";

export default function StoreForm() {
    const [form, setForm] = useState({
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
        Serie: "",
        Brand: ""
    });

    const { setProductData } = useFormStore();
    const [loading, setLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false); // ✅ Ahora dentro del componente
    const isSubmitting = useRef(false);

    type SerieType = { _id: string; Serie: string; num: number; __v?: number };
    type BrandType = { _id: string; Brand: string; num: number; __v?: number };

    const [series, setSeries] = useState<SerieType[]>([]);
    const [brand, setBrand] = useState<BrandType[]>([]);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const resSeries = await axios.get("http://localhost:3001/series");
                const resBrand = await axios.get("http://localhost:3001/brand");
                setSeries(resSeries.data);
                setBrand(resBrand.data);
            } catch (error) {
                console.error("Error al cargar series:", error);
            }
        };
        fetchSeries();
    }, []);

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
                FechaEndExits: "N/A",
                EstadoDelProducto: "En existencia",
                InStock: true,
                RegistrationType: 0
            };

            setProductData(newData);
            await axios.post("http://localhost:3001/productos", newData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Producto Registrado!");
            const initialForm = {
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
                RegistrationType: 0,
                Serie: "",
                Brand: ""
            };

            const [form, setForm] = useState(initialForm);

            setForm(initialForm);

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message?.[0] || "Error desconocido";
                alert(message);
            } else if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Ocurrió un error inesperado");
            }
        } finally {
            isSubmitting.current = false;
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto p-4"
        >
            {/* Código de barras externo */}
            <div className="w-full sm:w-[48%] flex flex-col">
                <label className="mb-1 font-semibold">Código de barras externo</label>
                <input
                    type="text"
                    value={form.CodigoChino}
                    onChange={(e) => setForm({ ...form, CodigoChino: e.target.value })}
                    className="border p-2 rounded"
                />
            </div>

            {/* Código de barras interno */}
            <div className="w-full sm:w-[48%] flex flex-col">
                <label className="mb-1 font-semibold">Código de barras interno</label>
                <input
                    type="text"
                    value={form.CodigoBarras}
                    onChange={(e) => setForm({ ...form, CodigoBarras: e.target.value })}
                    className="border p-2 rounded"
                />
            </div>

            {/* Serie */}
            <div className="w-full sm:w-[48%] flex flex-col">
                <label className="mb-1 font-semibold">Serie</label>
                <select
                    value={form.Serie}
                    onChange={(e) => setForm({ ...form, Serie: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="">Seleccione una serie</option>
                    {series.map((serie) => (
                        <option key={serie._id} value={serie.num}>
                            {serie.Serie}
                        </option>
                    ))}
                </select>
            </div>

            {/* Marca */}
            <div className="w-full sm:w-[48%] flex flex-col">
                <label className="mb-1 font-semibold">Marca</label>
                <select
                    value={form.Brand}
                    onChange={(e) => setForm({ ...form, Brand: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="">Seleccione una Marca</option>
                    {brand.map((b) => (
                        <option key={b._id} value={b.num}>
                            {b.Brand}
                        </option>
                    ))}
                </select>
            </div>

            {/* Otros inputs */}
            {[
                { label: "Nombre del producto", key: "Nombre", type: "text" },
                { label: "Descripción del producto", key: "Descripcion", type: "text" },
                { label: "Costo del producto", key: "PrecioCosto", type: "number" },
                { label: "Precio Unitario", key: "PrecioUnitario", type: "number" },
                { label: "Contenido Interno", key: "Contenido", type: "number" },
                { label: "Precio al público", key: "PrecioPublico", type: "number" },
                { label: "Stock", key: "stock", type: "number" },
                { label: "Ganancia unitaria", key: "GananciaPorUnidad", type: "number" }
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

            {/* Imagen con cámara */}
            <div className="w-full sm:w-[48%] flex flex-col">
                <label className="mb-1 font-semibold">Adicione una imagen del producto</label>

                <div className="flex gap-2">
                    {/* Galería */}
                    <label className="border p-2 rounded flex-1 text-center cursor-pointer bg-gray-100 hover:bg-gray-200">
                        Seleccionar imagen
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, Imagen: e.target.files?.[0] || null })}
                            className="hidden"
                        />
                    </label>

                    {/* Cámara */}
                    <button
                        type="button"
                        onClick={() => setShowCamera(true)}
                        className="border p-2 rounded flex-1 text-center bg-gray-100 hover:bg-gray-200"
                    >
                        Tomar foto
                    </button>
                </div>

                {showCamera && (
                    <div className="mt-2">
                        <CameraCapture
                            onCapture={(file) => setForm({ ...form, Imagen: file })}
                            onClose={() => setShowCamera(false)}
                        />
                    </div>
                )}

                {form.Imagen && (
                    <img
                        src={URL.createObjectURL(form.Imagen)}
                        alt="Preview"
                        className="mt-2 max-h-40 object-contain border rounded"
                    />
                )}
            </div>

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
