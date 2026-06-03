import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "GameStore",
  description: "Catálogo de juegos físicos y digitales",
};


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
