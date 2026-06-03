import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-steam-panel px-8 py-4 flex justify-between items-center border-b border-steam-light">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold uppercase tracking-wider text-white">
          <span className="text-steam-accent">Poli Games</span>
        </Link>
        <Link href="/" className="text-steam-text hover:text-white transition">TIENDA</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/login" className="text-steam-text hover:text-white transition">Iniciar Sesión</Link>
        <Link href="/register" className="bg-steam-light hover:bg-steam-accent hover:text-steam-bg text-white px-4 py-2 rounded transition">
          Registrarse
        </Link>
      </div>
    </nav>
)
}