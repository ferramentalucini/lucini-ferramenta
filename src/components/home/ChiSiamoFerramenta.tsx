
import { Hammer } from "lucide-react";

export default function ChiSiamoFerramenta() {
  return (
    <section
      className="w-full py-12 px-5 bg-mattone-texture bg-cover bg-center border-b border-cemento"
      id="chi-siamo"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 ">
        <div className="flex-1">
          <h2 className="font-oswald text-2xl md:text-3xl font-bold text-antracite mb-2 flex gap-2 items-center font-header">
            <Hammer size={28} className="text-verdesalvia" />
            Chi siamo
          </h2>
          <p className="text-cemento text-base md:text-lg font-lato mb-1">
            Dal 1964, Ferramenta Lucini è il negozio che parla la lingua dei professionisti e degli appassionati: qui trovi chi conosce il mestiere, i materiali e la vita di cantiere.
          </p>
          <p className="text-verdesalvia text-base md:text-lg font-lato">
            Siamo una famiglia di artigiani: da tre generazioni tramandiamo non solo attrezzi solidi, ma anche consigli sinceri e un servizio che resta umano.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"
          alt="Laboratorio ferramenta"
          className="rounded-lg shadow-lg border-2 border-senape bg-sabbia hidden md:block max-w-xs bordo-lamiera"
        />
      </div>
    </section>
  );
}

