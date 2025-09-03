import ProductUpdateForm from "../components/updatePhotos/ProductPhotoUpdatePageForm";

export default function ProductPhotoUpdatePage() {
  return (

    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6"> Actualiza foto de producto</h1>
      <div className="w-full max-w-2xl"></div>

      <ProductUpdateForm />
    </div>
  );
}
