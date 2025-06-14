
import { Users } from "lucide-react";

export default function ChiSiamoFerramenta() {
  return (
    <section
      className="w-full py-14 px-5 bg-gradient-to-tl from-[#f3ede2] via-[#fdf7ec] to-white border-b border-[#c1ad7a]"
      id="chi-siamo"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#a0892c] mb-2 flex gap-2 items-center">
            <Users size={30} className="text-[#b08d37]" /> Chi siamo
          </h2>
          <p className="text-[#726541] text-base md:text-lg font-light mb-1">
            Ferramenta Lucini nasce a Como nel 1964 come negozio di quartiere dedicato a offrire subito soluzioni pratiche a chi lavora con passione.
          </p>
          <p className="text-[#827861] text-base md:text-lg font-light">
            Oggi siamo un punto di riferimento per chi cerca prodotti selezionati, professionalità e il calore umano di chi ci mette sempre la faccia. Da tre generazioni, ascoltiamo i nostri clienti. 
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"
          alt="Laboratorio ferramenta"
          className="rounded-lg shadow hidden md:block max-w-xs"
        />
      </div>
    </section>
  );
}
