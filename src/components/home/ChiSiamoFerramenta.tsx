
import { Users } from "lucide-react";

export default function ChiSiamoFerramenta() {
  return (
    <section
      className="w-full py-12 px-5 bg-gradient-to-tr from-cemento via-biancoFerramenta to-white border-b border-cemento"
      id="chi-siamo"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-7">
        <div className="flex-1">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-noce mb-2 flex gap-2 items-center">
            <Users size={28} className="text-scuroMetallo" />
            Chi siamo
          </h2>
          <p className="text-[#726541] text-base md:text-lg font-light mb-1">
            Dal 1964, Ferramenta Lucini è il negozio che parla la lingua dei professionisti e degli appassionati: qui trovi chi conosce il mestiere, i materiali e la vita di cantiere.
          </p>
          <p className="text-scuroMetallo text-base md:text-lg font-light">
            Siamo una famiglia di artigiani: da tre generazioni tramandiamo non solo attrezzi solidi, ma anche consigli sinceri e un servizio che resta umano.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"
          alt="Laboratorio ferramenta"
          className="rounded-lg shadow-lg border-2 border-noce bg-cemento hidden md:block max-w-xs"
        />
      </div>
    </section>
  );
}
