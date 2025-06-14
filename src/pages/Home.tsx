
import { useRef } from "react";
import { ShoppingCart } from "lucide-react";

const products = [
  {
    title: "Trapano DeWalt",
    desc: "Potenza e precisione artigianale, ideale per ogni laboratorio.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Martello Estwing",
    desc: "Il re degli attrezzi manuali per lavori impeccabili e duraturi.",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Set Cacciaviti PB Swiss",
    desc: "Affidabilità e design svizzero per risultati perfetti ogni volta.",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Chiavi combinate Beta",
    desc: "L’eccellenza del made in Italy racchiusa in ogni dettaglio.",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Metro Stanley Classic",
    desc: "Misurazioni accurate per chi non accetta compromessi.",
    img: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Home() {
  // Scroll references
  const inizioRef = useRef<HTMLDivElement>(null);
  const prodottiRef = useRef<HTMLDivElement>(null);
  const contattiRef = useRef<HTMLDivElement>(null);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen flex flex-col w-full">
      {/* HEADER */}
      <header
        className="sticky top-0 left-0 z-50 bg-gradient-to-r from-gray-50 via-[#fef8f2] to-gray-200/90 border-b-2 border-[#c9b037] shadow-xl"
        style={{
          backgroundImage:
            "linear-gradient(105deg, #f8fafc 70%, #e0c279 100%)",
          boxShadow:
            "0 3px 14px rgba(150,130,70,0.06), 0 1.5px 0px #e5e7eb inset",
        }}
      >
        <div className="flex justify-between items-center px-4 md:px-16 py-3">
          <div>
            <span className="text-3xl md:text-4xl font-playfair font-bold text-[#c9b037] drop-shadow tracking-tight select-none">
              Ferramenta Lucini
            </span>
            <div className="text-sm font-sans text-[#7f7460] mt-1 ml-1 tracking-wide select-none">
              Dal 1964, per professionisti e appassionati.
            </div>
          </div>
          <nav className="flex gap-4 md:gap-8 font-medium text-base">
            <button
              onClick={() => handleScroll(inizioRef)}
              className="px-2 py-1 text-gray-700 rounded hover:bg-[#c9b037]/10 hover:text-[#a0892c] transition"
            >
              Inizio
            </button>
            <button
              onClick={() => handleScroll(prodottiRef)}
              className="px-2 py-1 text-gray-700 rounded hover:bg-[#c9b037]/10 hover:text-[#a0892c] transition"
            >
              Prodotti
            </button>
            <button
              onClick={() => handleScroll(contattiRef)}
              className="px-2 py-1 text-gray-700 rounded hover:bg-[#c9b037]/10 hover:text-[#a0892c] transition"
            >
              Contatti
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full">
        {/* HERO */}
        <section
          ref={inizioRef}
          className="w-full max-w-[1300px] mx-auto pt-14 md:pt-28 pb-12 px-5 flex flex-col items-start md:items-center text-left md:text-center"
        >
          <h1 className="font-playfair text-[2.35rem] sm:text-5xl md:text-6xl font-extrabold text-[#c9b037] mb-4 drop-shadow-lg">
            Ferramenta Lucini
          </h1>
          <p className="text-lg md:text-2xl font-sans text-gray-700 max-w-2xl font-light mb-4">
            Dove l’esperienza artigiana incontra la qualità e l’innovazione.
            Dal 1964 la tua ferramenta di fiducia, per professionisti e fai-da-te.
          </p>
          <div className="flex mt-3 gap-2 md:gap-5">
            <button
              onClick={() => handleScroll(prodottiRef)}
              className="bg-[#c9b037] text-white font-semibold px-6 py-2 rounded-md shadow-lg hover:bg-[#a0892c] hover:scale-105 transition duration-150 tracking-wide"
            >
              Scopri i nostri prodotti
            </button>
            <button
              onClick={() => handleScroll(contattiRef)}
              className="bg-white text-[#c9b037] border border-[#d5a621] font-semibold px-6 py-2 rounded-md shadow hover:bg-[#faf7ee] hover:border-[#a0892c] transition duration-150"
            >
              Contattaci
            </button>
          </div>
        </section>

        {/* PRODOTTI */}
        <section
          ref={prodottiRef}
          className="w-full max-w-[1400px] mx-auto py-14 px-5"
        >
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-800 mb-8 text-left md:text-center relative">
            I nostri prodotti selezionati
            <span className="block mt-1 w-16 h-1 bg-gradient-to-r from-[#c9b037] via-[#e0c279] to-transparent rounded md:mx-auto" />
          </h2>
          <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-8">
            {products.map((p) => (
              <div
                key={p.title}
                className="relative rounded-xl bg-gradient-to-br from-gray-50 via-[#faf7ee] to-gray-200 border border-[#ede6d3] shadow-lg flex flex-col overflow-hidden group hover:shadow-xl transition"
                style={{ minHeight: 355 }}
              >
                <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-[#c9b037] via-[#e0c279cc] to-transparent z-10"></div>
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-t-xl transition duration-200 group-hover:scale-105"
                  loading="lazy"
                  style={{ borderBottom: "2px solid #c9b037" }}
                />
                <div className="p-5 pt-4 flex flex-col flex-1">
                  <div className="font-playfair font-bold text-[#c9b037] text-lg mb-1">
                    {p.title}
                  </div>
                  <div className="text-gray-700 text-base font-light flex-1">
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-12 pr-1">
            <a
              href="/prodotti"
              className="inline-flex items-center gap-2 bg-white border-2 border-[#c9b037] text-[#a0892c] text-lg font-semibold px-8 py-2.5 rounded-xl shadow-lg hover:bg-[#c9b037] hover:text-white hover:shadow-xl transition-all duration-150 group"
              style={{ letterSpacing: "0.5px" }}
            >
              <ShoppingCart className="stroke-[#c9b037] group-hover:stroke-white" size={22} />
              Tutti i prodotti
            </a>
          </div>
        </section>

        {/* CONTATTI */}
        <section
          ref={contattiRef}
          className="w-full max-w-[780px] mx-auto py-16 px-5 flex flex-col items-stretch"
        >
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-800 mb-4 text-left md:text-center">
            Contattaci
          </h2>
          <div className="bg-gradient-to-br from-[#f6f1e2] via-white to-gray-100 rounded-xl border border-[#ded6be] shadow-lg p-10 md:p-12 w-full flex flex-col items-start md:items-center relative">
            <div className="text-xl font-semibold mb-1 font-playfair text-[#c9b037]">
              Ferramenta Lucini Srl
            </div>
            <div className="text-gray-800 font-mono text-base mb-2">
              Via degli Artigiani 14, Como (CO)
            </div>
            <div className="text-gray-700 text-base mb-1">
              Email:{" "}
              <a
                href="mailto:info@ferramentalucini.it"
                className="underline text-[#c9b037] hover:text-[#a0892c]"
              >
                info@ferramentalucini.it
              </a>
            </div>
            <div className="text-gray-700 text-base mb-2">
              Tel: <span className="tracking-wider">031 1234567</span>
            </div>
            <div className="mt-5 text-xs text-[#a18c51] font-light tracking-wide">
              © 2024 Ferramenta Lucini — Tradizione & Innovazione
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
