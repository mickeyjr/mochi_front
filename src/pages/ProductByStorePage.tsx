import ProductsForm from "../components/ProductByStore";

export default function StorePage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4"> Alta de producto por tienda </h1>
      <ProductsForm />
    </div>
  );
}
