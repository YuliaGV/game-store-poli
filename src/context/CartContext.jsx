"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escuchar el estado de autenticación para saber qué carrito cargar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Cargar el carrito específico de este usuario desde localStorage
        const savedCart = localStorage.getItem(`cart_${currentUser.uid}`);
        setCart(savedCart ? JSON.parse(savedCart) : []);
      } else {
        // Si no está logueado, el carrito se limpia en memoria
        setCart([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Guardar en localStorage cada vez que el carrito cambie (solo si hay usuario)
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Función para agregar productos
  const addToCart = (product, quantity = 1) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return false; // Retornamos falso pa avisar al componente que no se pudo agregar
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // Si ya existe, aumentamos la cantidad respetando el stock disponible
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }

      // Si es nuevo, lo agregamos
      return [...prevCart, { ...product, quantity }];
    });
    
    return true;
  };

  // Quitamo un producto por completo
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  //  Limpiamos el carrito 
  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, user, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}