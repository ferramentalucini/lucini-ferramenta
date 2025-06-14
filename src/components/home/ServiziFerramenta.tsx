
import { Truck, ShieldCheck, Percent, Handshake } from "lucide-react";

const servizi = [
  {
    icon: Truck,
    title: "Spedizioni rapide",
    desc: "Consegna in 24/48h su tutti gli ordini nazionali.",
  },
  {
    icon: ShieldCheck,
    title: "Qualità garantita",
    desc: "Solo marchi affidabili, prodotti verificati da esperti.",
  },
  {
    icon: Percent,
    title: "Promozioni trasparenti",
    desc: "Offerte chiare e prezzi senza sorprese.",
  },
  {
    icon: Handshake,
    title: "Consulenza diretta",
    desc: "Assistenza personalizzata con passione artigiana.",
  },
];

export default function ServiziFerramenta() {
  return (
    <section
      className="bg-[#f6f3ed] w-full py-10 md:py-18 border-b border-[#c1ad7a]"
    >
      <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-4 grid-cols-1 gap-8">
        {servizi.map((s) => (
          <div
            key={s.title}
            className="flex flex-col items-center text-center py-6 px-3 bg-[#faf7ef] border border-[#e4dbc1] rounded-md shadow hover:shadow-lg transition"
          >
            <s.icon size={36} className="mb-3 text-[#b08d37]" />
            <div className="font-semibold text-[#7f6b30] mb-1 text-lg">
              {s.title}
            </div>
            <div className="text-[#786d53] text-sm font-light">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
