"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useCart } from "../../context/CartContext"; // Importamos el hook global del carrito

export default function Navbar() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Consumimos el estado del carrito
  const { cart } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No se encontró el documento del usuario en Firestore");
          }
        } catch (error) {
          console.error("Error obteniendo datos del usuario:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  // Calculamos la sumatoria total de las cantidades de artículos individuales en la canasta
  const totalItems = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <nav className="bg-steam-panel px-4 sm:px-8 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center border-b border-steam-light">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <Link href="/" className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
          <span className="text-steam-accent">Bit & Byte Games</span>
        </Link>
        <Link href="/store" className="text-steam-text hover:text-white transition text-sm sm:text-base">TIENDA</Link>
      </div>
      
      <div className="flex flex-row gap-4 items-center justify-end w-full sm:w-auto">
        {loading ? (
          <span className="text-steam-text text-sm">Cargando...</span>
        ) : userData ? (
          <div className="flex flex-row items-center gap-4 justify-end w-full sm:w-auto">

            <Link 
              href="/cart" 
              className="relative p-2 bg-steam-bg hover:bg-steam-light text-steam-text hover:text-steam-accent rounded border border-steam-light transition flex items-center justify-center"
              aria-label="Ver carrito"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" 
                />
              </svg>
              
             
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-steam-accent text-steam-bg font-bold text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>

            <span className="text-steam-text text-sm sm:text-base whitespace-nowrap">Hola, {userData.name}</span>
            
            <button 
              onClick={handleLogout}
              className="text-steam-text hover:text-red-400 transition border border-steam-light px-3 py-1 rounded text-sm sm:text-base whitespace-nowrap"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-3 sm:gap-4 sm:items-center w-full sm:w-auto justify-end">
            <Link href="/login" className="text-steam-text hover:text-white transition text-sm sm:text-base text-center sm:text-left">Iniciar sesión</Link>
            <Link href="/register" className="bg-steam-light hover:bg-steam-accent hover:text-steam-bg text-white px-4 py-2 rounded transition text-sm sm:text-base text-center">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}