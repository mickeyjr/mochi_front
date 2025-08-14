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
  });

  const { setProductData } = useFormStore();
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  const [seacrch, setSearch] = useState({ text: "" });
  const [products, setProducts] = useState([]);

  const handleFillingOutForm = async (product: any) =>{
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
          GananciaPorUnidad: product?.GananciaPorUnidad || 0,
          EstadoDelProducto: product?.EstadoDelProducto || "",
          Lugar: product?.Lugar || "",
          Imagen: product?.Imagen || "",
          Fecha: product?.Fecha || prev.Fecha,
          FechaEndExits: product?.FechaEndExits || prev.FechaEndExits,
          IdEmployee: product?.IdEmployee || prev.IdEmployee,
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
        Imagen: "Test",
        FechaEndExits: "N/A",
        EstadoDelProducto: "En existencia",
        InStock: true,
        RegistrationType: 0,
      };

      setProductData(newData);
      console.log("Enviando tienda:", newData);
      await axios.post("http://localhost:3001/productos", newData);
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

      setProducts(data);

      const product = data[0];
      /*if (product) {
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
          GananciaPorUnidad: product?.GananciaPorUnidad || 0,
          EstadoDelProducto: product?.EstadoDelProducto || "",
          Lugar: product?.Lugar || "",
          Imagen: product?.Imagen || "",
          Fecha: product?.Fecha || prev.Fecha,
          FechaEndExits: product?.FechaEndExits || prev.FechaEndExits,
          IdEmployee: product?.IdEmployee || prev.IdEmployee,
        }));
      }*/
    } catch (err) {
      console.error("No se pudo obtener el producto:", err);
      alert("Producto no encontrado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen overflow-hidden">

      {/* Columna izquierda: Formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 h-screen overflow-y-auto p-4 sm:p-6 space-y-6 bg-white border-r"
      >

        {/* Campos del producto */}
        {[
          { label: "Código de barras externo", value: form.CodigoChino, key: "CodigoChino" },
          { label: "Código de barras interno", value: form.CodigoBarras, key: "CodigoBarras" },
          { label: "Nombre del producto", value: form.Nombre, key: "Nombre" },
          { label: "Descripción del producto", value: form.Descripcion, key: "Descripcion" },
          { label: "Costo del producto", value: form.PrecioCosto, key: "PrecioCosto", type: "number" },
          { label: "Precio Unitario", value: form.PrecioUnitario, key: "PrecioUnitario", type: "number" },
          { label: "Contenido Interno", value: form.Contenido, key: "Contenido", type: "number" },
          { label: "Precio al público", value: form.PrecioPublico, key: "PrecioPublico", type: "number" },
          { label: "Stock", value: form.stock, key: "stock", type: "number" },
          { label: "Ganancia unitaria", value: form.GananciaPorUnidad, key: "GananciaPorUnidad", type: "number" },
        ].map(({ label, value, key, type = "text" }) => (
          <div key={key} className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
            <input
              type={type}
              placeholder={label}
              value={value}
              onChange={(e) =>
                setForm({ ...form, [key]: type === "number" ? parseFloat(e.target.value) : e.target.value })
              }
              className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Enviando..." : "Registrar"}
        </button>
      </form>

      {/* Columna derecha: Lista de productos */}
      <div className="w-full md:w-1/2 h-screen overflow-y-auto p-4 bg-gray-50">
              {/* Cuadro de búsqueda destacado */}
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
            {products.map((prod: any) => (
              <li
                key={prod.CodigoBarras}
                className="p-4 bg-white border rounded shadow-sm hover:bg-blue-50 cursor-pointer"
                onClick={() =>  handleFillingOutForm(prod)}
              >
                <p className="font-semibold">Producto: {prod.Nombre}</p>
                <p className="text-sm text-gray-600">Descripcion: {prod.Descripcion}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
