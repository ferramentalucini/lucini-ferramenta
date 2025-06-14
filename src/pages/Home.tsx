import HeroFerramenta from "../components/home/HeroFerramenta";
import ServiziFerramenta from "../components/home/ServiziFerramenta";
import ProdottiConsigliati from "../components/home/ProdottiConsigliati";
import ChiSiamoFerramenta from "../components/home/ChiSiamoFerramenta";
import ContattiFerramenta from "../components/home/ContattiFerramenta";
import { useRef } from "react";

export default function Home() {
  // Scroll references
  const inizioRef = useRef<HTMLDivElement>(null);
  const prodottiRef = useRef<HTMLDivElement>(null);
  const chiSiamoRef = useRef<HTMLDivElement>(null);
  const contattiRef = useRef<HTMLDivElement>(null);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full font-lato">
      {/* HEADER */}
      <header className="sticky top-0 left-0 z-40 bg-antracite/95 backdrop-blur-sm border-b-2 border-cemento shadow-lg">
        <div className="flex justify-between items-center px-4 md:px-16 py-3">
          <span className="text-3xl md:text-4xl font-oswald font-bold text-senape tracking-tight select-none drop-shadow font-header">
            Ferramenta Lucini
          </span>
          <nav className="flex gap-4 md:gap-7 font-medium text-base">
            <button
              onClick={() => handleScroll(inizioRef)}
              className="px-2 py-1 text-sabbia rounded hover:bg-senape/30 hover:text-senape transition font-oswald"
            >
              Inizio
            </button>
            <button
              onClick={() => handleScroll(prodottiRef)}
              className="px-2 py-1 text-sabbia rounded hover:bg-senape/30 hover:text-senape transition font-oswald"
            >
              Prodotti
            </button>
            <button
              onClick={() => handleScroll(chiSiamoRef)}
              className="px-2 py-1 text-sabbia rounded hover:bg-senape/30 hover:text-senape transition font-oswald"
            >
              Chi siamo
            </button>
            <button
              onClick={() => handleScroll(contattiRef)}
              className="px-2 py-1 text-sabbia rounded hover:bg-senape/30 hover:text-senape transition font-oswald"
            >
              Contatti
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENUTO */}
      <main className="flex-1 w-full">
        <div ref={inizioRef}><HeroFerramenta /></div>
        <ServiziFerramenta />
        <div ref={prodottiRef}><ProdottiConsigliati /></div>
        <div ref={chiSiamoRef}><ChiSiamoFerramenta /></div>
        <div ref={contattiRef}><ContattiFerramenta /></div>
      </main>
      <footer className="bg-antracite/95 backdrop-blur-sm text-sabbia py-4 text-center font-oswald text-sm tracking-wide">
        &copy; {new Date().getFullYear()} Ferramenta Lucini &mdash; Designed with cura
      </footer>
    </div>
  );
}
