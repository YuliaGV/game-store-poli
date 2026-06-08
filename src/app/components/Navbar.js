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
    <nav className="bg-steam-panel px-8 py-4 flex justify-between items-center border-b border-steam-light">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold uppercase tracking-wider text-white">
          <span className="text-steam-accent">Bit & Byte Games</span>
        </Link>
        <Link href="/store" className="text-steam-text hover:text-white transition">TIENDA</Link>
      </div>
      
      <div className="flex gap-4 items-center">
        {loading ? (
          <span className="text-steam-text text-sm">Cargando...</span>
        ) : userData ? (
          <>
            <span className="text-steam-text">Hola, {userData.name}</span>
            <button 
              onClick={handleLogout}
              className="text-steam-text hover:text-red-400 transition ml-4 border border-steam-light px-3 py-1 rounded"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-steam-text hover:text-white transition">Iniciar sesión</Link>
            <Link href="/register" className="bg-steam-light hover:bg-steam-accent hover:text-steam-bg text-white px-4 py-2 rounded transition">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}