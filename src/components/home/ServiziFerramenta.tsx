
import { Truck, ShieldCheck, Percent, Handshake } from "lucide-react";

const servizi = [
  {
    icon: Truck,
    title: "Consegne rapide",
    desc: "Direttamente sul cantiere o in officina, in 24/48h.",
    tone: "verdeFerramenta",
  },
  {
    icon: ShieldCheck,
    title: "Prodotti robusti",
    desc: "Solo marchi affidabili, scelti per resistere a lungo.",
    tone: "oro",
  },
  {
    icon: Percent,
    title: "Promozioni chiare",
    desc: "Sconti veri, nessuna sorpresa.",
    tone: "rame",
  },
  {
    icon: Handshake,
    title: "Consulenza sincera",
    desc: "Ti aiutiamo a scegliere davvero quello che serve.",
    tone: "noce",
  },
];

export default function ServiziFerramenta() {
  return (
    <section className="bg-cemento w-full py-10 border-b border-cemento">
      <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-4 grid-cols-1 gap-6">
        {servizi.map((s) => (
          <div
            key={s.title}
            className="flex flex-col items-center text-center py-7 px-3 bg-white border-2 border-cemento rounded-md shadow-rustic-card hover:shadow-xl transition"
          >
            <s.icon size={34} className={`mb-2 text-${s.tone}`} />
            <div className={`font-semibold text-${s.tone} mb-1 text-lg font-playfair`}>
              {s.title}
            </div>
            <div className="text-scuroMetallo text-sm font-light">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
