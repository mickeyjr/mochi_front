import { useRef, useState } from "react";
import axios from "axios";

interface Product {
  idProduct: string;
  nombre: string;
  Descripcion: string;
  CodigoBarras: string;
  CodigoChino: string;
  PrecioPublico: number;
  imagenMimeType?: string;
  imagenBuffer?: number[];
}

interface ProductWithPieces extends Product {
  numeroDePiezas: number;
}

export default function StoreForm() {
  const [form, setForm] = useState<{
    PaymentReceived: number;
    PaymentType: string;
    SalesLocation: string;
    IdStore: string;
    IdCashRegister: string;
    IdEmployee: string;
    Descripcion: string;
    products: ProductWithPieces[];
    Total: number;
  }>({
    Descripcion: "",
    PaymentReceived: 0,
    PaymentType: "",
    SalesLocation: "",
    IdStore: "",
    IdCashRegister: "",
    IdEmployee: "",
    products: [],
    Total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const isSubmitting = useRef(false);
  const [showErrorMonto, setShowErrorMonto] = useState(false);
  const [showErrorPayment, setShowErrorPayment] = useState(false);



  const SearchProducts = async (text: string) => {
    try {
      const res = await axios.post("http://localhost:3001/productos/sales/store/name", {
        name: text,
        store: "MX-ME-AP-01",
      });
      console.log(res);
      const products = res.data.map((p: any) => ({
        idProduct: p.IdProduct, // Asegura usar el ObjectId correcto
        nombre: p.Nombre,
        Descripcion: p.Descripcion,
        CodigoBarras: p.CodigoBarras,
        CodigoChino: p.CodigoChino,
        PrecioPublico: p.PrecioPublico,
        imagenMimeType: p.imagenes?.[0]?.ImagenMimeType,
        imagenBuffer: p.imagenes?.[0]?.ImagenBuffer?.data || [],
      }));

      setAllProducts(products);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const addProduct = (product: Product) => {
    if (form.products.some((p) => p.idProduct === product.idProduct)) return;

    setForm((prevForm) => {
      const newProducts = [...prevForm.products, { ...product, numeroDePiezas: 1 }];
      const newTotal = newProducts.reduce(
        (sum, p) => sum + p.PrecioPublico * p.numeroDePiezas,
        0
      );

      return {
        ...prevForm,
        products: newProducts,
        Total: newTotal,
      };
    });
  };

  const removeProduct = (idProduct: string) => {
    setForm((prevForm) => {
      const newProducts = prevForm.products.filter((p) => p.idProduct !== idProduct);
      const newTotal = newProducts.reduce(
        (sum, p) => sum + p.PrecioPublico * p.numeroDePiezas,
        0
      );

      return {
        ...prevForm,
        products: newProducts,
        Total: newTotal,
      };
    });
  };

  const updateStock = (idProduct: string, value: number) => {
    if (!isNaN(value) && value > 0) {
      setForm((prevForm) => {
        const newProducts = prevForm.products.map((p) =>
          p.idProduct === idProduct ? { ...p, numeroDePiezas: value } : p
        );
        const newTotal = newProducts.reduce(
          (sum, p) => sum + p.PrecioPublico * p.numeroDePiezas,
          0
        );

        return {
          ...prevForm,
          products: newProducts,
          Total: newTotal,
        };
      });
    }
  };

  const PaymentLess = () => {
    if (form.PaymentReceived < form.Total) {
      setShowErrorMonto(true);
    } else {
      setShowErrorMonto(false);
    }
    if (form.PaymentType.length > 0) {
      setShowErrorPayment(false);
    } else {
      setShowErrorPayment(true);
    }

  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting.current) return;

    if (!form.PaymentType || !form.PaymentReceived || form.products.length === 0) {
      setShowErrorMonto(true);
      setShowErrorPayment(true);
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    isSubmitting.current = true;
    setLoading(true);

    try {
      const payload = {
        PaymentReceived: form.PaymentReceived,
        PaymentType: form.PaymentType,
        SalesLocation: "Apaxco",
        IdStore: "MX-ME-AP-01",
        IdCashRegister: "AP-CJ-01",
        IdEmployee: "1234",
        products: form.products.map(p => ({
          idProduct: p.idProduct,
          nombre: p.nombre,
          numeroDePiezas: p.numeroDePiezas
        })),
        Total: form.Total,
      };

      let response = await axios.post("http://localhost:3001/sales/save", payload);
      
      alert("Venta registrada!, " + "Cambio: " + response.data.data.cambio);
      console.log(response)
      setForm((prev) => ({
        ...prev,
        Descripcion: "",
        PaymentReceived: 0,
        PaymentType: "",
        SalesLocation: "",
        IdStore: "",
        IdCashRegister: "",
        IdEmployee: "",
        products: [],
        Total: 0,
      }));
    } catch (error) {
      console.error("Error al enviar la venta:", error);
      alert("Ocurrió un error al registrar la venta.");
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }
  };


  const renderImage = (mimeType?: string, buffer?: number[]) => {
    if (!mimeType || !buffer || buffer.length === 0) return null;

    const base64 = btoa(String.fromCharCode(...buffer));
    return (
      <img
        src={`data:${mimeType};base64,${base64}`}
        alt="Producto"
        className="w-16 h-16 object-cover rounded"
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-10 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Productos disponibles */}
        <div className="flex-1 border p-4 rounded shadow bg-white">
          <h2 className="font-bold mb-2">Productos disponibles</h2>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full mb-3"
            onBlur={(e) => SearchProducts(e.target.value)}
          />
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {allProducts
              .filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()))
              .map((product) => (
                <div
                  key={product.idProduct}
                  className="p-3 border rounded flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => addProduct(product)}
                >
                  {renderImage(product.imagenMimeType, product.imagenBuffer)}
                  <div>
                    <p className="font-semibold">{product.nombre}</p>
                    <p className="text-sm text-gray-500">{product.Descripcion}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Productos añadidos */}
        <div className="flex-1 border p-4 rounded shadow bg-white">
          <h2 className="font-bold mb-2">Productos añadidos</h2>
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {form.products.map((p) => (
              <div
                key={p.idProduct}
                className="p-3 border rounded flex gap-3 items-center"
              >
                {renderImage(p.imagenMimeType, p.imagenBuffer)}
                <div className="flex-1">
                  <p className="font-semibold">{p.nombre}</p>
                  <p className="text-sm text-gray-500">Descripción: {p.Descripcion}</p>
                  <p className="text-sm text-gray-500">Precio: {p.PrecioPublico}</p>
                  <input
                    type="number"
                    min={1}
                    value={p.numeroDePiezas}
                    onChange={(e) =>
                      updateStock(p.idProduct, Number(e.target.value))
                    }
                    className="border rounded p-1 w-20 mt-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeProduct(p.idProduct)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pago */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Tipo de pago */}
        <div className="flex flex-col w-48">
          <label className="block mb-1">Tipo de pago</label>
          <select
            value={form.PaymentType}
            onChange={(e) => setForm({ ...form, PaymentType: e.target.value })}
            className="border p-2 rounded"
            onBlur={PaymentLess}
            onClick={PaymentLess}
          >
            <option value="">Selecciona...</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
          {showErrorPayment && (
            <label className="block mb-1 text-red-500">
              Tipo de pago es obligatorio
            </label>
          )}
        </div>

        {/*Total*/}
        <div className="flex flex-col w-40">
          <label className="block mb-1">Total</label>
          <input
            type="number"
            placeholder="Total de compra"
            value={form.Total}
            disabled
            className="border p-2 rounded"
          />
        </div>

        {/* Monto */}
        <div className="flex flex-col w-40">
          <label className="block mb-1">Monto recibido</label>
          <input
            type="number"
            placeholder="Monto recibido"
            value={form.PaymentReceived}
            onChange={(e) =>
              setForm({ ...form, PaymentReceived: parseFloat(e.target.value) })
            }
            className="border p-2 rounded"
            onBlur={PaymentLess}
          />

          {showErrorMonto && (
            <label className="block mb-1 text-red-500">
              El monto de pago no puede ser menor
            </label>
          )}
        </div>


        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Enviando..." : "Registrar"}
        </button>
      </div>

    </form>
  );
}
