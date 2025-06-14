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
    <div className="bg-gradient-to-br from-cemento via-biancoLegno to-legno min-h-screen flex flex-col w-full pattern-bg">
      {/* HEADER */}
      <header
        className="sticky top-0 left-0 z-40 bg-gradient-to-b from-[#e4e0d7] via-[#d4c8a7] to-[#f6f3ed]/80 border-b-2 border-cemento shadow-lg"
      >
        <div className="flex justify-between items-center px-4 md:px-16 py-3">
          <span className="text-3xl md:text-4xl font-playfair font-bold text-[#b08d37] drop-shadow tracking-tight select-none">
            Ferramenta Lucini
          </span>
          <nav className="flex gap-4 md:gap-7 font-medium text-base">
            <button
              onClick={() => handleScroll(inizioRef)}
              className="px-2 py-1 text-[#877848] rounded hover:bg-[#c9b037]/10 hover:text-[#7f6b30] transition"
            >
              Inizio
            </button>
            <button
              onClick={() => handleScroll(prodottiRef)}
              className="px-2 py-1 text-[#877848] rounded hover:bg-[#c9b037]/10 hover:text-[#7f6b30] transition"
            >
              Prodotti
            </button>
            <button
              onClick={() => handleScroll(chiSiamoRef)}
              className="px-2 py-1 text-[#877848] rounded hover:bg-[#c9b037]/10 hover:text-[#7f6b30] transition"
            >
              Chi siamo
            </button>
            <button
              onClick={() => handleScroll(contattiRef)}
              className="px-2 py-1 text-[#877848] rounded hover:bg-[#c9b037]/10 hover:text-[#7f6b30] transition"
            >
              Contatti
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENUTO */}
      {/* wrapper per scroll */}
      <main className="flex-1 w-full">
        <div ref={inizioRef}><HeroFerramenta /></div>
        <ServiziFerramenta />
        <div ref={prodottiRef}><ProdottiConsigliati /></div>
        <div ref={chiSiamoRef}><ChiSiamoFerramenta /></div>
        <div ref={contattiRef}><ContattiFerramenta /></div>
      </main>
    </div>
  );
}
