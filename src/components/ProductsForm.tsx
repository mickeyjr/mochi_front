import { useEffect, useRef, useState } from "react";
import { useFormStore } from "../state/formStore";
import axios from "axios";
import CameraCapture from "./CameraCapture";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

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
        RegistrationType: 0,
        Serie: "",
        Brand: ""
    });

    const { setProductData } = useFormStore();
    const [loading, setLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const isSubmitting = useRef(false);
    const [showScanner, setShowScanner] = useState(false);
    const [scannerTarget, setScannerTarget] = useState<"CodigoChino" | "CodigoBarras" | null>(null);
    const [lastScan, setLastScan] = useState<string | null>(null);
    const [scanTimeout, setScanTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);


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
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={form.CodigoChino}
                        onChange={(e) => setForm({ ...form, CodigoChino: e.target.value })}
                        className="border p-2 rounded flex-1"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setScannerTarget("CodigoChino");
                            setShowScanner(true);
                        }}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        📷
                    </button>
                </div>
            </div>

            {/* Código de barras interno */}
            <div className="w-full sm:w-[48%] flex flex-col">
                <label className="mb-1 font-semibold">Código de barras interno</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={form.CodigoBarras}
                        onChange={(e) => setForm({ ...form, CodigoBarras: e.target.value })}
                        className="border p-2 rounded flex-1"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setScannerTarget("CodigoBarras");
                            setShowScanner(true);
                        }}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        📷
                    </button>
                </div>
            </div>

            {showScanner && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-2xl shadow-lg max-w-md w-full flex flex-col items-center">
                        <h2 className="text-lg font-semibold mb-4">Escanear código de barras</h2>

                        {/* Contenedor centrado del escáner */}
                        <div className="flex items-center justify-center w-[320px] h-[320px] overflow-hidden rounded-lg border">
                            <BarcodeScannerComponent
                                width={640}
                                height={480}
                                onUpdate={(err, result) => {
                                    if (result) {
                                        const code = result.getText();

                                        if (scanTimeout) clearTimeout(scanTimeout);

                                        const timeout = setTimeout(() => {
                                            if (lastScan === code) {
                                                if (scannerTarget) {
                                                    setForm({ ...form, [scannerTarget]: code });
                                                }
                                                setShowScanner(false);
                                            } else {
                                                setLastScan(code);
                                            }
                                        }, 10);

                                        setScanTimeout(timeout);
                                    }
                                }}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowScanner(false)}
                            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}


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

                {/* 📷 Modal SOLO cuando showCamera = true */}
                {showCamera && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-4 rounded-2xl shadow-lg max-w-4xl w-full">
                            <h2 className="text-xl font-semibold mb-4 text-center">
                                Capturar Imagen del producto
                            </h2>

                            <div className="flex justify-center">
                                <CameraCapture
                                    width={1280}
                                    height={720}
                                    onCapture={(file) => {
                                        setForm({ ...form, Imagen: file });
                                        setShowCamera(false);
                                    }}
                                    onClose={() => setShowCamera(false)}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCamera(false)}
                                className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                            >
                                Cerrar
                            </button>
                        </div>
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
