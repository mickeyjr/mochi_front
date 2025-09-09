import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCardForm";

const apiUrl = import.meta.env.VITE_API_URL;
const storeId = "MX-ME-AP-01"; // cambiar a futuro por cookie

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${apiUrl}/images-update/${storeId}`)
      .then((res) => res.json())
      .then((data) => { setProducts(data)})
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  const handleUpdateImage = (updatedProduct: any) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.IdProduct === updatedProduct.IdProduct ? updatedProduct : p
      )
    );

  };

  return (
    <div className="min-h-screen  flex flex-wrap justify-center items-start p-8">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onUpdateImage={handleUpdateImage}
        />

      ))}

    </div>
  );
}
