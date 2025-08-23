import ProductsForm from "../components/ProductByStore";

export default function StorePage() {
  return (

    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Alta de producto por tienda </h1>
      <div className="w-full max-w-2xl"></div>
      <ProductsForm />
    </div>
  );
}
