"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase"; 
import Link from "next/link";

export default function Tienda() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    platform: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProducts(productsList);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // 1. Extraer categorías únicas dinámicamente para los selectores
  const availablePlatforms = [...new Set(products.map(p => p.platform))];
  const availableTypes = [...new Set(products.map(p => p.type))];

  // 2. Lógica de filtrado (Búsqueda Simple + Avanzada)
  const filteredProducts = products.filter((product) => {
    // Búsqueda simple: Compara el texto escrito con el título (ignorando mayúsculas/minúsculas)
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Búsqueda avanzada: Compara el tipo y plataforma seleccionados
    const matchesType = filters.type === "" || product.type === filters.type;
    const matchesPlatform = filters.platform === "" || product.platform === filters.platform;

    return matchesSearch && matchesType && matchesPlatform;
  });

  // Manejador para los selects de búsqueda avanzada
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-8 border-b border-steam-light pb-4">
        <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Catálogo</h1>
        <span className="text-steam-text">{filteredProducts.length} artículos</span>
      </div>

      {/* --- MÓDULOS DE BÚSQUEDA --- */}
      <div className="bg-steam-panel p-4 rounded mb-8 border border-steam-light shadow-lg">
        {/* Búsqueda Básica */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-2/3 p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent transition"
          />
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full sm:w-auto text-steam-accent hover:text-white transition font-semibold"
          >
            {showAdvanced ? "- Ocultar Filtros" : "+ Búsqueda Avanzada"}
          </button>
        </div>

        {/* Búsqueda Avanzada (Se muestra/oculta al hacer click) */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-steam-light flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-steam-text text-sm mb-1">Formato</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent"
              >
                <option value="">Todos los formatos</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-steam-text text-sm mb-1">Plataforma</label>
              <select 
                name="platform" 
                value={filters.platform} 
                onChange={handleFilterChange}
                className="p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent"
              >
                <option value="">Todas las plataformas</option>
                {availablePlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      {/* --- FIN MÓDULOS DE BÚSQUEDA --- */}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-steam-accent text-xl animate-pulse">Cargando inventario...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-steam-panel rounded shadow-md overflow-hidden flex flex-col border border-transparent hover:border-steam-light hover:scale-105 transition duration-300">
                <Link href={`/store/${product.id}`}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-48 object-cover cursor-pointer" 
                  />
                </Link>
                
                <div className="p-4 flex flex-col flex-grow">
                  <Link href={`/store/${product.id}`}>
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 text-white hover:text-steam-accent transition cursor-pointer" title={product.title}>
                      {product.title}
                    </h3>
                  </Link>
                  
                  <div className="flex gap-2 mb-3 mt-2">
                    <span className="text-xs text-steam-text bg-steam-bg px-2 py-1 rounded border border-steam-light">
                      {product.type}
                    </span>
                    <span className="text-xs text-steam-text bg-steam-bg px-2 py-1 rounded border border-steam-light">
                      {product.platform}
                    </span>
                  </div>

                  <div className="mt-auto flex justify-between items-end pt-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-steam-text">Precio</span>
                      <span className="text-steam-accent font-bold text-lg">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <Link href={`/store/${product.id}`} className="bg-steam-light hover:bg-steam-accent hover:text-steam-bg text-white px-4 py-2 text-sm rounded transition font-semibold shadow-md">
                      Ver más
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-white text-xl mb-2">No se encontraron juegos con esos filtros.</p>
              <button 
                onClick={() => { setSearchTerm(""); setFilters({ type: "", platform: "" }); }}
                className="text-steam-accent hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}