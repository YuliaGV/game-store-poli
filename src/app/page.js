"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // Verifica que la ruta apunte a tu archivo firebase.js
import Link from "next/link";

export default function Home() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        // Creamos una consulta ordenando por fecha descendente y limitando a 5
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setRecentProducts(productsList);
      } catch (error) {
        console.error("Error al obtener los productos recientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-steam-panel to-steam-light p-8 md:p-12 rounded-lg mb-12 shadow-lg border border-steam-light flex flex-col items-center text-center">
        <p className="text-steam-text text-lg mb-6 max-w-2xl">
          Explora nuestro catálogo con los mejores títulos en formato físico y digital para todas las plataformas.
        </p>
        <Link 
          href="/store" 
          className="bg-steam-accent text-steam-bg px-8 py-3 rounded text-lg font-bold hover:bg-white transition shadow-lg"
        >
          Ver todo el catálogo
        </Link>
      </div>

      <div className="flex justify-between items-end mb-6 border-b border-steam-light pb-2">
        <h2 className="text-2xl font-semibold text-white uppercase tracking-wider">Agregados Recientemente</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-steam-accent text-xl animate-pulse">Cargando novedades...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recentProducts.map((product) => (
            <div key={product.id} className="bg-steam-panel rounded shadow-md overflow-hidden flex flex-col border border-transparent hover:border-steam-light hover:scale-105 transition duration-300">
              <Link href={`/store/${product.id}`}>
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-40 object-cover cursor-pointer" 
                />
              </Link>
              
              <div className="p-4 flex flex-col flex-grow">
                <Link href={`/store/${product.id}`}>
                  <h3 className="font-bold text-md mb-1 line-clamp-2 text-white hover:text-steam-accent transition cursor-pointer" title={product.title}>
                    {product.title}
                  </h3>
                </Link>
                
                <div className="flex flex-wrap gap-1 mb-3 mt-2">
                  <span className="text-[10px] text-steam-text bg-steam-bg px-2 py-1 rounded border border-steam-light">
                    {product.type}
                  </span>
                  <span className="text-[10px] text-steam-text bg-steam-bg px-2 py-1 rounded border border-steam-light">
                    {product.platform}
                  </span>
                </div>

                <div className="mt-auto flex flex-col pt-2 border-t border-steam-light/50">
                  <span className="text-xs text-steam-text">Precio</span>
                  <span className="text-steam-accent font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}