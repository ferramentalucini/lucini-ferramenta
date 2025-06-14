
import { ShoppingCart, Hammer, Wrench, Drill } from "lucide-react";

const prodotti = [
  {
    nome: "Trapano Bosch Professional",
    descr: "Potente, affidabile — per fori netti su ferro e muratura.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    icona: <Drill className="text-verdeFerramenta" size={22} />,
    colore: "border-verdeFerramenta",
  },
  {
    nome: "Martello Stanley Fatmax",
    descr: "Testa in acciaio e manico antiscivolo, per durare e colpire.",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
    icona: <Hammer className="text-legno" size={22} />,
    colore: "border-legno",
  },
  {
    nome: "Set Cacciaviti Wera",
    descr: "Punta magnetica, presa robusta — precisi su ogni vite.",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    icona: <Wrench className="text-acciaio" size={22} />,
    colore: "border-acciaio",
  },
  {
    nome: "Chiave Inglese Beta",
    descr: "Acciaio temprato made in Italy, presa sicura ovunque.",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80",
    icona: <Wrench className="text-grigioFerro" size={22} />,
    colore: "border-grigioFerro",
  },
  {
    nome: "Metro Stanley Classic",
    descr: "Nastro antiruggine, precisione millimetrica garantita.",
    img: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
    icona: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-bluPetrolio">
        <rect x="4" y="10" width="16" height="7" rx="2" fill="currentColor" />
        <rect x="6" y="5" width="12" height="5" rx="2" fill="#ded9d3" />
      </svg>
    ),
    colore: "border-bluPetrolio",
  },
];

export default function ProdottiConsigliati() {
  return (
    <section id="prodotti" className="bg-gradient-to-br from-cemento via-white to-biancoLegno w-full py-14 px-5 border-b border-cemento">
      <div className="max-w-6xl mx-auto flex flex-col items-start">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-grigioFerro mb-3 pl-1">
          I nostri prodotti best-seller
        </h2>
        <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
          {prodotti.map((p) => (
            <div
              key={p.nome}
              className={`relative rounded-xl bg-gradient-to-br from-biancoLegno via-cemento to-white border-2 ${p.colore} shadow-rustic-card group transition flex flex-col overflow-hidden`}
            >
              <img
                src={p.img}
                alt={p.nome}
                className="w-full h-32 object-cover rounded-t-xl border-b-2 border-cemento"
                loading="lazy"
              />
              <div className="px-4 py-3 flex flex-col flex-1 h-full">
                <div className="flex items-center gap-2 font-bold text-lg mb-1 font-sans text-grigioFerro drop-shadow">
                  {p.icona}
                  {p.nome}
                </div>
                <div className="text-acciaio text-sm font-light flex-1 mb-3">{p.descr}</div>
                <button className="flex items-center justify-center bg-verdeFerramenta text-white font-semibold px-2 py-1 rounded transition hover:bg-bluPetrolio gap-1 shadow mt-auto text-sm">
                  <ShoppingCart size={17} />
                  Aggiungi
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end w-full mt-9">
          <a
            href="/prodotti"
            className="inline-flex items-center gap-2 bg-white border-2 border-bluPetrolio text-verdeFerramenta text-base font-semibold px-7 py-2 rounded-md shadow hover:bg-verdeMuschio hover:text-white transition"
            style={{ letterSpacing: "0.5px" }}
          >
            <ShoppingCart size={19} className="stroke-verdeFerramenta group-hover:stroke-white" />
            Vedi tutti i prodotti
          </a>
        </div>
      </div>
    </section>
  );
}
