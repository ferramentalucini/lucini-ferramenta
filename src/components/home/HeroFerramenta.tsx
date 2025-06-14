
import { Hammer, Wrench } from "lucide-react";

export default function HeroFerramenta() {
  return (
    <section
      id="inizio"
      className="section-transparent w-full py-16 md:py-24 border-b border-cemento/20 flex items-center justify-center texture-overlay"
      style={{ minHeight: 430 }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center px-5 animate-fade-in">
        <div className="flex gap-4 mb-6 animate-float">
          <Hammer
            size={52}
            strokeWidth={1.8}
            className="text-verdesalvia drop-shadow-2xl -rotate-12 icon-glow animate-breathing"
            style={{ animationDelay: '0s' }}
          />
          <Wrench
            size={52}
            strokeWidth={1.8}
            className="text-senape drop-shadow-2xl rotate-6 icon-glow animate-breathing"
            style={{ animationDelay: '1s' }}
          />
        </div>
        <h1 className="font-oswald text-5xl md:text-6xl font-bold text-bianco mb-3 tracking-tight font-header animate-pulse-glow">
          <span className="bg-gradient-to-r from-bianco via-sabbia to-bianco bg-clip-text text-transparent drop-shadow-2xl">
            Ferramenta Lucini
          </span>
        </h1>
        <div className="w-20 mx-auto border-b-4 border-senape rounded-full mb-5 shadow-lg animate-pulse-glow" />
        <p className="text-lg md:text-xl text-bianco font-lato mb-4 max-w-2xl bg-gradient-to-r from-antracite/70 via-antracite/80 to-antracite/70 py-4 px-6 rounded-2xl shadow-2xl backdrop-blur-md border border-bianco/20">
          Da 60 anni il tuo punto di riferimento: utensili scelti, consigli veri e materiali di cui fidarsi — con lo spirito autentico dell'officina.
        </p>
        <a
          href="#prodotti"
          className="btn-azione mt-3 animate-float"
          style={{ animationDelay: '2s' }}
        >
          Scopri i prodotti
        </a>
      </div>
    </section>
  );
}
