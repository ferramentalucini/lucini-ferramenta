
import { Truck, Hammer, Wrench, ShieldCheck } from "lucide-react";

const servizi = [
  {
    icon: Truck,
    title: "Consegne rapide",
    desc: "Direttamente sul cantiere o in officina, in 24/48h.",
    tone: "verdesalvia",
  },
  {
    icon: ShieldCheck,
    title: "Prodotti robusti",
    desc: "Solo marchi affidabili, scelti per resistere a lungo.",
    tone: "cemento",
  },
  {
    icon: Hammer,
    title: "Supporto tecnico",
    desc: "Hai bisogno di consigli pratici? Siamo qui.",
    tone: "ruggine",
  },
  {
    icon: Wrench,
    title: "Consulenza sincera",
    desc: "Ti aiutiamo a scegliere davvero quello che serve.",
    tone: "senape",
  },
];

export default function ServiziFerramenta() {
  return (
    <section className="bg-sabbia bg-mattone-texture bg-blend-multiply w-full py-10 border-b border-cemento animate-fade-in">
      <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-4 grid-cols-1 gap-7">
        {servizi.map((s) => (
          <div
            key={s.title}
            className="flex flex-col items-center text-center py-7 px-3 bg-bianco rounded-lg shadow-rustic-card border border-cemento hover:shadow-lg hover-scale transition"
          >
            <s.icon size={34} className={`mb-2 text-${s.tone}`} />
            <div className={`font-oswald font-semibold mb-1 text-lg text-${s.tone} font-header`}>
              {s.title}
            </div>
            <div className="text-cemento text-sm font-lato font-light">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
