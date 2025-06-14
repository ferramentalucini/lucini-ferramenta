
import { Wrench } from "lucide-react";

export default function HeroFerramenta() {
  return (
    <section
      id="inizio"
      className="w-full py-16 md:py-24 bg-gradient-to-br from-[#fff9ef] via-[#ece4d6] to-[#f1e6c9] border-b border-[#c1ad7a]"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center px-5">
        <Wrench
          size={55}
          strokeWidth={1.4}
          className="mb-3 text-[#b08d37] drop-shadow-sm"
        />
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#b08d37] mb-3 tracking-tight">
          Ferramenta Lucini
        </h1>
        <p className="text-base md:text-lg text-[#716045] font-sans font-light mb-4 max-w-2xl">
          Da oltre 60 anni il punto di riferimento per artigiani, imprese e appassionati del fai-da-te.<br />
          Trovi utensili selezionati, materiali robusti e un servizio a misura d’uomo.
        </p>
        <a
          href="#prodotti"
          className="inline-block bg-[#b08d37] text-white font-semibold py-2 px-7 rounded-[6px] shadow hover:bg-[#7f6b30] transition-all text-lg mt-2"
        >
          Scopri i nostri prodotti
        </a>
      </div>
    </section>
  );
}
