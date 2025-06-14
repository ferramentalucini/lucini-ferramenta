
import { useRef } from "react";

const products = [
  {
    title: "Trapano DeWalt",
    desc: "Potenza e precisione artigianale.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Martello Estwing",
    desc: "Il re degli attrezzi manuali, per lavori impeccabili.",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Set Cacciaviti PB Swiss",
    desc: "Affidabilità e design svizzero.",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Chiavi combinate Beta",
    desc: "L’eccellenza del made in Italy.",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Metro Stanley Classic",
    desc: "Misurazioni perfette ogni volta.",
    img: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Home() {
  // Riferimenti per scroll
  const inizioRef = useRef<HTMLDivElement>(null);
  const prodottiRef = useRef<HTMLDivElement>(null);
  const contattiRef = useRef<HTMLDivElement>(null);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 left-0 z-50 bg-white/80 backdrop-blur-[4px] border-b border-gray-200 w-full flex items-center justify-between px-6 md:px-14 py-4 shadow-sm">
        <span className="text-2xl md:text-4xl font-playfair font-bold text-[#c9b037] tracking-tight select-none drop-shadow-sm">
          Ferramenta Lucini
        </span>
        <nav className="flex gap-6 md:gap-10">
          <button
            onClick={() => handleScroll(inizioRef)}
            className="text-base font-medium text-gray-700 hover:text-[#c9b037] transition duration-200"
          >
            Inizio
          </button>
          <button
            onClick={() => handleScroll(prodottiRef)}
            className="text-base font-medium text-gray-700 hover:text-[#c9b037] transition duration-200"
          >
            Prodotti
          </button>
          <button
            onClick={() => handleScroll(contattiRef)}
            className="text-base font-medium text-gray-700 hover:text-[#c9b037] transition duration-200"
          >
            Contatti
          </button>
        </nav>
      </header>

      {/* Contenuto principale */}
      <main className="flex-1 w-full">
        {/* Hero */}
        <section
          ref={inizioRef}
          className="w-full max-w-[1440px] mx-auto pt-20 md:pt-36 pb-12 px-4 flex flex-col items-center text-center"
        >
          <h1 className="text-5xl md:text-7xl font-playfair font-extrabold text-[#c9b037] mb-6 drop-shadow-lg">
            Ferramenta Lucini
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 max-w-xl font-light mb-4">
            Strumenti d’eccellenza per professionisti e appassionati. <br />
            Dal 1964, la tradizione si fonde con l’innovazione in un ambiente elegante e moderno.
          </p>
        </section>

        {/* Prodotti */}
        <section
          ref={prodottiRef}
          className="w-full max-w-[1300px] mx-auto py-14 px-4"
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-gray-900 mb-9 text-center">
            I nostri prodotti selezionati
          </h2>
          <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-8">
            {products.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl shadow-lg border border-gray-200 bg-white flex flex-col hover:shadow-xl transition animate-fade-in"
                style={{ minHeight: 340 }}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-t-2xl"
                  loading="lazy"
                />
                <div className="p-5 flex flex-col flex-1">
                  <div className="font-playfair font-bold text-[#c9b037] text-[20px] mb-2">
                    {p.title}
                  </div>
                  <div className="text-gray-600 text-base font-light flex-1">
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <a
              href="/prodotti"
              className="bg-[#c9b037] text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-[#a0892c] transition active:scale-95"
              style={{ letterSpacing: "0.5px" }}
            >
              Tutti i prodotti
            </a>
          </div>
        </section>

        {/* Contatti */}
        <section
          ref={contattiRef}
          className="w-full max-w-[700px] mx-auto py-16 px-4 flex flex-col items-center"
        >
          <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-gray-900 mb-6 text-center">
            Contatti
          </h2>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 w-full flex flex-col items-center">
            <div className="text-xl font-semibold mb-2 font-playfair text-[#c9b037]">
              Ferramenta Lucini Srl
            </div>
            <div className="text-gray-700 text-base mb-1">
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
            <div className="text-gray-700 text-base">
              Tel: 031 1234567
            </div>
            <div className="mt-6 text-sm text-gray-400">
              © 2024 Ferramenta Lucini
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
