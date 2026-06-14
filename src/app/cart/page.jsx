"use client";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, user, loading } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Calcular el total de la compra sumando precio * cantidad de cada artículo
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calcular la cantidad total de artículos en la canasta
  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <div className="text-center mt-20 text-steam-accent animate-pulse">Verificando sesión...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h2>
        <p className="text-steam-text mb-6">Debes estar registrado e iniciar sesión para gestionar un carrito de compras.</p>
        <Link href="/login" className="bg-steam-accent text-steam-bg px-6 py-3 rounded font-bold hover:bg-white transition">
          Ir al Inicio de Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-wider border-b border-steam-light pb-4">
        Tu Carrito de Compras
      </h1>

      {cart.length === 0 ? (
        <div className="bg-steam-panel p-10 rounded border border-steam-light text-center">
          <p className="text-steam-text text-lg mb-6">Tu carrito está vacío de momento.</p>
          <Link href="/store" className="bg-steam-light hover:bg-steam-accent hover:text-steam-bg text-white px-6 py-3 rounded transition font-semibold">
            Ir a la tienda a buscar juegos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de artículos */}
          <div className="lg:w-2/3 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="bg-steam-panel p-4 rounded border border-steam-light flex gap-4 items-center justify-between"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-20 h-20 object-cover rounded shadow" 
                />
                
                <div className="flex-grow min-w-0 px-2">
                  <h3 className="text-white font-bold text-md truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-steam-text mt-1">
                    {item.platform} • {item.type}
                  </p>
                  <p className="text-xs text-steam-accent mt-1">
                    Cantidad: <span className="font-bold text-white">{item.quantity}</span>
                  </p>
                </div>

                <div className="text-right flex flex-col items-end justify-between h-full min-w-[120px]">
                  <span className="text-white font-bold text-md">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-400 hover:text-red-500 hover:underline mt-4 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={clearCart}
              className="text-sm text-steam-text hover:text-white transition underline"
            >
              Vaciar por completo el carrito
            </button>
          </div>

          {/* Resumen del Pago (Caja Derecha) */}
          <div className="lg:w-1/3">
            <div className="bg-steam-panel p-6 rounded border border-steam-light shadow-xl sticky top-6">
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider text-sm border-b border-steam-light pb-2">
                Resumen de Compra
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-steam-text">
                  <span>Artículos totales:</span>
                  <span className="text-white font-semibold">{calculateTotalItems()}</span>
                </div>
                <div className="flex justify-between text-steam-text border-b border-steam-light pb-3">
                  <span>Envío digital / físico:</span>
                  <span className="text-green-400 font-semibold">Gratis</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-white font-bold">Total estimado:</span>
                  <span className="text-2xl font-bold text-steam-accent">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => alert("Simulación de pasarela de pago segura en COP.")}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 rounded hover:brightness-110 transition shadow-lg text-center"
              >
                Proceder al Pago Seguro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}