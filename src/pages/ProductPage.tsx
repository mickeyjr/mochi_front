import ProductsForm from "../components/ProductsForm";

export default function StorePage() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Registrar Producto</h1>
      <div className="w-full max-w-2xl">
        <ProductsForm />
      </div>
    </div>
  );
}
