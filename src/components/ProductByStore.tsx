import { useRef, useState } from "react";
import { useFormStore } from "../state/formStore";
import axios from "axios";

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
    Imagen: "",
    FechaEndExits: "",
    RegistrationType: "",
    IdProduct: ""
  });

  const { setProductData } = useFormStore();
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  const [seacrch, setSearch] = useState({ text: "" });
  const [products, setProducts] = useState([]);

  const handleFillingOutForm = async (product: any) => {
    setForm((prev) => ({
      ...prev,
      CodigoBarras: product?.CodigoBarras ?? "",
      CodigoChino: product?.CodigoChino ?? "",
      Nombre: product?.Nombre || "",
      Descripcion: product?.Descripcion || "",
      PrecioCosto: product?.PrecioCosto || 0,
      PrecioUnitario: product?.PrecioUnitario || 0,
      PrecioPublico: product?.PrecioPublico || 0,
      Contenido: product?.Contenido || 0,
      stock: product?.stock ?? prev.stock,
      EstadoDelProducto: product?.EstadoDelProducto || "",
      Lugar: product?.Lugar || "",
      Imagen: product?.Imagen || "",
      Fecha: product?.Fecha || prev.Fecha,
      FechaEndExits: product?.FechaEndExits || prev.FechaEndExits,
      IdEmployee: product?.IdEmployee || prev.IdEmployee,
      IdProduct: product?.IdProduct||prev.IdProduct
    }));

  }

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
        Imagen: null,
        FechaEndExits: "N/A",
        EstadoDelProducto: "En existencia",
        InStock: true,
        RegistrationType: 1,
      };

      setProductData(newData);
      console.log("Enviando tienda:", newData);
      await axios.post("http://localhost:3001/productos/bystore", newData);
      alert("Producto Registrado!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message?.[0] || "Error desconocido";
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

  const handleSearchProdcustBlur = async () => {
    if (!seacrch.text.trim()) return;

    try {

      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:3001/productos/byname",
        { name: seacrch.text }
      );

      console.log(data);
      setProducts(data);

    } catch (err) {
      console.error("No se pudo obtener el producto:", err);
      alert("Producto no encontrado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen overflow-hidden">

      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 h-screen overflow-y-auto p-4 sm:p-6 bg-white border-r"
      >
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { label: "Código de barras externo", value: form.CodigoChino, disabled: true, barcode: true, key: "CodigoChino" },
            { label: "Código de barras interno", value: form.CodigoBarras, disabled: true, barcode: true, key: "CodigoBarras" },
            { label: "Nombre del producto", value: form.Nombre, disabled: true, key: "Nombre" },
            { label: "Descripción del producto", value: form.Descripcion, disabled: true, key: "Descripcion" },
            { label: "Precio al público", value: form.PrecioPublico, key: "PrecioPublico", disabled: true, type: "number" },
            { label: "Stock", value: form.stock, key: "stock", type: "number" },
          ].map(({ label, value, key, type = "text", disabled = false, barcode = false }) => (
            <div key={key} className="w-full sm:w-[48%] bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
              <input
                type={type}
                placeholder={label}
                value={value}
                disabled={disabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]: type === "number" ? parseFloat(e.target.value) : e.target.value
                  })
                }
                className={`w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${barcode ? "font-barcode text-4xl" : ""}`}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-4"
        >
          {loading ? "Enviando..." : "Registrar"}
        </button>
      </form>


      <div className="w-full md:w-1/2 h-screen overflow-y-auto p-4 bg-gray-50">
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Buscar producto
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Producto"
              value={seacrch.text}
              onChange={(e) => setSearch({ ...seacrch, text: e.target.value })}
              onBlur={handleSearchProdcustBlur}
              className="flex-1 border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleSearchProdcustBlur}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              Buscar
            </button>
          </div>
        </div>
        <h2 className="font-bold mb-4 text-lg">Productos encontrados</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No hay resultados</p>
        ) : (
          <ul className="space-y-3">
            {products.map((prod: any) => {
              let base64 = "";
              const hasImageData = prod.ImagenBuffer?.data && Array.isArray(prod.ImagenBuffer.data);

              if (hasImageData) {
                try {
                  base64 = btoa(
                    String.fromCharCode(...new Uint8Array(prod.ImagenBuffer.data))
                  );
                } catch (err) {
                  console.error("Error al convertir imagen a base64:", err);
                }
              }

              return (
                <li
                  key={prod.CodigoBarras}
                  className="p-4 bg-white border rounded shadow-sm hover:bg-blue-50 cursor-pointer flex gap-4 items-center"
                  onClick={() => handleFillingOutForm(prod)}
                >
                  {/* Columna izquierda: Información */}
                  <div className="flex-1">
                    <p className="font-semibold">Producto: {prod.Nombre}</p>
                    <p className="text-sm text-gray-600">Descripción: {prod.Descripcion}</p>
                    <p className="text-sm text-gray-600">Precio: ${prod.PrecioPublico}</p>
                  </div>

                  {/* Columna derecha: Imagen */}
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded border bg-gray-100 flex items-center justify-center">
                    {base64 ? (
                      <img
                        src={`data:${prod.ImagenMimeType};base64,${base64}`}
                        alt={prod.Nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">Sin imagen</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
