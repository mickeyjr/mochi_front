import BannerUpdeteForm from "../components/bannersUpdate/BannerUpdateForm";

export default function BannerListPage() {
  return (

    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6"> Actualiza Banner </h1>
      <div className="w-full max-w-2xl"></div>
      <BannerUpdeteForm />
    </div>
  );
}
