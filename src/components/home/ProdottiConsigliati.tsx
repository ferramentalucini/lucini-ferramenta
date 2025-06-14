
import { ShoppingCart, Hammer, Wrench } from "lucide-react";

const prodotti = [
  {
    nome: "Trapano Bosch Professional",
    descr: "Potente, affidabile — per fori netti su ferro e muratura.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    icona: <Wrench className="text-verdesalvia" size={22} />,
    colore: "border-verdesalvia",
  },
  {
    nome: "Martello Stanley Fatmax",
    descr: "Testa in acciaio e manico antiscivolo, per durare e colpire.",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
    icona: <Hammer className="text-ruggine" size={22} />,
    colore: "border-ruggine",
  },
  {
    nome: "Set Cacciaviti Wera",
    descr: "Punta magnetica, presa robusta — precisi su ogni vite.",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    icona: <Wrench className="text-cemento" size={22} />,
    colore: "border-cemento",
  },
  {
    nome: "Chiave Inglese Beta",
    descr: "Acciaio temprato made in Italy, presa sicura ovunque.",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80",
    icona: <Wrench className="text-antracite" size={22} />,
    colore: "border-antracite",
  },
  {
    nome: "Metro Stanley Classic",
    descr: "Nastro antiruggine, precisione millimetrica garantita.",
    img: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
    icona: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-senape">
        <rect x="4" y="10" width="16" height="7" rx="2" fill="currentColor" />
        <rect x="6" y="5" width="12" height="5" rx="2" fill="#F4F1EA" />
      </svg>
    ),
    colore: "border-senape",
  },
];

export default function ProdottiConsigliati() {
  return (
    <section id="prodotti" className="section-transparent w-full py-14 px-5 border-b border-cemento/20">
      <div className="max-w-6xl mx-auto flex flex-col items-start">
        <h2 className="font-oswald text-2xl md:text-3xl font-bold text-bianco mb-3 pl-1 font-header drop-shadow-lg">
          I nostri prodotti best-seller
        </h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full">
          {prodotti.map((p) => (
            <div
              key={p.nome}
              className={`relative rounded-lg bg-bianco/95 backdrop-blur-sm border ${p.colore} card-blocco group transition flex flex-col overflow-hidden hover:shadow-lg`}
            >
              <img
                src={p.img}
                alt={p.nome}
                className="w-full h-32 object-cover rounded-t-lg border-b border-cemento"
                loading="lazy"
              />
              <div className="px-4 py-3 flex flex-col flex-1 h-full">
                <div className="flex items-center gap-2 font-bold text-lg mb-1 font-oswald text-verdesalvia drop-shadow">
                  {p.icona}
                  {p.nome}
                </div>
                <div className="text-cemento text-sm font-lato font-light flex-1 mb-3">{p.descr}</div>
                <button className="btn-azione flex items-center justify-center gap-1 mt-auto">
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
            className="inline-flex items-center gap-2 bg-bianco/90 backdrop-blur-sm border-2 border-senape text-verdesalvia text-base font-oswald px-7 py-2 rounded-md shadow hover:bg-senape hover:text-sabbia transition hover-scale"
            style={{ letterSpacing: "0.5px" }}
          >
            <ShoppingCart size={19} className="stroke-verdesalvia group-hover:stroke-sabbia" />
            Vedi tutti i prodotti
          </a>
        </div>
      </div>
    </section>
  );
}
