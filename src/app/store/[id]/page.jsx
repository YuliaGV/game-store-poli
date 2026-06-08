"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetail() {
  const params = useParams();
  const { id } = params; // Este 'id' viene del nombre de la carpeta
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Buscamos el documento específico en la colección "products" usando el ID de la URL
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No se encontró el producto.");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-steam-accent text-xl animate-pulse">Cargando detalles del juego...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <h2 className="text-2xl text-white mb-4">Producto no encontrado</h2>
        <Link href="/store" className="text-steam-accent hover:underline">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/store" className="text-steam-text hover:text-white mb-6 inline-block transition bg-steam-panel px-4 py-2 rounded border border-steam-light">
        &larr; Volver al catálogo
      </Link>

      <div className="bg-steam-panel rounded shadow-xl overflow-hidden flex flex-col md:flex-row border border-steam-light">
        <div className="md:w-1/2">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover min-h-[400px]" 
          />
        </div>

        <div className="p-8 md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-3">{product.title}</h1>

          <div className="flex gap-2 mb-6">
            <span className="text-sm font-semibold text-steam-bg bg-steam-text px-3 py-1 rounded">
              {product.type}
            </span>
            <span className="text-sm font-semibold text-steam-bg bg-steam-accent px-3 py-1 rounded">
              {product.platform}
            </span>
          </div>

          <div className="bg-steam-bg p-5 rounded border border-steam-light mb-8 space-y-3">
            <h3 className="text-steam-accent font-bold mb-2 uppercase tracking-wider text-sm">Especificaciones</h3>
            <div className="flex justify-between border-b border-steam-light pb-2">
              <span className="text-steam-text">Desarrollador:</span>
              <span className="text-white text-right">{product.features?.developer}</span>
            </div>
            <div className="flex justify-between border-b border-steam-light pb-2">
              <span className="text-steam-text">Género:</span>
              <span className="text-white text-right">{product.features?.genre}</span>
            </div>
            <div className="flex justify-between border-b border-steam-light pb-2">
              <span className="text-steam-text">Lanzamiento:</span>
              <span className="text-white text-right">{product.features?.releaseYear}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-steam-text">Unidades en stock:</span>
              <span className={product.stock > 10 ? "text-green-400" : "text-yellow-400"}>
                {product.stock} disponibles
              </span>
            </div>
          </div>

          <div className="mt-auto bg-[#0a0f16] p-6 rounded border border-steam-light flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <span className="text-steam-text">Precio</span>
              <span className="text-4xl font-bold text-steam-accent">{formatPrice(product.price)}</span>
            </div>
            
            <button className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 rounded hover:brightness-110 transition w-full shadow-lg text-lg">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}