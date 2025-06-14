
import { ShoppingCart } from "lucide-react";

const prodotti = [
  {
    nome: "Trapano Bosch Professional",
    descr: "Potente, affidabile: per lavori di precisione anche intensi.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    nome: "Martello Stanley Fatmax",
    descr: "Resistente: colpi potenti e lunga durata.",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  },
  {
    nome: "Set Cacciaviti Wera",
    descr: "Ergonomia svizzera, presa sicura per ogni vite.",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    nome: "Chiave Inglese Beta",
    descr: "Leggendaria robustezza italiana per ogni bullone.",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80",
  },
  {
    nome: "Metro Stanley Classic",
    descr: "Misurazioni sempre precise per veri professionisti.",
    img: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
  },
];

export default function ProdottiConsigliati() {
  return (
    <section
      id="prodotti"
      className="bg-[#f8f5ee] w-full py-14 px-5 border-b border-[#d4c38e]"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-start">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#a0892c] mb-3 pl-1">
          I nostri prodotti più richiesti
        </h2>
        <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
          {prodotti.map((p) => (
            <div
              key={p.nome}
              className="relative rounded-lg bg-gradient-to-br from-[#f9f7f2] via-[#efe4cc] to-[#e3d0a6] border border-[#e8dbc1] shadow hover:shadow-xl group transition flex flex-col overflow-hidden"
            >
              <img
                src={p.img}
                alt={p.nome}
                className="w-full h-36 object-cover rounded-t-lg border-b-2 border-[#b08d37]"
                loading="lazy"
              />
              <div className="px-4 py-4 flex flex-col flex-1 h-full">
                <div className="font-bold text-[#b08d37] text-base mb-0.5">
                  {p.nome}
                </div>
                <div className="text-[#716045] text-sm font-light flex-1 mb-2">
                  {p.descr}
                </div>
                <button className="flex items-center justify-center bg-[#a0892c] text-white font-semibold px-2 py-1 rounded transition hover:bg-[#7f6b30] mt-auto gap-1 shadow">
                  <ShoppingCart size={17} />
                  Aggiungi
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end w-full mt-10">
          <a
            href="/prodotti"
            className="inline-flex items-center gap-2 bg-white border-2 border-[#b08d37] text-[#7f6b30] text-base font-semibold px-7 py-2 rounded-md shadow hover:bg-[#b08d37] hover:text-white transition"
            style={{ letterSpacing: "0.5px" }}
          >
            <ShoppingCart size={19} className="stroke-[#b08d37] group-hover:stroke-white" />
            Tutti i prodotti
          </a>
        </div>
      </div>
    </section>
  );
}
