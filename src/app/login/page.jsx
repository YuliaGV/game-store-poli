"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirige a la tienda
    } catch (error) {
      setError("Credenciales incorrectas o usuario no encontrado.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="bg-steam-panel p-8 rounded shadow-lg w-full max-w-sm border border-steam-light">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Iniciar sesión</h1>
        
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Correo Electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent" 
          />
            
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="p-3 bg-steam-bg text-white border border-steam-light rounded focus:outline-none focus:border-steam-accent" 
          />
            
          <button type="submit" 
            className="mt-4 bg-gradient-to-r from-steam-light to-steam-accent text-white font-bold py-3 rounded hover:brightness-110 transition">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}