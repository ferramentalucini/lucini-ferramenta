
import { Hammer, Wrench } from "lucide-react";

export default function HeroFerramenta() {
  return (
    <section
      id="inizio"
      className="w-full py-16 md:py-24 bg-cemento-texture bg-cover bg-center border-b border-cemento flex items-center justify-center"
      style={{
        minHeight: 430,
        backgroundBlendMode: "darken",
        backgroundColor: "#A9A9A910"
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center px-5">
        <div className="flex gap-2 mb-5">
          <Hammer
            size={46}
            strokeWidth={1.9}
            className="text-verdesalvia drop-shadow-sm -rotate-12"
          />
          <Wrench
            size={46}
            strokeWidth={1.9}
            className="text-ruggine drop-shadow-sm rotate-6"
          />
        </div>
        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-sabbia mb-2 tracking-tight drop-shadow font-header">
          Ferramenta Lucini
        </h1>
        <div className="w-16 mx-auto border-b-4 border-senape rounded-full mb-4" />
        <p className="text-base md:text-lg text-cemento font-lato mb-3 max-w-2xl bg-antracite/50 text-sabbia py-3 px-4 rounded-lg shadow-none">
          Da 60 anni il tuo punto di riferimento: utensili scelti, consigli veri e materiali di cui fidarsi — con lo spirito autentico dell’officina.
        </p>
        <a
          href="#prodotti"
          className="btn-azione mt-2"
        >
          Scopri i prodotti
        </a>
      </div>
    </section>
  );
}
