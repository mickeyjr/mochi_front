import StoreForm from "../components/StoreForm";

export default function StorePage() {
  return (

    
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6"> Registrar Tienda</h1>
      <div className="w-full max-w-2xl"></div>
      <StoreForm />
    </div>
  );
}
