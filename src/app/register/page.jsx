"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      //Creamos el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      //Guardamos los datos adicionales en Firestore en la colección "users"
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        role: "customer", // Asignamos el rol por defecto
        createdAt: serverTimestamp(), // Esto genera la fecha exacta en el servidor de Firebase
      });

      // Redirigimos a la tienda tras el registro exitoso
      router.push("/");
    } catch (error) {
      setError("Error al registrarse: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-8">
      <div className="bg-steam-panel p-8 rounded shadow-lg w-full max-w-md border border-steam-light">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Crear cuenta</h1>
        
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required
              className="w-1/2 p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent" />
            <input type="text" name="lastName" placeholder="Apellido" onChange={handleChange} required
              className="w-1/2 p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent" />
          </div>
          
          <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required
            className="p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent" />
            
          <input type="tel" name="phoneNumber" placeholder="Teléfono" onChange={handleChange} required
            className="p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent" />
            
          <input type="text" name="address" placeholder="Dirección de envío" onChange={handleChange} required
            className="p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent" />
            
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required minLength="6"
            className="p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent" />
            
          <button type="submit" 
            className="mt-4 bg-gradient-to-r from-steam-light to-steam-accent text-white font-bold py-3 rounded hover:brightness-110 transition">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}