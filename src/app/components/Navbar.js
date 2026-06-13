"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function Navbar() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // El usuario está logueado en Auth. Tomamos su UID.
        try {
          //Buscamos su documento en la colección "users" de Firestore
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Guardamos los datos de la base de datos en el estado
            setUserData(docSnap.data());
          } else {
            console.log("No se encontró el documento del usuario en Firestore");
          }
        } catch (error) {
          console.error("Error obteniendo datos del usuario:", error);
        }
      } else {
        // No hay sesión activa
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

  return (
    <nav className="bg-steam-panel px-4 sm:px-8 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center border-b border-steam-light">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <Link href="/" className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
          <span className="text-steam-accent">Bit & Byte Games</span>
        </Link>
        <Link href="/store" className="text-steam-text hover:text-white transition text-sm sm:text-base">TIENDA</Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center w-full sm:w-auto">
        {loading ? (
          <span className="text-steam-text text-sm">Cargando...</span>
        ) : userData ? (
          <>
            <span className="text-steam-text text-sm sm:text-base">Hola, {userData.name}</span>
            <button 
              onClick={handleLogout}
              className="text-steam-text hover:text-red-400 transition border border-steam-light px-3 py-1 rounded w-full sm:w-auto"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center w-full sm:w-auto">
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