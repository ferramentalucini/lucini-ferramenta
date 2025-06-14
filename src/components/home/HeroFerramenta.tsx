
import { Hammer, Wrench } from "lucide-react";

export default function HeroFerramenta() {
  return (
    <section
      id="inizio"
      className="w-full py-16 md:py-24 bg-gradient-to-tr from-brown-100 via-biancoLegno to-cemento border-b border-cemento"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center px-5">
        <div className="flex gap-2 mb-5">
          <Hammer
            size={46}
            strokeWidth={1.9}
            className="text-grigioFerro drop-shadow-sm -rotate-12"
          />
          <Wrench
            size={46}
            strokeWidth={1.9}
            className="text-legno drop-shadow-sm rotate-6"
          />
        </div>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-grigioFerro mb-2 tracking-tight drop-shadow">
          Ferramenta Lucini
        </h1>
        <div className="w-16 mx-auto border-b-4 border-verdeFerramenta rounded-full mb-4" />
        <p className="text-base md:text-lg text-acciaio font-sans mb-3 max-w-2xl shadow-none">
          Da 60 anni il tuo punto di riferimento: utensili scelti, consigli veri e materiali di cui fidarsi — con lo spirito autentico dell’officina.
        </p>
        <a
          href="#prodotti"
          className="inline-block bg-verdeFerramenta text-white font-semibold py-2 px-7 rounded-[6px] shadow hover:bg-legno hover:text-grigioFerro transition-all text-lg mt-2"
        >
          Scopri i prodotti
        </a>
      </div>
    </section>
  );
}
