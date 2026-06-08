const mockProducts = [
  { id: 2, title: 'Cyberpunk 2077', price: 29.99, img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400', type: 'Físico' },
  { id: 3, title: 'Hollow Knight', price: 14.99, img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400', type: 'Digital' },
  { id: 4, title: 'Zelda: Tears of the Kingdom', price: 69.99, img: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=400', type: 'Físico' },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-steam-panel to-steam-light p-8 rounded-lg mb-10 shadow-lg">
        <p className="text-steam-text">Encuentra los mejores juegos físicos y digitales</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-white">Destacados y recomendados</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <div key={product.id} className="bg-steam-panel rounded shadow-md overflow-hidden hover:scale-105 transition duration-300 flex flex-col">
            <img src={product.img} alt={product.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.title}</h3>
              <span className="text-xs text-steam-text mb-3 bg-steam-bg w-max px-2 py-1 rounded">
                {product.type}
              </span>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-steam-accent font-bold">${product.price}</span>
                <button className="bg-steam-light hover:bg-steam-accent hover:text-steam-bg px-3 py-1 text-sm rounded transition">
                  Ver más
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}