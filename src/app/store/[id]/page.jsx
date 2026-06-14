"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase"; 
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../../context/CartContext"; 

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params; 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success", 
  });

  const [quantity, setQuantity] = useState(1);

  // Extraemos también "cart" para poder leer qué hay adentro
  const { addToCart, user, cart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  const handleAddToCart = () => {
    if (!user) {
      triggerNotification("Debes iniciar sesión para añadir productos al carrito.", "error");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;

    // Caso 1: Ya tiene el límite en el carrito
    if (currentCartQuantity >= product.stock) {
      triggerNotification(`Ya tienes el máximo disponible (${product.stock}) en tu carrito.`, "error");
      return;
    }

    // Caso 2: Intenta agregar más de lo que sobra
    if (currentCartQuantity + quantity > product.stock) {
      const availableToAdd = product.stock - currentCartQuantity;
      triggerNotification(`Solo puedes añadir ${availableToAdd} unidad(es) más. Ya tienes ${currentCartQuantity} en tu carrito.`, "error");
      return;
    }
    // ---------------------------------------------

    const added = addToCart(product, quantity);
    if (added) {
      triggerNotification(`¡${product.title} (${quantity}) añadido al carrito!`, "success");
      // Opcional: Reiniciar el contador a 1 después de agregar
      setQuantity(1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) return <div className="text-center mt-20 text-steam-accent animate-pulse">Cargando detalles...</div>;
  if (!product) return <div className="text-center mt-20 text-white">Producto no encontrado.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 relative">
      
      {notification.show && (
        <div className={`fixed bottom-5 right-5 z-50 p-4 rounded border shadow-2xl transition-all duration-500 max-w-sm flex items-center gap-3 animate-bounce
          ${notification.type === "success" 
            ? "bg-steam-panel border-steam-accent text-white" 
            : "bg-[#2c1a1a] border-red-500 text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <div className="bg-steam-bg p-1.5 rounded text-steam-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          ) : (
            <div className="bg-[#1a1010] p-1.5 rounded text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
          )}
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      <Link href="/store" className="text-steam-text hover:text-white mb-6 inline-block transition bg-steam-panel px-4 py-2 rounded border border-steam-light">
        &larr; Volver al catálogo
      </Link>

      <div className="bg-steam-panel rounded shadow-xl overflow-hidden flex flex-col md:flex-row border border-steam-light">
        <div className="md:w-1/2">
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover min-h-[400px]" />
        </div>

        <div className="p-8 md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-3">{product.title}</h1>

          <div className="flex gap-2 mb-6">
            <span className="text-sm font-semibold text-steam-bg bg-steam-text px-3 py-1 rounded">{product.type}</span>
            <span className="text-sm font-semibold text-steam-bg bg-steam-accent px-3 py-1 rounded">{product.platform}</span>
          </div>

          <div className="bg-steam-bg p-5 rounded border border-steam-light mb-6 space-y-3">
            <h3 className="text-steam-accent font-bold mb-2 uppercase tracking-wider text-sm">Especificaciones</h3>
            <div className="flex justify-between border-b border-steam-light pb-2">
              <span className="text-steam-text">Género:</span>
              <span className="text-white text-right">{product.features?.genre}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-steam-text">Stock disponible:</span>
              <span className="text-white">{product.stock} uds.</span>
            </div>
          </div>

          <div className="mt-auto bg-[#0a0f16] p-6 rounded border border-steam-light flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-steam-text">Cantidad:</span>
              <div className="flex items-center bg-steam-bg rounded border border-steam-light">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 text-white hover:bg-steam-light transition"
                >
                  -
                </button>
                <span className="px-4 text-white font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="px-3 py-1 text-white hover:bg-steam-light transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-steam-text">Total artículo(s)</span>
              <span className="text-3xl font-bold text-steam-accent">{formatPrice(product.price * quantity)}</span>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 rounded hover:brightness-110 transition w-full shadow-lg text-lg"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}